package gpssocket

// import (
// 	"log"
// 	"net/http"
// 	"os"
// 	"os/signal"
// 	"syscall"

// 	socketio "github.com/googollee/go-socket.io"
// 	"github.com/googollee/go-socket.io/engineio"
// 	"github.com/googollee/go-socket.io/engineio/transport"
// 	"github.com/googollee/go-socket.io/engineio/transport/polling"
// 	"github.com/googollee/go-socket.io/engineio/transport/websocket"
// )

// // UserConnection represents a user's connection information
// type UserConnection struct {
// 	SocketID string
// }

// var (
// 	server *socketio.Server
// )

// // Allow all origins (in production, you might want to restrict this)
// var allowOriginFunc = func(r *http.Request) bool {
// 	return true
// }

// // A simple HTTP handler to verify that the server is running
// func SayHelloWorld(w http.ResponseWriter, r *http.Request) {
// 	w.Write([]byte("Hello, socket!"))
// }

// // Initialize the Socket.IO server
// func SocketInit() {
// 	// Create a new Socket.IO server with both polling and websocket transports
// 	server = socketio.NewServer(&engineio.Options{
// 		Transports: []transport.Transport{
// 			&polling.Transport{
// 				CheckOrigin: allowOriginFunc, // CORS support for polling
// 			},
// 			&websocket.Transport{
// 				CheckOrigin: allowOriginFunc, // CORS support for WebSocket
// 			},
// 		},
// 	})

// 	// Handle new connections
// 	server.OnConnect("/", func(s socketio.Conn) error {
// 		log.Printf("New connection: %s\n", s.ID())
// 		log.Printf("Server rooms: %v\n", server.Rooms("/"))
// 		return nil
// 	})

// 	// Handle disconnections
// 	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
// 		server.LeaveAllRooms("/", s) // Ensure the user leaves all rooms on disconnect
// 		log.Printf("Disconnected: %s Reason: %s\n", s.ID(), reason)
// 	})

// 	// Handle errors
// 	server.OnError("/", func(s socketio.Conn, e error) {
// 		log.Printf("Error: %s\n", e)
// 	})

// 	// Event handler for joining rooms based on 'routeID'
// 	server.OnEvent("/", "joinRoute", func(s socketio.Conn, routeID string) {
// 		// Join the specified room (routeID)
// 		res := server.JoinRoom("/", routeID, s)
// 		if res {
// 			log.Printf("User joined room: %s\n", routeID)
// 		} else {
// 			log.Printf("Failed to join room: %s\n", routeID)
// 		}
// 		log.Printf("Current rooms after joining: %v\n", server.Rooms("/"))
// 	})

// 	server.OnEvent("/", "gps_event", func(s socketio.Conn, msg map[string]interface{}) {
// 		room := msg["room"].(string) // Get the room name from the message
// 		text := msg["text"].(string) // Get the message text

// 		// Log the message
// 		log.Printf("send message in room %s: %s\n", room, text)

// 		SendMessageToUser(room, "gps_event", text)
// 	})

// 	// Handle the socket.io path with CORS
// 	http.Handle("/socket.io/", server)
// 	http.HandleFunc("/", SayHelloWorld) // Basic test route

// 	// Start the socket.io server in a goroutine
// 	go func() {
// 		if err := server.Serve(); err != nil {
// 			log.Fatalf("socketio listen error: %s\n", err)
// 		}
// 	}()
// 	defer server.Close()

// 	// Start the HTTP server with CORS
// 	port := os.Getenv("PORT")
// 	if port == "" {
// 		port = "8090" // Default port if not set
// 	}

// 	log.Printf("Serving at localhost:%s...\n", port)
// 	err := http.ListenAndServe(":"+port, nil)
// 	if err != nil {
// 		log.Fatalf("ListenAndServe error: %s\n", err)
// 	}

// 	// Graceful shutdown handling
// 	stop := make(chan os.Signal, 1)
// 	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
// 	<-stop
// 	log.Println("Shutting down server...")
// }

// // SendMessageToUser broadcasts a message to a specific room
// func SendMessageToUser(roomName string, eventName string, data string) {
// 	success := server.BroadcastToRoom("/", roomName, eventName, data)
// 	if !success {
// 		log.Println("Failed to broadcast data to room:", roomName)
// 	} else {
// 		log.Println("Broadcast successful to room:", roomName)
// 	}
// }
