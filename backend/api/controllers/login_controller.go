package controllers

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"

	"github.com/jinzhu/gorm"
	"github.com/lcslucas/web/api/auth"
	"github.com/lcslucas/web/api/models"
	"github.com/lcslucas/web/api/responses"
	"github.com/lcslucas/web/api/utils/formaterror"
)

func (server *Server) CheckToken(w http.ResponseWriter, r *http.Request) {
	err := auth.TokenValid(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, nil)
		return
	}

	responses.JSON(w, http.StatusOK, nil)
}

func (server *Server) Login(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	user := models.User{}
	err = json.Unmarshal(body, &user)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	user.PrepareData()
	err = user.ValidateData("login")
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	token, err := server.Autenticar(user.Email, user.Senha)

	if err != nil {
		formattedError := formaterror.FormatError(err.Error())
		responses.ERROR(w, http.StatusUnprocessableEntity, formattedError)
		return
	}
	responses.JSON(w, http.StatusOK, token)
}

func (server *Server) Autenticar(email, senha string) (string, error) {
	var err error

	user := models.User{}

	err = server.DB.Debug().Model(models.User{}).Where("email = ?", email).Take(&user).Error
	if gorm.IsRecordNotFoundError(err) {
		return "", errors.New("Usuário ou senha estão incorretos.")
	}
	if err != nil {
		return "", err
	}

	err = models.VerifyPassword(user.Senha, senha)
	if err != nil {
		return "", errors.New("Usuário ou senha estão incorretos.")
	}

	return auth.CreateToken(user.ID)
}
