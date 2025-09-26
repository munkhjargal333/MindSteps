package auth

import (
	"errors"
	"fmt"
	"mindsteps/internal/shared"
	"strings"
	"unicode/utf8"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
)

func GetTokenFromHeader(c *fiber.Ctx, key, prefix string) (token string, err error) {
	authHeader := c.Get(key)
	token = strings.TrimPrefix(authHeader, prefix+" ")
	if authHeader == "" || token == authHeader {
		err = errors.New("authentication header not present or malformed")
		return
	}
	return
}

func GetInfoFromToken(token string) (*Token, error) {
	info, err := Gjwt.ReadToken(token)
	if err != nil {
		log.Errorf("parse token error: %v", err)
		return nil, err
	}

	return info, nil
}

func TokenMiddleware(c *fiber.Ctx) error {
	tokenString, err := GetTokenFromHeader(c, "Authorization", "Bearer")
	if err != nil {
		return shared.ResponseUnauthorized(c)
	}
	claims, err := GetInfoFromToken(tokenString)
	if err != nil {
		return shared.ResponseUnauthorized(c)
	}
	fmt.Println(claims)

	c.Locals("tokenInfo", claims)
	return c.Next()
}

func OtpMiddleware(c *fiber.Ctx) error {
	tokenString, err := GetTokenFromHeader(c, "Authorization", "Bearer")
	if err != nil {
		return shared.ResponseUnauthorized(c)
	}
	claims, err := GetInfoFromToken(tokenString)
	if err != nil {
		return shared.ResponseUnauthorized(c)
	}
	fmt.Println(claims)

	c.Locals("tokenInfo", claims)
	return c.Next()
}

const (
	Permission1 int64 = 1 << iota // view
	Permission2 int64 = 1 << iota // create
	Permission3 int64 = 1 << iota // update
	Permission4 int64 = 1 << iota // delete
)

var MethodMap = map[string]int64{
	"GET":    1,
	"POST":   2,
	"PUT":    4,
	"DELETE": 8,
}

func PermissionMiddleware(resourceCode string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		tokenString, err := GetTokenFromHeader(c, "Authorization", "Bearer")
		if err != nil {
			return shared.ResponseUnauthorized(c)
		}

		tokenInfo, err := GetInfoFromToken(tokenString)
		if err != nil {
			return shared.ResponseUnauthorized(c)
		}

		roles := tokenInfo.Roles

		if roles == nil {
			return shared.ResponseForbidden(c)
		}

		allowPermission := false
		for _, r := range roles {
			if string(r) == "*" {
				allowPermission = true
				break
			}
			stringValue := string(r)

			scode := stringValue[:2]
			rcode := stringValue[2:]

			ascii := int64([]rune(rcode)[0])
			allowPermission = (scode == resourceCode) && (ascii&MethodMap[c.Method()] == MethodMap[c.Method()])
			if allowPermission {
				break
			}
		}

		if !allowPermission {
			return shared.ResponseForbidden(c)
		}

		c.Locals("tokenInfo", tokenInfo)
		return c.Next()
	}
}

func ensureUTF8(data []byte) []byte {
	if !utf8.Valid(data) {
		log.Warnf("Invalid UTF-8 data found: %v", data)
		return []byte("{}")
	}
	return data
}

// func LogMiddleware(c *fiber.Ctx) error {
// 	if c.Method() == fiber.MethodGet {
// 		return c.Next()
// 	}

// 	var err error
// 	if err = c.Next(); err != nil {
// 		return err
// 	}

// 	tokenInfo := GetTokenInfo(c)
// 	userID := tokenInfo.UserId

// 	var requestBody []byte
// 	contentType := c.Get("Content-Type")

// 	switch {

// 	case strings.Contains(contentType, "multipart/form-data"):
// 		formData := make(map[string]interface{})

// 		multipartForm, err := c.MultipartForm()
// 		if err == nil {
// 			for key, values := range multipartForm.Value {
// 				if len(values) > 0 {
// 					formData[key] = values[0]
// 				}
// 			}

// 			for key, files := range multipartForm.File {
// 				if len(files) > 0 {
// 					var fileNames []string
// 					for _, file := range files {
// 						fileNames = append(fileNames, file.Filename)
// 					}
// 					formData[key] = fileNames
// 				}
// 			}
// 		} else {

