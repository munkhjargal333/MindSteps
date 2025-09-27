package shared

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2/log"
	"github.com/lib/pq"
)

func UintToString(num uint) string {
	return strconv.FormatUint(uint64(num), 10)
}

func IntToString(num int) string {
	return strconv.FormatInt(int64(num), 10)
}

// StringToInt
func StringToInt(num string) int {
	res, err := strconv.Atoi(num)
	if err != nil {
		res = 0
	}
	return res
}

func StringToUint(num string) uint {
	return uint(StringToInt(num))
}

// DateStringToTime
func DateStringToTime(t string) time.Time {
	fmt.Println("DateStringToTime string", t)
	c, err := time.Parse("2006-01-02", t)
	fmt.Println("DateStringToTime", c)
	if err != nil {
		c, _ = time.Parse("2006-01-02", "0000-00-00")
	}
	return c
}

// TimeToDateString
func TimeToDateString(t time.Time) string {
	return t.Format("2006-01-02")
}

// TimeDateTimeString
func TimeToDateTimeString(t time.Time) string {
	return t.Format("2006-01-02 15:04:05")
}

// TimeTimeString
func TimeToTimeString(t time.Time) string {
	return t.Format("15:04:05")
}

// MapToStruct : map to struct
func MapToStruct(m interface{}, v interface{}) (err error) {
	jsonString, err := json.Marshal(m)
	if err != nil {
		return err
	}
	json.Unmarshal(jsonString, v)
	return err
}

func InterfaceToUint(val interface{}) (uint, error) {
	switch v := val.(type) {
	case uint:
		return v, nil
	case string:
		return StringToUint(v), nil
	case float64:
		if v < 0 {
			return 0, fmt.Errorf("cannot convert negative float to uint")
		}
		return uint(v), nil
	case int64:
		if v < 0 {
			return 0, fmt.Errorf("cannot convert negative int64 to uint")
		}
		return uint(v), nil
	default:
		return 0, fmt.Errorf("unsupported type: %T", val)
	}
}

func Int64ArrayToPointerSlice(arr pq.Int64Array) []*int64 {
	var result []*int64
	for _, v := range arr {
		vCopy := v // create a copy to avoid issues with taking the address of a loop variable
		result = append(result, &vCopy)
	}
	return result
}
func StringArrayToPointerSlice(arr pq.StringArray) []*string {
	var result []*string
	for _, v := range arr {
		vCopy := v // create a copy to avoid issues with taking the address of a loop variable
		result = append(result, &vCopy)
	}
	return result
}

func StandardizeDay(day string) ([]int, error) {
	day = strings.TrimSpace(day)

	if numDay, err := strconv.Atoi(day); err == nil {
		return []int{numDay}, nil
	}

	weekdays := GetWeekDayMap()

	if weekday, ok := weekdays[day]; ok {
		return getDaysForWeekdayInMonth(weekday), nil
	}

	return nil, fmt.Errorf("invalid day format: %s", day)
}

func getDaysForWeekdayInMonth(weekday time.Weekday) []int {
	var days []int
	now := time.Now()
	year, month := now.Year(), now.Month()

	t := time.Date(year, month, 1, 0, 0, 0, 0, time.Local)

	for t.Month() == month {
		if t.Weekday() == weekday {
			days = append(days, t.Day())
		}
		t = t.AddDate(0, 0, 1)
	}

	return days
}

func GetWeekDayMap() map[string]time.Weekday {
	return map[string]time.Weekday{
		"MON": time.Monday,
		"TUE": time.Tuesday,
		"WED": time.Wednesday,
		"THU": time.Thursday,
		"FRI": time.Friday,
		"SAT": time.Saturday,
		"SUN": time.Sunday,
	}
}

func GetDayLengthOfMonth(year int, month int) int {
	// Validate month (should be between 1 and 12)
	if month < 1 || month > 12 {
		return 0 // Return 0 for invalid month
	}

	// Get the first day of the given month
	firstOfMonth := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.Local)

	// Get the first day of the next month
	firstOfNextMonth := firstOfMonth.AddDate(0, 1, 0)

	// Subtract one day from the first day of the next month to get the last day of the current month
	lastDayOfMonth := firstOfNextMonth.Add(-time.Hour * 24)

	// Return the day of the last date of the month, which is the number of days in the month
	return lastDayOfMonth.Day()
}

func GetDaySubByStrings(beginDate, endDate string) (int, error) {
	if beginDate == "" || endDate == "" {
		return 1, nil
	}
	startDate, err := ParseDate(beginDate)
	if err != nil {
		return 0, err
	}
	lastDate, err := ParseDate(endDate)
	if err != nil {
		return 0, err
	}

	duration := lastDate.Sub(startDate)
	return int(duration.Hours()/24) + 1, nil
}

func ParseDate(dateStr string) (time.Time, error) {
	layouts := []string{
		"2006-01-02 15:04:05.999999999",
		"2006-01-02 15:04:05",
		"2006-01-02",
	}
	var t time.Time
	var err error
	for _, layout := range layouts {
		t, err = time.Parse(layout, dateStr)
		if err == nil {
			return t, nil
		}
	}
	return t, err
}

func CompareTwoDates(beginDate, endDate time.Time) bool {
	if beginDate.After(endDate) {
		return true
	} else if beginDate.Before(endDate) {
		return false
	} else {
		return false
	}
}

func SafeJSON(value interface{}) string {
	if value == nil {
		return "null"
	}
	jsonData, err := json.Marshal(value)
	if err != nil {
		log.Errorf("Failed to serialize JSON: %v", err)
		return "null"
	}
	return string(jsonData)
}

func GetNextDate(dateStr string) (string, error) {
	// Parse the input date string
	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return "", fmt.Errorf("invalid date format: %v", err)
	}

	// Add one day to the date
	nextDate := date.AddDate(0, 0, 1)

	// Format the new date as a string
	return nextDate.Format("2006-01-02"), nil
}
