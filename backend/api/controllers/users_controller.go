package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/lcslucas/web/api/auth"
	"github.com/lcslucas/web/api/models"
	"github.com/lcslucas/web/api/responses"
	"github.com/lcslucas/web/api/utils/formaterror"
)

func (server *Server) CreateUser(w http.ResponseWriter, r *http.Request) {

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
	}

	user := models.User{}
	err = json.Unmarshal(body, &user)

	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	user.PrepareData()
	err = user.ValidateData("")

	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	userCreated, err := user.SaveUser(server.DB)

	if err != nil {
		formattedError := formaterror.FormatError(err.Error())

		responses.ERROR(w, http.StatusInternalServerError, formattedError)
		return
	}

	w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, userCreated.ID))
	responses.JSON(w, http.StatusCreated, userCreated)
}

func (server *Server) GetUsers(w http.ResponseWriter, r *http.Request) {
	user := models.User{}

	users, err := user.FindAllUsers(server.DB)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusOK, users)
}

func (server *Server) GetUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	param_id, err := strconv.ParseUint(vars["id"], 10, 32)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	user := models.User{}
	userFind, err := user.FindUserByID(server.DB, uint32(param_id))
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}
	responses.JSON(w, http.StatusOK, userFind)
}

func (server *Server) DeleteUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	param_id, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	tokenID, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Acesso Negado"))
	}

	if param_id == uint64(tokenID) {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Acesso negado. Você não pode excluir o próprio usuário"))
		return
	}

	user := models.User{}

	_, err = user.DeleteUser(server.DB, param_id)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	w.Header().Set("Entity", fmt.Sprintf("%d", param_id))
	responses.JSON(w, http.StatusNoContent, "")

}

func (server *Server) UpdateUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	param_id, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	tokenID, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Acesso Negado"))
		return
	}

	if param_id != uint64(tokenID) {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Acesso Negado"))
		return
	}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	userUpdate := models.User{}
	err = json.Unmarshal(body, &userUpdate)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	userUpdate.ID = uint32(param_id)

	userUpdated, err := userUpdate.UpdateUser(server.DB)
	if err != nil {
		formatError := formaterror.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, formatError)
		return
	}

	responses.JSON(w, http.StatusOK, userUpdated)

}