// 			c.Request().PostArgs().VisitAll(func(key, value []byte) {
// 				formData[string(key)] = string(value)
// 			})

// 		}

// 		requestBody, err = json.Marshal(formData)
// 		if err != nil {
// 			log.Errorf("Failed to convert form data to JSON: %v", err)
// 			requestBody = []byte("{}")
// 		}

// 	case strings.Contains(contentType, "application/json"):
// 		requestBody = c.Body()

// 	default:
// 		requestBody = c.Body()
// 	}

// 	responseBody := c.Response().Body()
// 	statusCode := strconv.Itoa(c.Response().StatusCode())
// 	// routeName := GetPathName(c.Path())

// 	var action string
// 	var changes map[string]interface{}
// 	switch c.Method() {
// 	case fiber.MethodPost:
// 		action = "Үүсгэх"

// 	case fiber.MethodPut:

// 		action = "Засах"

// 		previousData, ok := c.Locals("previousData").(map[string]interface{})

// 		if !ok || previousData == nil {
// 			log.Warnf("Previous data is missing or invalid for path: %s", c.Path())
// 		} else {
// 			changes, err = CalculateChanges(previousData, requestBody)
// 			if err != nil {
// 				log.Errorf("Failed to calculate changes: %v", err)
// 			}
// 			if len(changes) == 0 {
// 				return shared.ResponseBadRequest(c, "Өөрчлөлт байхгүй байна")
// 			}
// 		}

// 		c.Locals("previousData", nil)

// 	case fiber.MethodDelete:
// 		action = "Устгах"
// 		previousData, ok := c.Locals("previousData").(map[string]interface{})
// 		if !ok || previousData == nil {
// 			log.Warnf("Previous data is missing or invalid for path: %s", c.Path())
// 			previousData = make(map[string]interface{})
// 		}

// 		requestBody, err = json.Marshal(previousData)
// 		if err != nil {
// 			log.Errorf("Failed to serialize previous data for DELETE request: %v", err)
// 			requestBody = []byte("{}")
// 		}
// 	}

// 	description := action
// 	if routeName != "" {
// 		description = routeName + " " + action
// 	}

// 	if changes == nil {
// 		changes = make(map[string]interface{})
// 	}

// 	changesJSON, err := json.Marshal(changes)
// 	if err != nil {
// 		log.Errorf("Failed to serialize changes to JSON: %v", err)
// 		changesJSON = []byte("{}")
// 	}

// 	reqBody := ensureUTF8(requestBody)

// 	logEntry := model.UserLogs{
// 		Path:          c.Path(),
// 		OperationType: c.Method(),
// 		UserID:        userID,
// 		DataLog:       string(reqBody),
// 		ResponseLog:   string(responseBody),
// 		Changes:       string(changesJSON),
// 		CreatedAt:     time.Now(),
// 		StatusCode:    statusCode,
// 		Description:   description,
// 	}

// 	if err := CreateUserLog(&logEntry); err != nil {
// 		log.Errorf("Failed to create user log: %v", err)
// 		return err
// 	}

// 	return nil
// }

// func FetchPreviousDataMiddleware(c *fiber.Ctx) error {
// 	if c.Method() != fiber.MethodPut && c.Method() != fiber.MethodDelete {
// 		return c.Next()
// 	}
// 	resourceID := c.Params("id")
// 	if resourceID == "" {
// 		return shared.ResponseBadRequest(c, "Resource ID is required")
// 	}

// 	path := c.Path()
// 	tableName := ""
// 	for _, route := range routes {
// 		if strings.Contains(path, route.Path) {
// 			tableName = route.Table
// 			break
// 		}
// 	}

// 	if tableName == "" {
// 		return shared.ResponseBadRequest(c, "Сервер алдаа")
// 	}

// 	// Fetch previous data
// 	var previousData map[string]interface{}
// 	err := database.DB.Table(tableName).
// 		Where("id = ?", resourceID).
// 		Scan(&previousData).Error
// 	if err != nil {
// 		return shared.ResponseBadRequest(c, "Сервер алдаа")
// 	}
// 	fmt.Println("previous data", previousData)

// 	// Attach previous data to context
// 	c.Locals("previousData", previousData)

// 	return c.Next()
// }
