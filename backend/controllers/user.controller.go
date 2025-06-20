package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/anujshandillya/lamurTypeServer/helpers"
	"github.com/anujshandillya/lamurTypeServer/models"
)

type RegisterBody struct {
	FirstName string       `json:"first_name"`
	LastName  string       `json:"last_name"`
	Email     string       `json:"email"`
	Password  string       `json:"password"`
	Image     models.Image `json:"image"`
}

func Register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var user RegisterBody

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	newUser, err := helpers.CreateUser(models.User{
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Email:     user.Email,
		Password:  user.Password,
		Image:     user.Image,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]string{"error": "User already exists"})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully", "user_id": newUser.InsertedID.(string)})
}

func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var user models.User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	foundUser, err := helpers.GetUserByEmail(user.Email)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	if err := helpers.CheckPasswordHash(user.Password, foundUser.Password); err != nil {
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	sessionToken, err := helpers.CreateSession(foundUser.ID.Hex())
	if err != nil {
		http.Error(w, "Failed to create session", http.StatusInternalServerError)
		return
	}

	helpers.SetCookie("token", sessionToken, w)
	helpers.SetCookie("userId", foundUser.ID.Hex(), w)

	json.NewEncoder(w).Encode(map[string]string{"message": "Login successful", "session_token": sessionToken})
}

func Logout(w http.ResponseWriter, r *http.Request) {
	helpers.UnsetCookie("token", w)
	helpers.UnsetCookie("userId", w)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Logout successful"})
}
