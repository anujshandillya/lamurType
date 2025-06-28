package helpers

import (
	"context"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/anujshandillya/lamurTypeServer/lib"
	"github.com/anujshandillya/lamurTypeServer/models"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"golang.org/x/crypto/bcrypt"
)

func SetCookie(name string, value string, w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     name,
		Value:    value,
		Expires:  time.Now().Add(15 * 24 * time.Hour), // 15 days
		HttpOnly: true,
		Path:     "/",
	})
}

func UnsetCookie(name string, w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     name,
		Value:    "",
		Expires:  time.Unix(0, 0), // Set to a past time to delete the cookie
		HttpOnly: true,
		Path:     "/",
	})
}

func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

func CheckPasswordHash(password, hash string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		return err
	}
	return nil
}

func CreateSession(userId string) (string, error) {
	token, err := lib.GenerateJWT(userId)
	if err != nil {
		return "", fmt.Errorf("failed to create session: %w", err)
	}
	return token, nil
}

func FindUserByEmail(email string) bool {
	err := models.UserCollection.FindOne(context.TODO(), bson.M{"email": email}).Err()
	return err == nil
}

func GetUserByEmail(email string) (models.User, error) {
	var user models.User
	err := models.UserCollection.FindOne(context.TODO(), bson.M{"email": email}).Decode(&user)
	if err != nil {
		return models.User{}, err
	}
	return user, nil
}

func GetUserById(userId string) (models.User, error) {
	var user models.User
	userObjID, err := bson.ObjectIDFromHex(userId)
	if err != nil {
		return models.User{}, err
	}
	err = models.UserCollection.FindOne(context.TODO(), bson.M{"_id": userObjID}).Decode(&user)
	if err != nil {
		return models.User{}, err
	}
	return user, nil
}

func CreateUser(user models.User) (*mongo.InsertOneResult, error) {
	ifUserExists := FindUserByEmail(user.Email)
	if !ifUserExists {
		hashedPassword, err := HashPassword(user.Password)
		if err != nil {
			return nil, err
		}
		user.Password = hashedPassword
		newUser, err := models.UserCollection.InsertOne(context.TODO(), user)
		if err != nil {
			return nil, err
		}
		return newUser, nil
	}
	return nil, fmt.Errorf("user with email %s already exists", user.Email)
}

var invalidatedTokens = make(map[string]time.Time)
var tokenMutex = &sync.Mutex{}

func InvalidateToken(token string) {
	tokenMutex.Lock()
	defer tokenMutex.Unlock()
	invalidatedTokens[token] = time.Now().Add(15 * 24 * time.Hour)
}

func IsTokenInvalid(token string) bool {
	tokenMutex.Lock()
	defer tokenMutex.Unlock()

	now := time.Now()
	for t, expiry := range invalidatedTokens {
		if now.After(expiry) {
			delete(invalidatedTokens, t)
		}
	}

	_, exists := invalidatedTokens[token]
	return exists
}
