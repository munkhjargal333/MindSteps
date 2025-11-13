package handler

import (
	"fmt"
	"mindsteps/database/model"
	"mindsteps/internal/auth"
	"mindsteps/internal/goal/form"
	"mindsteps/internal/goal/service"
	"mindsteps/internal/shared"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type GoalHandler struct {
	service service.GoalService
}

func NewGoalHandler(s service.GoalService) *GoalHandler {
	return &GoalHandler{service: s}
}

func (h *GoalHandler) Create(c *fiber.Ctx) error {
	var f form.GoalForm

	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	if err := f.Validate(); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	tokenInfo := auth.GetTokenInfo(c)
	if tokenInfo == nil {
		return shared.ResponseUnauthorized(c)
	}

	f.UserID = tokenInfo.UserID

	fmt.Println("test1")
	goal, err := h.service.Create(&f)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "Зорилго амжилттай үүслээ",
		"goal":    goal,
	})
}

func (h *GoalHandler) GetByID(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	goal, err := h.service.GetByID(uint(id))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	tokenInfo := auth.GetTokenInfo(c)
	if goal.UserID != tokenInfo.UserID {
		return shared.ResponseForbidden(c)
	}

	return c.JSON(fiber.Map{
		"success": true,
		"goal":    goal,
	})
}

func (h *GoalHandler) Update(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	var f form.GoalForm
	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if err := f.Validate(); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	tokenInfo := auth.GetTokenInfo(c)
	goal, err := h.service.GetByID(uint(id))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if goal.UserID != tokenInfo.UserID {
		return shared.ResponseForbidden(c)
	}

	goal, err = h.service.Update(uint(id), &f)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Зорилго амжилттай шинэчлэгдлээ",
		"goal":    goal,
	})
}

func (h *GoalHandler) Delete(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	goal, err := h.service.GetByID(uint(id))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	tokenInfo := auth.GetTokenInfo(c)
	if goal.UserID != tokenInfo.UserID {
		return shared.ResponseForbidden(c)
	}

	if err := h.service.Delete(uint(id)); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Зорилго амжилттай устгагдлаа",
	})
}

func (h *GoalHandler) ListByUserID(c *fiber.Ctx) error {
	tokenInfo := auth.GetTokenInfo(c)
	if tokenInfo == nil {
		return shared.ResponseUnauthorized(c)
	}

	goals, err := h.service.ListByUserID(tokenInfo.UserID)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	// Separate by status
	activeGoals := []model.Goals{}
	completedGoals := []model.Goals{}
	pausedGoals := []model.Goals{}

	for _, goal := range goals {
		switch goal.Status {
		case "completed":
			completedGoals = append(completedGoals, goal)
		case "paused":
			pausedGoals = append(pausedGoals, goal)
		default:
			activeGoals = append(activeGoals, goal)
		}
	}

	return c.JSON(fiber.Map{
		"success": true,
		"summary": fiber.Map{
			"total":     len(goals),
			"active":    len(activeGoals),
			"completed": len(completedGoals),
			"paused":    len(pausedGoals),
		},
		"goals": fiber.Map{
			"active":    activeGoals,
			"completed": completedGoals,
			"paused":    pausedGoals,
		},
	})
}

func (h *GoalHandler) CreateMilestone(c *fiber.Ctx) error {
	goalID, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid goal ID")
	}

	var f form.MilestoneForm
	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if err := f.Validate(); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	tokenInfo := auth.GetTokenInfo(c)
	goal, err := h.service.GetByID(uint(goalID))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if goal.UserID != tokenInfo.UserID {
		return shared.ResponseForbidden(c)
	}

	milestone, err := h.service.CreateMilestone(uint(goalID), &f)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success":   true,
		"message":   "Milestone амжилттай үүслээ",
		"milestone": milestone,
	})
}

func (h *GoalHandler) UpdateMilestone(c *fiber.Ctx) error {
	milestoneID, err := strconv.ParseUint(c.Params("milestone_id"), 10, 64)
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid milestone ID")
	}

	var f form.MilestoneForm
	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if err := f.Validate(); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	tokenInfo := auth.GetTokenInfo(c)

	// Get milestone to check ownership through goal
	milestone, err := h.service.GetMilestoneByID(uint(milestoneID))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	goal, err := h.service.GetByID(milestone.GoalID)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if goal.UserID != tokenInfo.UserID {
		return shared.ResponseForbidden(c)
	}

	milestone, err = h.service.UpdateMilestone(uint(milestoneID), &f)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"success":   true,
		"message":   "Milestone амжилттай шинэчлэгдлээ",
		"milestone": milestone,
	})
}

func (h *GoalHandler) CompleteMilestone(c *fiber.Ctx) error {
	milestoneID, err := strconv.ParseUint(c.Params("milestone_id"), 10, 64)
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid milestone ID")
	}

	tokenInfo := auth.GetTokenInfo(c)

	// Get milestone to check ownership through goal
	milestone, err := h.service.GetMilestoneByID(uint(milestoneID))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	goal, err := h.service.GetByID(milestone.GoalID)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if goal.UserID != tokenInfo.UserID {
		return shared.ResponseForbidden(c)
	}

	milestone, err = h.service.CompleteMilestone(uint(milestoneID))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	// Get updated goal with progress
	goal, _ = h.service.GetByID(milestone.GoalID)

	return c.JSON(fiber.Map{
		"success":   true,
		"message":   "Milestone амжилттай биелэгдлээ",
		"milestone": milestone,
		"goal_progress": fiber.Map{
			"percentage":  goal.ProgressPercentage,
			"status":      goal.Status,
			"is_complete": goal.ProgressPercentage == 100,
		},
	})
}

