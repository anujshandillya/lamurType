package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/anujshandillya/lamurTypeServer/models"
	"github.com/anujshandillya/lamurTypeServer/routes"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}
	mongoUri := os.Getenv("MONGO_URI")
	dbName := "lamurtype"
	clientOptions := options.Client().ApplyURI(mongoUri)

	client, err := mongo.Connect(clientOptions)

	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connected to MongoDB.")

	models.UserCollection = client.Database(dbName).Collection("users")
	models.SessionsCollection = client.Database(dbName).Collection("sessions")
	models.LeaderboardCollection = client.Database(dbName).Collection("leaderboard")
}

func main() {
	r := routes.Router
	fmt.Println("Server is getting started...")
	fmt.Println("Server is running on port 3000.")
	log.Fatal(http.ListenAndServe(":3000", r))
}
