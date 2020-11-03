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

func (server *Server) CreatePost(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	fmt.Println(body)

	post := models.Post{}
	err = json.Unmarshal(body, &post)
	fmt.Println(post.DataPublicacao)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	post.PrepareData()
	err = post.ValidateData()
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	tokenID, err := auth.ExtractTokenID(r)

	if err != nil {
		fmt.Println(err)
		responses.ERROR(w, http.StatusUnauthorized, errors.New(http.StatusText(http.StatusUnauthorized)))
		return
	}

	post.UsuarioID = tokenID

	postCreated, err := post.SavePost(server.DB)
	if err != nil {
		formattedError := formaterror.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, formattedError)
		return
	}

	w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.URL.Path, postCreated.ID))
	responses.JSON(w, http.StatusCreated, postCreated)

}

func (server *Server) GetPosts(w http.ResponseWriter, r *http.Request) {
	post := models.Post{}

	posts, err := post.FindAllPosts(server.DB)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	responses.JSON(w, http.StatusOK, posts)
}

func (server *Server) GetPost(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	param_id, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	post := models.Post{}

	postFind, err := post.FindPostByID(server.DB, param_id)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusOK, postFind)
}

func (server *Server) DeletePost(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	param_id, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	tokenID, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Acesso negado"))
		return
	}

	post := models.Post{}

	idUserPostCreated, err := post.GetUserCreate(server.DB, param_id)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	if idUserPostCreated != tokenID {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Acesso negado"))
		return
	}

	_, err = post.DeletePost(server.DB, param_id, tokenID)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}
	w.Header().Set("Entity", fmt.Sprintf("%d", param_id))
	responses.JSON(w, http.StatusNoContent, "")
}
func (server *Server) UpdatePost(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	param_id, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	tokenID, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Acesso negado"))
		return
	}

	post := models.Post{}

	idUserPostCreated, err := post.GetUserCreate(server.DB, param_id)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	if idUserPostCreated != tokenID {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Acesso negado"))
		return
	}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	postUpdate := models.Post{}
	err = json.Unmarshal(body, &postUpdate)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	postUpdate.PrepareData()
	err = postUpdate.ValidateData()
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	postUpdate.ID = uint32(param_id)
	postUpdate.UsuarioID = idUserPostCreated

	postUpdated, err := postUpdate.UpdatePost(server.DB)
	if err != nil {
		formattedError := formaterror.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, formattedError)
		return
	}

	responses.JSON(w, http.StatusOK, postUpdated)
}
