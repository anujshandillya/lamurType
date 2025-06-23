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
	// Apply CORS middleware to all routes
	Router.Use(mux.CORSMethodMiddleware(Router))

	Router.HandleFunc("/api/hello", middleware.CORS(middleware.VerifyJWT(helloAPI))).Methods("GET", "OPTIONS")

	authRouter.HandleFunc("/register", middleware.CORS(controllers.Register)).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/login", middleware.CORS(controllers.Login)).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/logout", middleware.CORS(middleware.VerifyJWT(controllers.Logout))).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/me", middleware.CORS(middleware.VerifyJWT(controllers.GetCurrentUser))).Methods("GET", "OPTIONS")

	leaderboardRouter.HandleFunc("/", middleware.CORS(middleware.VerifyJWT(controllers.HandleLeaderboard))).Methods("GET", "POST", "OPTIONS")
	leaderboardRouter.HandleFunc("/profile", middleware.CORS(middleware.VerifyJWT(controllers.GetLeaderboardProfile))).Methods("GET", "OPTIONS")
}
