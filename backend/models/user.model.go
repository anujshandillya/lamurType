package models

import (
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type Sessions struct {
	ID           bson.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	SessionToken string        `json:"session_token" bson:"session_token"`
	UserID       bson.ObjectID `json:"user_id" bson:"user_id"`
	Expires      bson.DateTime `json:"expires" bson:"expires"`
	User         User          `json:"user" bson:"user"`
}

type Image struct {
	Name        string `json:"name"`
	Data        []byte `json:"data"`
	ContentType string `json:"content_type"`
}

type User struct {
	ID            bson.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	FirstName     string        `json:"first_name" bson:"first_name"`
	LastName      string        `json:"last_name" bson:"last_name"`
	Email         string        `json:"email" bson:"email"`
	EmailVerified bson.DateTime `json:"email_verified" bson:"email_verified"`
	Image         Image         `json:"image,omitempty" bson:"image,omitempty"`
	Password      string        `json:"password" bson:"password"`
	Sessions      []Sessions    `json:"sessions,omitempty" bson:"sessions,omitempty"`
	Leaderboard   []Leaderboard `json:"leaderboard,omitempty" bson:"leaderboard,omitempty"`
}

var UserCollection *mongo.Collection
var SessionsCollection *mongo.Collection
