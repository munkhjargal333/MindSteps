package minio

// import (
// 	"context"
// 	"crypto/tls"
// 	"fmt"
// 	"io"
// 	"log"
// 	"net/http"
// 	"net/url"
// 	"strings"
// 	"time"
// 	"trash-bin-management/config"

// 	"github.com/minio/minio-go/v7"
// 	"github.com/minio/minio-go/v7/pkg/credentials"
// )

// var MinioClient *minio.Client

// type Client struct {
// 	endpoint  string
// 	accessKey string
// 	secretKey string
// }

// // Load initializes the MinIO client.
// func Load() error {
// 	config := config.Get().CloudApi

// 	client := &Client{
// 		endpoint:  config.Endpoint,
// 		accessKey: config.AccessKey,
// 		secretKey: config.SecretKey,
// 	}

// 	tr := &http.Transport{
// 		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
// 	}

// 	var err error
// 	MinioClient, err = minio.New(client.endpoint, &minio.Options{
// 		Creds:     credentials.NewStaticV4(client.accessKey, client.secretKey, ""),
// 		Secure:    false,
// 		Transport: tr,
// 	})
// 	if err != nil {
// 		return fmt.Errorf("failed to initialize MinIO client: %w", err)
// 	}

// 	if MinioClient == nil {
// 		return fmt.Errorf("minio")
// 	}

// 	return nil
// }

// // ObjectExists checks if an object exists in a given bucket.
// func ObjectExists(bucketName, objectName string) (bool, error) {
// 	if MinioClient == nil {
// 		return false, fmt.Errorf("MinIO client is not loaded")
// 	}

// 	_, err := MinioClient.StatObject(context.Background(), bucketName, objectName, minio.StatObjectOptions{})
// 	if err != nil {
// 		if minio.ToErrorResponse(err).Code == "NoSuchKey" {
// 			return false, nil
// 		}
// 		return false, fmt.Errorf("failed to stat object: %w", err)
// 	}
// 	return true, nil
// }

// // PutObject uploads an object to a specified bucket.
// func PutObject(bucketName, objectName, contentType string, file io.Reader, objectSize int64) (string, error) {
// 	if MinioClient == nil {
// 		return "", fmt.Errorf("MinIO client is not loaded")
// 	}

// 	n, err := MinioClient.PutObject(context.Background(), bucketName, objectName, file, objectSize, minio.PutObjectOptions{ContentType: contentType})
// 	if err != nil {
// 		return "", fmt.Errorf("failed to put object: %w", err)
// 	}

// 	imagePath := fmt.Sprintf("%s/%s/%s", strings.TrimRight(MinioClient.EndpointURL().String(), "/"), bucketName, objectName)
// 	log.Printf("Successfully uploaded %s of size %d\n", imagePath, n.Size)
// 	return imagePath, nil
// }

// // DeleteObject removes an object from a specified bucket.
// func DeleteObject(bucketName, objectName string) error {
// 	if MinioClient == nil {
// 		return fmt.Errorf("MinIO client is not loaded")
// 	}

// 	err := MinioClient.RemoveObject(context.Background(), bucketName, objectName, minio.RemoveObjectOptions{})
// 	if err != nil {
// 		return fmt.Errorf("failed to delete object: %w", err)
// 	}

// 	return nil
// }

// // GetPresignedURL generates a presigned URL for an object.
// func GetPresignedURL(ctx context.Context, bucketName string, objectName string, expiry time.Duration) (string, error) {
// 	if MinioClient == nil {
// 		return "", fmt.Errorf("MinIO client is not loaded")
// 	}

// 	reqParams := make(url.Values)
// 	presignedURL, err := MinioClient.PresignedGetObject(ctx, bucketName, objectName, expiry, reqParams)
// 	if err != nil {
// 		return "", fmt.Errorf("failed to generate presigned URL: %w", err)
// 	}

// 	return presignedURL.String(), nil
// }
