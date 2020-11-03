package formaterror

import (
	"errors"
	"strings"
)

func FormatError(err string) error {
	if strings.Contains(err, "nome") {
		return errors.New("Esse nome já consta em nossa base de dados")
	}
	if strings.Contains(err, "email") {
		return errors.New("Esse email já consta em nossa base de dados")
	}
	return errors.New(err)
}
