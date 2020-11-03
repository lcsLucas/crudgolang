package models

import (
	"errors"
	"html"
	"strings"
	"time"

	"github.com/badoux/checkmail"
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID        uint32    `gorm:"primary_key;auto_increment" json:"id"`
	Nome      string    `gorm:"size:255;not null" json:"nome"`
	Email     string    `gorm:"size:100; not null; unique" json:"email"`
	Senha     string    `gorm:"size:100;not null" json:"senha"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func Hash(senha string) ([]byte, error) {
	return bcrypt.GenerateFromPassword([]byte(senha), bcrypt.DefaultCost)
}

func VerifyPassword(hashedPassword, senha string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(senha))
}

func (u *User) BeforeSave() error {
	hashedSenha, err := Hash(u.Senha)
	if err != nil {
		return err
	}

	u.Senha = string(hashedSenha)
	return nil
}

func (u *User) PrepareData() {
	u.ID = 0
	u.Nome = html.EscapeString(strings.TrimSpace(u.Nome))
	u.Email = html.EscapeString(strings.TrimSpace(u.Email))
	u.Senha = html.EscapeString(strings.TrimSpace(u.Senha))
	u.CreatedAt = time.Now()
	u.UpdatedAt = time.Now()
}

func (u *User) ValidateData(action string) error {
	switch strings.ToLower(action) {
	case "login":
		if u.Email == "" {
			return errors.New("Parametro 'Email' é requerido")
		}

		if u.Senha == "" {
			return errors.New("Parametro 'Senha' é requerido")
		}

		if err := checkmail.ValidateFormat(u.Email); err != nil {
			return errors.New("Parametro 'Email' inválido")
		}
		return nil
	default:
		if u.Nome == "" {
			return errors.New("Parametro 'Nome' é requerido")
		}

		if u.Email == "" {
			return errors.New("Parametro 'Email' é requerido")
		}

		if u.Senha == "" {
			return errors.New("Parametro 'Senha' é requerido")
		}

		if err := checkmail.ValidateFormat(u.Email); err != nil {
			return errors.New("Parametro 'Email' inválido")
		}

		return nil
	}
}

func (u *User) SaveUser(db *gorm.DB) (*User, error) {

	tx := db.Begin()

	error := tx.Debug().Create(&u).Error

	if error != nil {
		tx.Rollback()
		return &User{}, error
	}

	tx.Commit()
	return u, nil
}

func (u *User) FindAllUsers(db *gorm.DB) (*[]User, error) {
	users := []User{}
	err := db.Debug().Model(&User{}).Limit(100).Find(&users).Error
	if err != nil {
		return &[]User{}, err
	}
	return &users, err
}

func (u *User) FindUserByID(db *gorm.DB, query_id uint32) (*User, error) {
	err := db.Debug().Model(User{}).Where("id = ?", query_id).Take(&u).Error
	if gorm.IsRecordNotFoundError(err) {
		return &User{}, errors.New("Usuário não encontrado")
	}
	if err != nil {
		return &User{}, err
	}
	return u, err
}
