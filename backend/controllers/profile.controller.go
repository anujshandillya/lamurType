package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"sync"
	"time"

	"github.com/anujshandillya/lamurTypeServer/models"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func GetUserStats(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Get user ID from header (set by middleware)
	userID := r.Header.Get("user_id")
	if userID == "" {
		http.Error(w, "User not authenticated", http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "User not authenticated"})
		return
	}

	yesterday := time.Now().Add(-24 * time.Hour)

	// Convert string user ID to ObjectID
	objectID, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid user ID"})
		return
	}

	var dailyProfile []models.Leaderboard
	var allTimeProfile []models.Leaderboard
	var bestProfile []models.Leaderboard
	var dailyErr, allTimeErr, bestErr error

	var wg sync.WaitGroup
	wg.Add(3)

	go func() {
		defer wg.Done()
		dailyFilter := bson.M{"user_id": objectID, "created_at": bson.M{"$gte": yesterday}}
		dailyCursor, err := models.LeaderboardCollection.Find(ctx, dailyFilter, options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}}))
		if err != nil {
			dailyErr = err
			return
		}
		defer dailyCursor.Close(ctx)

		if err := dailyCursor.All(ctx, &dailyProfile); err != nil {
			dailyErr = err
			return
		}
	}()

	go func() {
		defer wg.Done()
		allTimeFilter := bson.M{"user_id": objectID, "created_at": bson.M{"$gte": yesterday}}
		allTimeCursor, err := models.LeaderboardCollection.Find(ctx, allTimeFilter, options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}}))
		if err != nil {
			allTimeErr = err
			return
		}
		defer allTimeCursor.Close(ctx)

		if err := allTimeCursor.All(ctx, &allTimeProfile); err != nil {
			allTimeErr = err
			return
		}
	}()

	go func() {
		defer wg.Done()
		bestFilter := bson.M{"user_id": objectID, "created_at": bson.M{"$gte": yesterday}}
		bestCursor, err := models.LeaderboardCollection.Find(ctx, bestFilter, options.Find().SetSort(bson.D{{Key: "wpm", Value: -1}}))
		if err != nil {
			bestErr = err
			return
		}
		defer bestCursor.Close(ctx)

		if err := bestCursor.All(ctx, &bestProfile); err != nil {
			bestErr = err
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

	if bestErr != nil {
		http.Error(w, bestErr.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]any{
		"daily":   dailyProfile,
		"allTime": allTimeProfile,
		"best":    bestProfile,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
