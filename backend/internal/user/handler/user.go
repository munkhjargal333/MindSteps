package handler

import (
	"mindsteps/internal/auth"
	"mindsteps/internal/shared"
	"mindsteps/internal/user/form"
	"mindsteps/internal/user/service"

	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	service service.UserService
}

func NewUserHandler(s service.UserService) *UserHandler {
	return &UserHandler{service: s}
}

func (h *UserHandler) GetProfile(c *fiber.Ctx) error {
	tokenInfo := auth.GetTokenInfo(c)
	if tokenInfo == nil {
		return shared.ResponseUnauthorized(c)
	}

	user, err := h.service.GetProfile(tokenInfo.UserID)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"success": true,
		"user": fiber.Map{
			"id":                user.ID,
			"uuid":              user.UUID,
			"name":              user.Name,
			"email":             user.Email,
			"profile_picture":   user.ProfilePicture,
			"timezone":          user.Timezone,
			"language":          user.Language,
			"total_score":       user.TotalScore,
			"current_level":     user.CurrentLevel,
			"level_progress":    user.LevelProgress,
			"is_email_verified": user.IsEmailVerified,
			"email_verified_at": user.EmailVerifiedAt,
			"last_login":        user.LastLogin,
			"login_count":       user.LoginCount,
			"created_at":        user.CreatedAt,
		},
	})
}

func (h *UserHandler) UpdateProfile(c *fiber.Ctx) error {
	tokenInfo := auth.GetTokenInfo(c)
	if tokenInfo == nil {
		return shared.ResponseUnauthorized(c)
	}

	var f form.UpdateProfileForm
	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if err := f.Validate(); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	user, err := h.service.UpdateProfile(tokenInfo.UserID, &f)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Профайл амжилттай шинэчлэгдлээ",
		"user": fiber.Map{
			"id":              user.ID,
			"name":            user.Name,
			"profile_picture": user.ProfilePicture,
			"timezone":        user.Timezone,
			"language":        user.Language,
		},
	})
}

func (h *UserHandler) ChangePassword(c *fiber.Ctx) error {
	tokenInfo := auth.GetTokenInfo(c)
	if tokenInfo == nil {
		return shared.ResponseUnauthorized(c)
	}

	var f form.ChangePasswordForm
	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if err := f.Validate(); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	if err := h.service.ChangePassword(tokenInfo.UserID, &f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Нууц үг амжилттай солигдлоо",
	})
}

func (h *UserHandler) DeleteAccount(c *fiber.Ctx) error {
	tokenInfo := auth.GetTokenInfo(c)
	if tokenInfo == nil {
		return shared.ResponseUnauthorized(c)
	}

	if err := h.service.DeleteAccount(tokenInfo.UserID); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Таны бүртгэл амжилттай устгагдлаа",
	})
}
