package handler

import (
	"mindsteps/database/model"
	"mindsteps/internal/auth"
	"mindsteps/internal/goal/service"
	"mindsteps/internal/shared"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

type GoalHandler struct {
	service service.GoalService
}

// Helper function to calculate days until target
func daysUntilTarget(targetDate *time.Time) int {
	if targetDate == nil {
		return -1
	}

	duration := time.Until(*targetDate)
	days := int(duration.Hours() / 24)

	if days < 0 {
		return 0 // Past due
	}
	return days
}

// Helper function to format goal response
func formatGoalResponse(goal *model.Goals) fiber.Map {
	return fiber.Map{
		"id":                  goal.ID,
		"value_id":            goal.ValueID,
		"title":               goal.Title,
		"description":         goal.Description,
		"goal_type":           goal.GoalType,
		"target_date":         goal.TargetDate,
		"status":              goal.Status,
		"progress_percentage": goal.ProgressPercentage,
		"priority":            goal.Priority,
		"is_public":           goal.IsPublic,
		"completed_at":        goal.CompletedAt,
		"created_at":          goal.CreatedAt,
		"updated_at":          goal.UpdatedAt,
		//"days_until_target":   daysUntilTarget(goal.TargetDate),
		//"milestones":          formatMilestones(goal.Milestones),
		// "milestone_summary": fiber.Map{
		// 	"total":     len(goal.Milestones),
		// 	"completed": countCompletedMilestones(goal.Milestones),
		// },
	}
}

func formatMilestones(milestones []model.GoalMilestones) []fiber.Map {
	result := make([]fiber.Map, len(milestones))
	for i, m := range milestones {
		result[i] = fiber.Map{
			"id":           m.ID,
			"title":        m.Title,
			"description":  m.Description,
			"target_date":  m.TargetDate,
			"is_completed": m.IsCompleted,
			"completed_at": m.CompletedAt,
			"sort_order":   m.SortOrder,
			"created_at":   m.CreatedAt,
		}
	}
	return result
}

func countCompletedMilestones(milestones []model.GoalMilestones) int {
	count := 0
	for _, m := range milestones {
		if m.IsCompleted {
			count++
		}
	}
	return count
}

// Additional handler methods for advanced features

func (h *GoalHandler) PauseGoal(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	tokenInfo := auth.GetTokenInfo(c)
	goal, err := h.service.GetByID(uint(id))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if goal.UserID != tokenInfo.UserID {
		return shared.ResponseForbidden(c)
	}

	goal.Status = "paused"
	goal.UpdatedAt = time.Now()

	//TODO
	// if err := h.service.repo.Update(goal); err != nil {
	// 	return shared.ResponseBadRequest(c, err.Error())
	// }

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Зорилго түр зогсоогдлоо",
		"goal":    goal,
	})
}

func (h *GoalHandler) ResumeGoal(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	tokenInfo := auth.GetTokenInfo(c)
	goal, err := h.service.GetByID(uint(id))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if goal.UserID != tokenInfo.UserID {
		return shared.ResponseForbidden(c)
	}

	if goal.Status != "paused" {
		return shared.ResponseBadRequest(c, "Зөвхөн түр зогсоосон зорилгыг үргэлжлүүлж болно")
	}

	goal.Status = "active"
	goal.UpdatedAt = time.Now()

	//TODO
	// if err := h.service.repo.Update(goal); err != nil {
	// 	return shared.ResponseBadRequest(c, err.Error())
	// }

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Зорилго дахин идэвхжүүллээ",
		"goal":    goal,
	})
}

func (h *GoalHandler) GetGoalStatistics(c *fiber.Ctx) error {
	tokenInfo := auth.GetTokenInfo(c)
	if tokenInfo == nil {
		return shared.ResponseUnauthorized(c)
	}

	goals, err := h.service.ListByUserID(tokenInfo.UserID)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	// Calculate statistics
	stats := fiber.Map{
		"total_goals":          len(goals),
		"active_goals":         0,
		"completed_goals":      0,
		"paused_goals":         0,
		"total_milestones":     0,
		"completed_milestones": 0,
		"average_progress":     0.0,
		"goals_by_type": fiber.Map{
			"short_term": 0,
			"long_term":  0,
			"habit":      0,
		},
		"goals_by_priority": fiber.Map{
			"low":    0,
			"medium": 0,
			"high":   0,
		},
	}

	totalProgress := 0
	for _, goal := range goals {
		// Count by status
		switch goal.Status {
		case "active":
			stats["active_goals"] = stats["active_goals"].(int) + 1
		case "completed":
			stats["completed_goals"] = stats["completed_goals"].(int) + 1
		case "paused":
			stats["paused_goals"] = stats["paused_goals"].(int) + 1
		}

		// Count by type
		typeMap := stats["goals_by_type"].(fiber.Map)
		typeMap[goal.GoalType] = typeMap[goal.GoalType].(int) + 1

		// Count by priority
		priorityMap := stats["goals_by_priority"].(fiber.Map)
		priorityMap[goal.Priority] = priorityMap[goal.Priority].(int) + 1

		//TODO
		// Count milestones
		// stats["total_milestones"] = stats["total_milestones"].(int) + len(goal.Milestones)
		// stats["completed_milestones"] = stats["completed_milestones"].(int) + countCompletedMilestones(goal.Milestones)

		// Sum progress
		totalProgress += goal.ProgressPercentage
	}

	// Calculate average progress
	if len(goals) > 0 {
		stats["average_progress"] = float64(totalProgress) / float64(len(goals))
	}

	return c.JSON(fiber.Map{
		"success":    true,
		"statistics": stats,
	})
}
