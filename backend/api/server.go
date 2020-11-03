package api

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/lcslucas/web/api/controllers"
)

var server = controllers.Server{}

func Run() {
	err := godotenv.Load()

	if err != nil {
		log.Fatalf("Erro: ao ler arquivo .env -> %v", err)
	} else {
		fmt.Println(".env lido com sucesso.")
	}

	//fmt.Println(os.Getenv("DB_DRIVER"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_PORT"), os.Getenv("DB_HOST"), os.Getenv("DB_NAME"))
	server.Init(os.Getenv("DB_DRIVER"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_PORT"), os.Getenv("DB_HOST"), os.Getenv("DB_NAME"))

	server.Run(":9000")

}
