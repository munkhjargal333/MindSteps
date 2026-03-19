package smtp

import (
	"context"
	"crypto/tls"
	"encoding/base64"
	"fmt"
	"net"
	"net/smtp"
	"time"

	"mindsteps/config"

	"github.com/google/uuid"
	"golang.org/x/oauth2"
)

// EmailConfig holds the SMTP configuration with additional OAuth details
type EmailConfig struct {
	SMTPServer   string
	SMTPPort     int
	SMTPUser     string
	SMTPPassword string
	ClientID     string
	TenantID     string
	ClientSecret string
}

// OAuthTokenResponse represents the OAuth token response
type OAuthTokenResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int    `json:"expires_in"`
}

// SMTPClient represents the SMTP client with OAuth support
type SMTPClient struct {
	client      *smtp.Client
	config      *EmailConfig
	accessToken string
	tokenExpiry time.Time
}

// OAuthAuthenticator implements custom OAuth authentication
type OAuthAuthenticator struct {
	email       string
	accessToken string
}

// Start implements the Start method of smtp.Auth
func (a *OAuthAuthenticator) Start(server *smtp.ServerInfo) (string, []byte, error) {
	auth := fmt.Sprintf("user=%s\x01auth=Bearer %s\x01\x01", a.email, a.accessToken)
	encodedAuth := base64.StdEncoding.EncodeToString([]byte(auth))
	return "XOAUTH2", []byte(encodedAuth), nil
}

// Next implements the Next method of smtp.Auth
func (a *OAuthAuthenticator) Next(fromServer []byte, more bool) ([]byte, error) {
	// Log the incoming server challenge
	fmt.Printf("Server Challenge Received: more=%v, data=%s\n", more, string(fromServer))

	// If more is true, the server is expecting a response
	if more {
		// Log the unexpected challenge
		fmt.Printf("Unexpected server challenge: %s\n", string(fromServer))

		// You might want to handle specific types of challenges
		// For example, decode base64 challenge if needed
		// decodedChallenge, err := base64.StdEncoding.DecodeString(string(fromServer))
		// if err != nil {
		//     fmt.Printf("Failed to decode challenge: %v\n", err)
		// }

		// Return an error or handle the challenge appropriately
		return nil, fmt.Errorf("unexpected server challenge: %s", string(fromServer))
	}

	// If more is false, authentication is complete
	fmt.Println("Authentication challenge completed")
	return nil, nil
}

// newSMTPClient creates a new SMTP client
func newSMTPClient(cfg *EmailConfig) *SMTPClient {
	return &SMTPClient{
		config: cfg,
	}
}

// getOAuthConfig creates OAuth2 configuration for Microsoft Exchange
func (c *SMTPClient) getOAuthConfig() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     c.config.ClientID,
		ClientSecret: c.config.ClientSecret,
		Endpoint: oauth2.Endpoint{
			AuthURL:  "https://login.microsoftonline.com/" + c.config.TenantID + "/oauth2/v2.0/authorize",
			TokenURL: "https://login.microsoftonline.com/" + c.config.TenantID + "/oauth2/v2.0/token",
		},
		Scopes: []string{
			"https://outlook.office365.com/.default",
		},
	}
}

func (c *SMTPClient) obtainAccessToken() error {
	ctx := context.Background()
	oauthCfg := c.getOAuthConfig()
	token, err := oauthCfg.PasswordCredentialsToken(ctx, c.config.SMTPUser, c.config.SMTPPassword)
	if err != nil {
		return fmt.Errorf("failed to obtain access token: %v", err)
	}

	c.accessToken = token.AccessToken
	c.tokenExpiry = token.Expiry
	return nil
}

// connectSMTP establishes a new SMTP connection
func (c *SMTPClient) connectSMTP() error {
	if c.accessToken == "" || time.Now().After(c.tokenExpiry) {
		if err := c.obtainAccessToken(); err != nil {
			return fmt.Errorf("token retrieval failed: %v", err)
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	dialer := &net.Dialer{
		Timeout: 5 * time.Second,
	}

	conn, err := dialer.DialContext(ctx, "tcp", fmt.Sprintf("%s:%d", c.config.SMTPServer, c.config.SMTPPort))
	if err != nil {
		return fmt.Errorf("failed to connect to SMTP server: %v", err)
	}
	defer func() {
		if conn != nil {
			conn.Close()
		}
	}()

	client, err := smtp.NewClient(conn, c.config.SMTPServer)
	if err != nil {
		return fmt.Errorf("failed to create SMTP client: %v", err)
	}

	tlsConfig := &tls.Config{
		ServerName:         c.config.SMTPServer,
		InsecureSkipVerify: false, // Be cautious with this
		MinVersion:         tls.VersionTLS12,
	}

	if err := client.StartTLS(tlsConfig); err != nil {
		return fmt.Errorf("failed to start TLS: %v", err)
	}

	auth := &OAuthAuthenticator{
		email:       c.config.SMTPUser,
		accessToken: c.accessToken,
	}

	if err := client.Auth(auth); err != nil {
		return fmt.Errorf("SMTP server authentication failed: %v", err)
	}

	c.client = client
	return nil
}

// SendEmail sends an email using the SMTP client
func (c *SMTPClient) SendEmail(to, subject, body string) (string, error) {
	// Ensure we have an active SMTP connection
	if c.client == nil {
		if err := c.connectSMTP(); err != nil {
			return "", err
		}
	}

	// Generate unique message ID
	messageID := uuid.New().String()

	// Prepare message
	from := c.config.SMTPUser
	msg := []byte(fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\nMessage-ID: <%s@binary.systems.mn>\r\n\r\n%s",
		from, to, subject, messageID, body))

	// Set sender and recipient
	if err := c.client.Mail(from); err != nil {
		return "", fmt.Errorf("failed to set 'From' address: %v", err)
	}
	if err := c.client.Rcpt(to); err != nil {
		return "", fmt.Errorf("failed to set 'To' address: %v", err)
	}

	// Send message data
	w, err := c.client.Data()
	if err != nil {
		return "", fmt.Errorf("failed to get data writer: %v", err)
	}
	defer w.Close()

	_, err = w.Write(msg)
	if err != nil {
		return "", fmt.Errorf("failed to write message: %v", err)
	}

	return messageID, nil
}

// CloseClient closes the SMTP client connection
func (c *SMTPClient) CloseClient() error {
	if c.client != nil {
		return c.client.Quit()
	}
	return nil
}

// Global SMTP client
var smtpClient *SMTPClient

// Load initializes the SMTP client
func Load() error {
	// Retrieve SMTP configuration
	cfg := config.Get().Smtp

	// Create new SMTP client
	smtpClient = newSMTPClient(&EmailConfig{
		SMTPServer:   cfg.SMTPServer,
		SMTPPort:     cfg.SMTPPort, // Standard TLS port
		SMTPUser:     cfg.SMTPUser,
		SMTPPassword: cfg.SMTPPassword,
		ClientID:     cfg.ClientID,
		TenantID:     cfg.TenantID,
		ClientSecret: cfg.ClientSecret,
	})

	// Attempt initial connection
	return smtpClient.connectSMTP()
}

// SendEmail wrapper function
func SendEmail(to, subject, body string) (string, error) {
	if smtpClient == nil {
		return "", fmt.Errorf("SMTP client not initialized")
	}
	return smtpClient.SendEmail(to, subject, body)
}
