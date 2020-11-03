package models

import (
	"errors"
	"html"
	"strings"
	"time"

	"github.com/jinzhu/gorm"
)

type Post struct {
	ID             uint32    `gorm:"primary_key;auto_increment" json:"id"`
	Titulo         string    `gorm:"size:255;not null" json:"titulo"`
	DataPublicacao time.Time `gorm:"not null" json:"data_publicacao"`
	Conteudo       string    `gorm:"type:text; not null" json:"conteudo"`
	Usuario        User      `gorm:"ForeignKey:usuario_id;association_foreignkey:id" json:"usuario"`
	UsuarioID      uint32    `json: "usuario_id"`
	CreatedAt      time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt      time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func (p *Post) PrepareData() {
	p.ID = 0
	p.Titulo = html.EscapeString(strings.TrimSpace(p.Titulo))
	p.Conteudo = html.EscapeString(strings.TrimSpace(p.Conteudo))
	p.Usuario = User{}
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()
}

func (p *Post) ValidateData() error {
	if p.Titulo == "" {
		return errors.New("Parametro Título é obrigatório")
	}
	if p.Conteudo == "" {
		return errors.New("Parametro conteúdo é obrigatório")
	}
	/*if p.UsuarioID < 1 {
		return errors.New("Parametro Autor é obrigatório")
	}*/
	return nil
}

func (p *Post) SavePost(db *gorm.DB) (*Post, error) {
	var err error
	err = db.Debug().Model(&Post{}).Create(&p).Error
	if err != nil {
		return &Post{}, err
	}

	if p.ID > 0 {
		err = db.Debug().Model(&User{}).Select("id, nome, email").Where("id = ?", p.UsuarioID).Take(&p.Usuario).Error
		if err != nil {
			return &Post{}, err
		}
	}

	return p, nil
}

func (p *Post) FindAllPosts(db *gorm.DB) (*[]Post, error) {
	var err error
	posts := []Post{}
	err = db.Debug().Model(&Post{}).Limit(100).Find(&posts).Error
	if err != nil {
		return &[]Post{}, err
	}
	if len(posts) > 0 {
		for i, _ := range posts {
			err := db.Debug().Model(&User{}).Select("id, nome, email").Where("id = ?", posts[i].UsuarioID).Take(&posts[i].Usuario).Error
			if err != nil {
				return &[]Post{}, err
			}
		}
	}

	return &posts, nil
}

func (p *Post) FindPostByID(db *gorm.DB, pid uint64) (*Post, error) {
	var err error
	err = db.Debug().Model(&Post{}).Where("id = ?", pid).Take(&p).Error
	if err != nil {
		return &Post{}, err
	}
	if p.ID > 0 {
		err = db.Debug().Model(&User{}).Select("id, nome, email").Where("id = ?", p.UsuarioID).Take(&p.Usuario).Error
		if err != nil {
			return &Post{}, err
		}
	}

	return p, nil
}

func (p *Post) GetUserCreate(db *gorm.DB, idPost uint64) (uint32, error) {
	var err error

	post := Post{}

	err = db.Debug().Model(&Post{}).Select("usuario_id").Where("id = ?", idPost).Take(&post).Error
	if err != nil {
		return 0, err
	}

	return post.UsuarioID, nil
}

func (p *Post) DeletePost(db *gorm.DB, idPost uint64, idUser uint32) (int64, error) {
	db = db.Debug().Model(&Post{}).Where("id = ? and usuario_id = ?", idPost, idUser).Take(&Post{}).Delete(&Post{})
	if db.Error != nil {
		if gorm.IsRecordNotFoundError(db.Error) {
			return 0, errors.New("Nenhum Post Encontrado")
		}
		return 0, db.Error
	}
	return db.RowsAffected, nil
}

func (p *Post) UpdatePost(db *gorm.DB) (*Post, error) {
	var err error
	err = db.Debug().Model(&Post{}).Where("id = ?", p.ID).Updates(Post{Titulo: p.Titulo, Conteudo: p.Conteudo, DataPublicacao: p.DataPublicacao, UpdatedAt: time.Now()}).Error
	if err != nil {
		return &Post{}, err
	}
	if p.ID > 0 {
		err = db.Debug().Model(&User{}).Select("id, nome, email").Where("id = ?", p.UsuarioID).Take(&p.Usuario).Error
		if err != nil {
			return &Post{}, err
		}
	}
	return p, nil
}
