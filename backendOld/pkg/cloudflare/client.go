package cloudflare

import (
	"context"
	"crypto/tls"
	"fmt"
	"io"
	"log"
	"mindsteps/config"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

var R2Client *minio.Client

type Client struct {
	endpoint  string
	accessKey string
	secretKey string
}

// Load initializes the Cloudflare R2 client.
func Load() error {
	cfg := config.Get().CloudApi
	client := &Client{
		endpoint:  cfg.Endpoint,  // зөвхөн host: "<accountid>.r2.cloudflarestorage.com"
		accessKey: cfg.AccessKey, // R2 Access Key ID
		secretKey: cfg.SecretKey, // R2 Secret Access Key
	}

	// Transport тохиргоо (TLS идэвхтэй)
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: false},
	}

	// MinIO client үүсгэх
	var err error
	R2Client, err = minio.New(client.endpoint, &minio.Options{
		Creds:     credentials.NewStaticV4(client.accessKey, client.secretKey, ""),
		Secure:    true, // HTTPS ашиглана
		Transport: tr,
	})
	if err != nil {
		return fmt.Errorf("failed to initialize R2 client: %w", err)
	}

	if R2Client == nil {
		return fmt.Errorf("R2 client is nil")
	}

	return nil
}

// ObjectExists checks if an object exists in a given bucket.
func ObjectExists(bucketName, objectName string) (bool, error) {
	if R2Client == nil {
		return false, fmt.Errorf("R2 client is not loaded")
	}

	_, err := R2Client.StatObject(context.Background(), bucketName, objectName, minio.StatObjectOptions{})
	if err != nil {
		if minio.ToErrorResponse(err).Code == "NoSuchKey" {
			return false, nil
		}
		return false, fmt.Errorf("failed to stat object: %w", err)
	}
	return true, nil
}

// PutObject uploads an object to a specified bucket.
func PutObject(bucketName, objectName, contentType string, file io.Reader, objectSize int64) (string, error) {
	if R2Client == nil {
		return "", fmt.Errorf("R2 client is not loaded")
	}

	n, err := R2Client.PutObject(context.Background(), bucketName, objectName, file, objectSize, minio.PutObjectOptions{ContentType: contentType})
	if err != nil {
		return "", fmt.Errorf("failed to put object: %w", err)
	}

	objectURL := fmt.Sprintf("%s/%s/%s", strings.TrimRight(R2Client.EndpointURL().String(), "/"), bucketName, objectName)
	log.Printf("Successfully uploaded %s of size %d\n", objectURL, n.Size)
	return objectURL, nil
}

// DeleteObject removes an object from a specified bucket.
func DeleteObject(bucketName, objectName string) error {
	if R2Client == nil {
		return fmt.Errorf("R2 client is not loaded")
	}

	err := R2Client.RemoveObject(context.Background(), bucketName, objectName, minio.RemoveObjectOptions{})
	if err != nil {
		return fmt.Errorf("failed to delete object: %w", err)
	}

	return nil
}

// GetPresignedURL generates a presigned URL for an object.
func GetPresignedURL(ctx context.Context, bucketName string, objectName string, expiry time.Duration) (string, error) {
	if R2Client == nil {
		return "", fmt.Errorf("R2 client is not loaded")
	}

	reqParams := make(url.Values)
	presignedURL, err := R2Client.PresignedGetObject(ctx, bucketName, objectName, expiry, reqParams)
	if err != nil {
		return "", fmt.Errorf("failed to generate presigned URL: %w", err)
	}

	return presignedURL.String(), nil
}
