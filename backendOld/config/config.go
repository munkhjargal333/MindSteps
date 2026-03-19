package config

import (
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2/log"
	"github.com/joho/godotenv"
)

type database struct {
	Host     string
	Port     int
	User     string
	Password string
	Name     string
	Schema   string
}

type auth struct {
	JwtPrivateKey string
	JwtPublicKey  string
}
type api struct {
	Port       int
	SystemCode string
}

//	type firebase struct {
//		Type                    string `json:"type"`
//		ProjectID               string `json:"project_id"`
//		PrivateKeyID            string `json:"private_key_id"`
//		PrivateKey              string `json:"private_key"`
//		ClientEmail             string `json:"client_email"`
//		ClientID                string `json:"client_id"`
//		AuthURI                 string `json:"auth_uri"`
//		TokenURI                string `json:"token_uri"`
//		AuthProviderX509CertURL string `json:"auth_provider_x509_cert_url"`
//		ClientX509CertURL       string `json:"client_x509_cert_url"`
//		UniverseDomain          string `json:"universe_domain"`
//	}
type smtp struct {
	SMTPServer   string
	SMTPPort     int
	SMTPUser     string
	SMTPPassword string
	ClientID     string
	TenantID     string
	ClientSecret string
}

type cloudApi struct { //cloudflare
	Endpoint   string
	AccessKey  string
	SecretKey  string
	BucketName string
	CdnURL     string
}

type config struct {
	IsProduction bool
	DB           *database
	Auth         *auth
	//Firebase     *firebase
	Api      *api
	Smtp     *smtp
	CloudApi *cloudApi
}

var cfg *config

func MustLoad() {
	// ubcard := os.Getenv("UBCARD_ENV")

	// isProduction := true
	// if strings.ToLower(ubcard) != "production" {
	// 	isProduction = false
	// 	godotenv.Load()
	// }
	godotenv.Load()
	cfg = &config{
		//IsProduction: isProduction,
		DB: &database{
			Host:     loadString("DB_HOST"),
			Port:     loadInt("DB_PORT"),
			Name:     loadString("DB_NAME"),
			User:     loadString("DB_USER"),
			Password: loadString("DB_PASSWORD"),
			Schema:   loadString("DB_SCHEMA"),
		},

		Auth: &auth{
			JwtPublicKey:  loadString("AUTH_JWT_PUBLIC_KEY"),
			JwtPrivateKey: loadString("AUTH_JWT_PRIVATE_KEY"),
		},

		CloudApi: &cloudApi{
			Endpoint:   loadString("ENDPOINT"),
			AccessKey:  loadString("ACCESSKEY"),
			SecretKey:  loadString("SECRETKEY"),
			BucketName: loadString("BUCKET_NAME"),
			CdnURL:     loadString("CDN_URL"),
		},

		// Smtp: &smtp{
		// 	SMTPServer:   loadString("SMTP_SERVER"),
		// 	SMTPPort:     loadInt("SMTP_PORT"),
		// 	SMTPUser:     loadString("SMTP_USER_NAME"),
		// 	SMTPPassword: loadString("SMTP_PASSWORD"),
		// 	ClientID:     loadString("SMTP_CLIENT_ID"),
		// 	TenantID:     loadString("SMTP_TENANT_ID"),
		// 	ClientSecret: loadString("SMTP_CLIENT_SECRET"),
		// },

		// Firebase: &firebase{
		// 	Type:                    loadString("FIREBASE_TYPE"),
		// 	ProjectID:               loadString("FIREBASE_PROJECT_ID"),
		// 	PrivateKeyID:            loadString("FIREBASE_PRIVATE_KEY_ID"),
		// 	PrivateKey:              loadString("FIREBASE_PRIVATE_KEY"),
		// 	ClientEmail:             loadString("FIREBASE_CLIENT_EMAIL"),
		// 	ClientID:                loadString("FIREBASE_CLIENT_ID"),
		// 	AuthURI:                 loadString("FIREBASE_AUTH_URI"),
		// 	TokenURI:                loadString("FIREBASE_TOKEN_URI"),
		// 	AuthProviderX509CertURL: loadString("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
		// 	ClientX509CertURL:       loadString("FIREBASE_CLIENT_X509_CERT_URL"),
		// 	UniverseDomain:          loadString("FIREBASE_UNIVERSE_DOMAIN"),
		// },
	}
}

func Get() *config {
	if cfg == nil {
		log.Fatal("Config not loaded. Please call MustLoadConfig before using GetConfig.")
	}

	return cfg
}

func loadString(key string) string {
	val := os.Getenv(key)
	if val == "" {
		log.Fatal("Environment variable " + key + " is not set")
	}

	return val
}

func loadInt(key string) int {
	s := loadString(key)

	val, err := strconv.Atoi(s)
	if err != nil {
		log.Fatal("Environment variable " + key + " is not number")
	}

	return val
}
