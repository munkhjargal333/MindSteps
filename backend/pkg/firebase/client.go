package firebase

// import (
// 	"context"
// 	"encoding/json"
// 	"fmt"

// 	"trash-bin-management/config"

// 	firebase "firebase.google.com/go/v4"
// 	"firebase.google.com/go/v4/messaging"
// 	"github.com/gofiber/fiber/v2/log"
// 	"google.golang.org/api/option"
// )

// var client *firebase.App

// func MustLoad() {
// 	config := config.Get().Firebase

// 	raw, err := json.Marshal(config)
// 	if err != nil {
// 		log.Fatalf("can not marshal firebase config: %v", err)
// 	}

// 	// Initialize Firebase app with credentials JSON
// 	opt := option.WithCredentialsJSON(raw)
// 	client, err = firebase.NewApp(context.Background(), nil, opt)
// 	if err != nil {
// 		log.Fatalf("failed to initialize firebase client: %v", err)
// 	}
// }

// func Send(ctx context.Context, token string, title string, description string, imageURL string) error {
// 	fmt.Println(token)
// 	if client == nil {
// 		log.Fatal("messaging client does not initialized")
// 	}

// 	m, err := client.Messaging(ctx)
// 	if err != nil {
// 		return err
// 	}

// 	response, err := m.Send(ctx, &messaging.Message{
// 		Token: token,
// 		Notification: &messaging.Notification{
// 			Title:    title,
// 			Body:     description,
// 			ImageURL: imageURL,
// 		},
// 	})

// 	fmt.Println("response", response)
// 	_ = response

// 	return err
// }

// func SendAll(ctx context.Context, tokens []string, title string, description string, imageURL string) error {
// 	if client == nil {
// 		log.Fatal("messaging client does not initialized")
// 	}

// 	m, err := client.Messaging(ctx)
// 	if err != nil {
// 		return err
// 	}

// 	response, err := m.SendEachForMulticast(ctx, &messaging.MulticastMessage{
// 		Tokens: tokens,
// 		Notification: &messaging.Notification{
// 			Title:    title,
// 			Body:     description,
// 			ImageURL: imageURL,
// 		},
// 	})
// 	if err != nil {
// 		fmt.Println(err)
// 	}

// 	_ = response

// 	return err
// }
