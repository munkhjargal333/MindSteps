package auth

// import (
// 	"encoding/json"
// 	"errors"
// 	"fmt"
// 	"mindsteps/database"
// 	"mindsteps/database/model"
// 	"strings"
// 	"time"

// 	"gorm.io/gorm"
// )

// type UserLog struct {
// 	model.UserLogs
// }

// type RouteName struct {
// 	Path  string `json:"path"`
// 	Name  string `json:"name"`
// 	Table string `json:"table"`
// }

// var routes = []RouteName{
// 	{Path: "/bin/type", Name: "Хогийн савны төрөл", Table: model.TableNameGarbageBinTypes},
// 	{Path: "/bin/bin", Name: "Хогийн сав", Table: model.TableNameGarbageBins},
// 	{Path: "/auth/login", Name: "Нэвтрэх", Table: model.TableNameUsers},
// 	{Path: "/auth/change-password", Name: "Нууц үг солих", Table: model.TableNameUsers},
// 	{Path: "/system/user", Name: "Систем хэрэглэгч", Table: model.TableNameUsers},
// 	{Path: "/organization", Name: " Байгууллага", Table: model.TableNameOrganizations},
// 	{Path: "/role", Name: "Эрхийн тохиргоо", Table: model.TableNameRoles},
// 	{Path: "/vehicle/type", Name: "Тээврийн хэрэгслийн төрөл", Table: model.TableNameVehicleTypes},
// 	{Path: "/vehicle", Name: "Тээврийн хэрэгсэл", Table: model.TableNameVehicles},
// 	{Path: "/driver/schedule", Name: "Жолоочтийн цагиин хуваарь", Table: model.TableNameSchedule},
// 	{Path: "/driver/shipment", Name: "Жолоочийн ачилт", Table: model.TableNameShipments},
// 	{Path: "/garbage/landfill", Name: "Хог хаях цэг", Table: model.TableNameGarbageLandFill},

// 	{Path: "/device", Name: "Төхөөрөмж", Table: model.TableNameDevices},
// 	{Path: "/order", Name: "Захиалга", Table: model.TableNameOrders},
// 	{Path: "/route", Name: "Чиглэл", Table: model.TableNameRoutes},
// 	{Path: "/plan", Name: "Төлөвлөгөө", Table: model.TableNamePlans},
// }

// func GetPathName(path string) string {
// 	for _, route := range routes {
// 		if strings.Contains(path, route.Path) {
// 			return route.Name
// 		}
// 	}
// 	return ""
// }

// func GetPath(name string) string {
// 	for _, route := range routes {
// 		if strings.Contains(name, route.Name) {
// 			return route.Path
// 		}
// 	}
// 	return ""
// }

// func GetModules() ([]RouteName, error) {
// 	return routes, nil
// }

// func CreateUserLog(data *model.UserLogs) error {
// 	// Check for a similar log within the last minute
// 	var existingLog model.UserLogs
// 	tenSecondsAgo := time.Now().Add(-10 * time.Second)

// 	err := database.DB.Where("user_id = ? AND path = ? AND operation_type = ? AND created_at >= ?",
// 		data.UserID, data.Path, data.OperationType, tenSecondsAgo).
// 		First(&existingLog).Error

// 	// If a similar log exists, return without saving
// 	if err == nil {
// 		return nil
// 	}

// 	// If the error is not "record not found", return the error
// 	if !errors.Is(err, gorm.ErrRecordNotFound) {
// 		return err
// 	}

// 	// Create a new log if no duplicate found
// 	if err := database.DB.Omit("User, Status").Create(data).Error; err != nil {
// 		return err
// 	}
// 	return nil
// }

// func CalculateChanges(previousData map[string]interface{}, requestBody []byte) (map[string]interface{}, error) {
// 	// Parse request body into a map
// 	var requestData map[string]interface{}
// 	err := json.Unmarshal(requestBody, &requestData)
// 	if err != nil {
// 		return nil, fmt.Errorf("failed to parse request body: %v", err)
// 	}

// 	// Prepare a map to store changes
// 	changes := make(map[string]interface{})

// 	// Compare previousData and requestData
// 	for key, oldValue := range previousData {
// 		if newValue, exists := requestData[key]; exists {
// 			// Normalize data for comparison
// 			normalizedOld := fmt.Sprintf("%v", oldValue)
// 			normalizedNew := fmt.Sprintf("%v", newValue)
// 			// Only add to changes if values are different
// 			if normalizedOld != normalizedNew {
// 				changes[key] = map[string]interface{}{
// 					"old": oldValue,
// 					"new": newValue,
// 				}
// 			}
// 		}
// 	}

// 	// Check for new fields in requestData not present in previousData
// 	for key, newValue := range requestData {
// 		if _, exists := previousData[key]; !exists {
// 			changes[key] = map[string]interface{}{
// 				"old": nil,
// 				"new": newValue,
// 			}
// 		}
// 	}

// 	return changes, nil
// }
