package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/anujshandillya/lamurTypeServer/routes"
)

// func init() {
// 	err := godotenv.Load()
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	mongoUri := os.Getenv("MONGO_URI")
// 	dbName := "gamble"
// 	clientOptions := options.Client().ApplyURI(mongoUri)

// 	client, err := mongo.Connect(clientOptions)

// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	fmt.Println("Connected to MongoDB.")
// }

func main() {
	r := routes.Router
	fmt.Println("Server is getting started...")
	log.Fatal(http.ListenAndServe(":4000", r))
	fmt.Println("Server is running on port 4000.")
}