// Additional handler methods for advanced features

//TODO
// func (h *GoalHandler) PauseGoal(c *fiber.Ctx) error {
// 	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
// 	if err != nil {
// 		return shared.ResponseBadRequest(c, "Invalid ID")
// 	}

// 	tokenInfo := auth.GetTokenInfo(c)
// 	goal, err := h.service.GetByID(uint(id))
// 	if err != nil {
// 		return shared.ResponseBadRequest(c, err.Error())
// 	}
// 	if goal.UserID != tokenInfo.UserID {
// 		return shared.ResponseForbidden(c)
// 	}

// 	goal.Status = "paused"
// 	goal.UpdatedAt = time.Now()

// 	if _, err := h.service.Update(id, goal); err != nil {
// 		return shared.ResponseBadRequest(c, err.Error())
// 	}

// 	return c.JSON(fiber.Map{
// 		"success": true,
// 		"message": "Зорилго түр зогсоогдлоо",
// 		"goal":    goal,
// 	})
// }

// func (h *GoalHandler) ResumeGoal(c *fiber.Ctx) error {
// 	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
// 	if err != nil {
// 		return shared.ResponseBadRequest(c, "Invalid ID")
// 	}

// 	tokenInfo := auth.GetTokenInfo(c)
// 	goal, err := h.service.GetByID(uint(id))
// 	if err != nil {
// 		return shared.ResponseBadRequest(c, err.Error())
// 	}
// 	if goal.UserID != tokenInfo.UserID {
// 		return shared.ResponseForbidden(c)
// 	}

// 	if goal.Status != "paused" {
// 		return shared.ResponseBadRequest(c, "Зөвхөн түр зогсоосон зорилгыг үргэлжлүүлж болно")
// 	}

// 	goal.Status = "active"
// 	goal.UpdatedAt = time.Now()

// 	if err := h.service.repo.Update(goal); err != nil {
// 		return shared.ResponseBadRequest(c, err.Error())
// 	}

// 	return c.JSON(fiber.Map{
// 		"success": true,
// 		"message": "Зорилго дахин идэвхжүүллээ",
// 		"goal":    goal,
// 	})
// }

// func (h *GoalHandler) GetGoalStatistics(c *fiber.Ctx) error {
// 	tokenInfo := auth.GetTokenInfo(c)
// 	if tokenInfo == nil {
// 		return shared.ResponseUnauthorized(c)
// 	}

// 	goals, err := h.service.ListByUserID(tokenInfo.UserID)
// 	if err != nil {
// 		return shared.ResponseBadRequest(c, err.Error())
// 	}

// 	// Calculate statistics
// 	stats := fiber.Map{
// 		"total_goals":          len(goals),
// 		"active_goals":         0,
// 		"completed_goals":      0,
// 		"paused_goals":         0,
// 		"total_milestones":     0,
// 		"completed_milestones": 0,
// 		"average_progress":     0.0,
// 		"goals_by_type": fiber.Map{
// 			"short_term": 0,
// 			"long_term":  0,
// 			"habit":      0,
// 		},
// 		"goals_by_priority": fiber.Map{
// 			"low":    0,
// 			"medium": 0,
// 			"high":   0,
// 		},
// 	}

// 	totalProgress := 0
// 	for _, goal := range goals {
// 		// Count by status
// 		switch goal.Status {
// 		case "active":
// 			stats["active_goals"] = stats["active_goals"].(int) + 1
// 		case "completed":
// 			stats["completed_goals"] = stats["completed_goals"].(int) + 1
// 		case "paused":
// 			stats["paused_goals"] = stats["paused_goals"].(int) + 1
// 		}

// 		// Count by type
// 		typeMap := stats["goals_by_type"].(fiber.Map)
// 		typeMap[goal.GoalType] = typeMap[goal.GoalType].(int) + 1

// 		// Count by priority
// 		priorityMap := stats["goals_by_priority"].(fiber.Map)
// 		priorityMap[goal.Priority] = priorityMap[goal.Priority].(int) + 1

// 		// Count milestones//TODO
// 		//stats["total_milestones"] = stats["total_milestones"].(int) + len(goal.Milestones)
// 		//stats["completed_milestones"] = stats["completed_milestones"].(int) + countCompletedMilestones(goal.Milestones)

// 		// Sum progress
// 		totalProgress += goal.ProgressPercentage
// 	}

// 	// Calculate average progress
// 	if len(goals) > 0 {
// 		stats["average_progress"] = float64(totalProgress) / float64(len(goals))
// 	}

// 	return c.JSON(fiber.Map{
// 		"success":    true,
// 		"statistics": stats,
// 	})
// }
