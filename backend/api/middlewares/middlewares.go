package middlewares

import (
	"errors"
	"net/http"

	"github.com/lcslucas/web/api/auth"
	"github.com/lcslucas/web/api/responses"
)

func SetMiddlewareJSON(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Add("Vary", "Origin")
		/*w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Vary", "Origin")
		w.Header().Add("Vary", "Access-Control-Request-Method")
		w.Header().Add("Vary", "Access-Control-Request-Headers")
		w.Header().Add("Access-Control-Allow-Headers", "Content-Type, Origin, Accept, token")
		w.Header().Add("Access-Control-Allow-Methods", "GET, POST,OPTIONS")*/

		if r.Method == "OPTIONS" {
			responses.JSON(w, http.StatusOK, nil)
			return
		}

		next(w, r)
	}
}

func SetMiddlewareAuthentication(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Add("Vary", "Origin")
		/*w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Vary", "Origin")
		w.Header().Add("Vary", "Access-Control-Request-Method")
		w.Header().Add("Vary", "Access-Control-Request-Headers")
		w.Header().Add("Access-Control-Allow-Headers", "Content-Type, Origin, Accept, token")
		w.Header().Add("Access-Control-Allow-Methods", "GET, POST,OPTIONS")*/

		if r.Method == "OPTIONS" {
			responses.JSON(w, http.StatusOK, nil)
			return
		}

		err := auth.TokenValid(r)
		if err != nil {
			responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized Authentication"))
			return
		}
		next(w, r)
	}
}
