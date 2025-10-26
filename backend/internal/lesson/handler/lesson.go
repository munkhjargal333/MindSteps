package handler

import (
	"mindsteps/internal/lesson/form"
	"mindsteps/internal/lesson/service"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type LessonHandler struct {
	service service.LessonService // ✅ Interface ашиглаж байна
}

func NewLessonHandler(service service.LessonService) *LessonHandler {
	return &LessonHandler{service: service}
}

func (h *LessonHandler) Create(c *fiber.Ctx) error {
	var f form.LessonForm
	if err := c.BodyParser(&f); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	lesson, err := h.service.CreateLesson(f)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(lesson)
}

func (h *LessonHandler) GetAll(c *fiber.Ctx) error {
	lessons, err := h.service.GetAllLessons()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(lessons)
}

func (h *LessonHandler) GetByID(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	lesson, err := h.service.GetLessonByID(uint(id))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Lesson not found"})
	}
	return c.JSON(lesson)
}

func (h *LessonHandler) Update(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	var f form.LessonForm
	if err := c.BodyParser(&f); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	lesson, err := h.service.UpdateLesson(uint(id), f)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(lesson)
}

func (h *LessonHandler) Delete(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	if err := h.service.DeleteLesson(uint(id)); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
