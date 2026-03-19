package shared

import (
	"crypto/rand"
	"fmt"
	"math/big"
)

// generateOTP generates a random 6-digit OTP.
func GenerateOTP4() string {
	// Generate a random number between 100000 and 999999
	randomNum, _ := rand.Int(rand.Reader, big.NewInt(9000))

	// Add 100000 to make sure the OTP is 6 digits long
	otp := randomNum.Add(randomNum, big.NewInt(1000))

	return otp.String()
}

func GenerateOTP6() string {
	// Generate a random number between 0 and 999999
	randomNum, _ := rand.Int(rand.Reader, big.NewInt(1000000))

	// Format the number as a zero-padded 6-digit string
	otp := fmt.Sprintf("%06d", randomNum.Int64())

	return otp
}
