package middleware

import (
	"encoding/json"
	"net/http"
	"os"
	"strings"

	"github.com/anujshandillya/lamurTypeServer/helpers"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

// CORS middleware to handle cross-origin requests
func CORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173") // Your frontend URL
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	}
}

func VerifyJWT(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var tokenStr string

		cookie, err := r.Cookie("token")
		if err == nil {
			tokenStr = cookie.Value
		}

		if tokenStr == "" {
			authHeader := r.Header.Get("Authorization")
			if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
				tokenStr = strings.TrimPrefix(authHeader, "Bearer ")
			}
		}

		if tokenStr == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]any{"message": "unauthorized", "status": 401})
			return
		}

		claims := jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (any, error) {
			return jwtSecret, nil
		})
		if err != nil || !token.Valid {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		if helpers.IsTokenInvalid(tokenStr) {
			http.Error(w, "Token revoked", http.StatusUnauthorized)
			return
		}

		r.Header.Set("user_id", claims["user_id"].(string))

		next.ServeHTTP(w, r)
	}
}
