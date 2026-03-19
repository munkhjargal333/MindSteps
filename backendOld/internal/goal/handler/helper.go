// internal/goal/handler/goal_handler_helpers.go
package handler

import (
	"mindsteps/database/model"
	"time"

	"github.com/gofiber/fiber/v2"
)

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
		"days_until_target":   daysUntilTarget(&goal.TargetDate),
		//"milestones":          formatMilestones(goal),
		"milestone_summary": fiber.Map{
			// "total":     len(goal.Milestones),
			// "completed": countCompletedMilestones(goal.Milestones),
		},
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
