package models

import (
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type Leaderboard struct {
	ID        bson.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Type      string        `json:"type" bson:"type"`
	WPM       int           `json:"wpm" bson:"wpm"`
	Time      int           `json:"time" bson:"time"`
	Name      string        `json:"name" bson:"name"`
	CreatedAt bson.DateTime `json:"created_at" bson:"created_at"`
	User      User          `json:"user" bson:"user"`
	UserID    bson.ObjectID `json:"user_id" bson:"user_id"`
}

var LeaderboardCollection *mongo.Collection
