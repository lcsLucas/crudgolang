package controllers

import (
	"net/http"

	"github.com/lcslucas/web/api/responses"
)

func (server *Server) Home(w http.ResponseWriter, r *http.Request) {
	responses.JSON(w, http.StatusOK, "Bem vindo à API")
}
