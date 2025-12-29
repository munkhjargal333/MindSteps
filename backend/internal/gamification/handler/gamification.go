package handler

import (
	"mindsteps/internal/auth"
	"mindsteps/internal/gamification/service"
	"mindsteps/internal/shared"

	"github.com/gofiber/fiber/v2"
)

type GamificationHandler struct {
	service service.GamificationService // interface (pointer биш!)
}

func NewGamificationHandler(s service.GamificationService) *GamificationHandler {
	return &GamificationHandler{service: s}
}

// Get user gamification stats
func (h *GamificationHandler) GetUserGamification(c *fiber.Ctx) error {
	tokenInfo := auth.GetTokenInfo(c)

	if tokenInfo == nil {
		return shared.ResponseUnauthorized(c)
	}

	userID := tokenInfo.UserID

	stats, err := h.service.GetUserGamification(userID)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	return c.Status(fiber.StatusOK).JSON(stats)
}
