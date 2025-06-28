package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/anujshandillya/lamurTypeServer/models"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func GetLeaderboard(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	yesterday := time.Now().Add(-24 * time.Hour)

	findOptions := options.Find()
	findOptions.SetSort(bson.D{{Key: "wpm", Value: -1}})
	findOptions.SetLimit(100)

	var dailyLeaderboard []models.Leaderboard
	var allTimeLeaderboard []models.Leaderboard
	var dailyErr, allTimeErr error

	var wg sync.WaitGroup
	wg.Add(2)

	go func() {
		defer wg.Done()
		dailyFilter := bson.M{"created_at": bson.M{"$gte": yesterday}}
		dailyCursor, err := models.LeaderboardCollection.Find(ctx, dailyFilter, findOptions)
		if err != nil {
			dailyErr = err
			return
		}
		defer dailyCursor.Close(ctx)

		if err := dailyCursor.All(ctx, &dailyLeaderboard); err != nil {
			dailyErr = err
			return
		}
	}()

	go func() {
		defer wg.Done()
		allTimeFilter := bson.M{}
		allTimeCursor, err := models.LeaderboardCollection.Find(ctx, allTimeFilter, findOptions)
		if err != nil {
			allTimeErr = err
			return
		}
		defer allTimeCursor.Close(ctx)

		if err := allTimeCursor.All(ctx, &allTimeLeaderboard); err != nil {
			allTimeErr = err
			return
		}
	}()

	wg.Wait()

	if dailyErr != nil {
		http.Error(w, dailyErr.Error(), http.StatusInternalServerError)
		return
	}

	if allTimeErr != nil {
		http.Error(w, allTimeErr.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]any{
		"daily":   dailyLeaderboard,
		"allTime": allTimeLeaderboard,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func CreateLeaderboardEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var leaderboardEntry models.Leaderboard
	if err := json.NewDecoder(r.Body).Decode(&leaderboardEntry); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		fmt.Println("Error decoding JSON:", err)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request payload"})
		return
	}

	leaderboardEntry.CreatedAt = bson.DateTime(time.Now().UnixNano() / 1e6)

	userID := r.Header.Get("user_id")
	if userID != "" {
		objectID, err := bson.ObjectIDFromHex(userID)
		if err != nil {
			http.Error(w, "Invalid user ID", http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Invalid user ID"})
			return
		}
		leaderboardEntry.UserID = objectID

		var user models.User
		err = models.UserCollection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&user)
		if err != nil {
			fmt.Println("Error finding user:", err)
		} else {
			leaderboardEntry.User = user
		}
	}

	result, err := models.LeaderboardCollection.InsertOne(ctx, leaderboardEntry)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if insertedID, ok := result.InsertedID.(bson.ObjectID); ok {
		leaderboardEntry.ID = insertedID
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(leaderboardEntry)
}

func HandleLeaderboard(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		GetLeaderboard(w, r)
	case http.MethodPost:
		CreateLeaderboardEntry(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"message": "Method not allowed"})
	}
}
