package controllers

import (
	"github.com/lcslucas/web/api/middlewares"
)

func (s *Server) initRoutes() {

	//Home
	s.Router.HandleFunc("/", middlewares.SetMiddlewareJSON(s.Home)).Methods("GET")

	//Login
	s.Router.HandleFunc("/login", middlewares.SetMiddlewareJSON(s.Login)).Methods("POST", "OPTIONS")
	s.Router.HandleFunc("/check-token", middlewares.SetMiddlewareJSON(s.CheckToken)).Methods("POST", "OPTIONS")

	// Users Routes
	s.Router.HandleFunc("/users", middlewares.SetMiddlewareJSON(s.CreateUser)).Methods("POST")  //criar usuário
	s.Router.HandleFunc("/users", middlewares.SetMiddlewareJSON(s.GetUsers)).Methods("GET")     // listar usuários
	s.Router.HandleFunc("/users/{id}", middlewares.SetMiddlewareJSON(s.GetUser)).Methods("GET") // listar um usuário
	s.Router.HandleFunc("/users/{id}", middlewares.SetMiddlewareAuthentication(s.DeleteUser)).Methods("DELETE")
	s.Router.HandleFunc("/users/{id}", middlewares.SetMiddlewareAuthentication(s.UpdateUser)).Methods("PUT")

	// Posts Routes
	s.Router.HandleFunc("/posts", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.CreatePost))).Methods("POST", "OPTIONS") // criar post
	s.Router.HandleFunc("/posts", middlewares.SetMiddlewareJSON(s.GetPosts)).Methods("GET")                                                        // listar posts
	s.Router.HandleFunc("/posts/{id}", middlewares.SetMiddlewareJSON(s.GetPost)).Methods("GET")                                                    // listar um post
	s.Router.HandleFunc("/posts/{id}", middlewares.SetMiddlewareAuthentication(s.DeletePost)).Methods("DELETE")
	s.Router.HandleFunc("/posts/{id}", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.UpdatePost))).Methods("PUT")

}
