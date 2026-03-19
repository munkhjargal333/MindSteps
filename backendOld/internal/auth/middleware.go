package auth

import (
	"unicode/utf8"

	"github.com/gofiber/fiber/v2/log"
)

// ensureUTF8 - UTF-8 буруу data-г шалгаад засна
func ensureUTF8(data []byte) []byte {
	if !utf8.Valid(data) {
		log.Warnf("Invalid UTF-8 data found")
		return []byte("{}")
	}
	return data
}

// Хэрэв танд logging хийх шаардлага гарвал энд нэмж болно
// Одоогоор token verification бүгдийг token.go файл дээр хийж байгаа
