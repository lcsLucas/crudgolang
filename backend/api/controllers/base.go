package controllers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql" //mysql database driver
	"github.com/lcslucas/web/api/models"
	"github.com/rs/cors"
)

type Server struct {
	DB     *gorm.DB
	Router *mux.Router
}

func (s *Server) Init(db_driver, db_user, db_password, db_port, db_host, db_name string) {
	fmt.Printf("Inicializando Banco: %s...\n", db_name)

	var err error

	if db_driver == "mysql" {
		DBURL := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", db_user, db_password, db_host, db_port, db_name)
		fmt.Println(DBURL)

		s.DB, err = gorm.Open(db_driver, DBURL)

		if err != nil {
			fmt.Printf("Erro: não foi possível conectar com o banco %s -> %s\n", db_driver, err)
		} else {
			fmt.Printf("banco %s conectado com sucesso\n", db_driver)
		}

		s.DB.Debug().AutoMigrate(&models.User{})                                                                //database migration
		s.DB.Debug().AutoMigrate(&models.Post{}).AddForeignKey("usuario_id", "users(id)", "CASCADE", "CASCADE") //database migration

		s.Router = mux.NewRouter()

		s.initRoutes()

	}

}

func (server *Server) Run(addr string) {
	// Use default options
	handler := cors.Default().Handler(server.Router)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "HEAD", "POST", "PUT", "OPTIONS", "DELETE", "PATCH"},
		AllowedHeaders:   []string{"Access-Control-Allow-Credentials", "Access-Control-Allow-Origin", "Authorization", "Content-Type"},
		AllowCredentials: true,
		Debug:            true,
	})

	handler = c.Handler(handler)

	fmt.Println("Ouvindo na porta :9000")
	// log.Fatal(http.ListenAndServe(addr, handler))
	log.Fatal(http.ListenAndServe(addr, handler))
}
