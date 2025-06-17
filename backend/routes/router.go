package routes

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

func helloAPI(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode("helloAPI")
}

var Router *mux.Router = mux.NewRouter()

// var authRouter = Router.PathPrefix("/api/auth").Subrouter()

func init() {
	Router.HandleFunc("/api/hello", helloAPI).Methods("GET")
}
