package routes

import (
	"encoding/json"
	"net/http"

	"github.com/anujshandillya/lamurTypeServer/controllers"
	"github.com/anujshandillya/lamurTypeServer/middleware"
	"github.com/gorilla/mux"
)

func helloAPI(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode("helloAPI")
}

var Router *mux.Router = mux.NewRouter()

var authRouter = Router.PathPrefix("/api/auth").Subrouter()
var leaderboardRouter = Router.PathPrefix("/api/leaderboard").Subrouter()

func init() {
	Router.HandleFunc("/api/hello", middleware.VerifyJWT(helloAPI)).Methods("GET")

	authRouter.HandleFunc("/register", controllers.Register).Methods("POST")
	authRouter.HandleFunc("/login", controllers.Login).Methods("POST")
	authRouter.HandleFunc("/logout", middleware.VerifyJWT(controllers.Logout)).Methods("POST")
	authRouter.HandleFunc("/me", middleware.VerifyJWT(controllers.GetCurrentUser)).Methods("GET")

	leaderboardRouter.HandleFunc("/", middleware.VerifyJWT(controllers.HandleLeaderboard)).Methods("GET", "POST")
	leaderboardRouter.HandleFunc("/profile", middleware.VerifyJWT(controllers.GetLeaderboardProfile)).Methods("GET")
}
