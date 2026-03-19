package form

import "fmt"

type PlutchikCombinationForm struct {
	CombinedNameEn  string `json:"combined_name_en" validate:"required,max=50"`
	CombinedNameMn  string `json:"combined_name_mn" validate:"required,max=50"`
	CombinationType string `json:"combination_type" validate:"max=20"`
	Description     string `json:"description"`
	Color           string `json:"color" validate:"max=7"`
	Emoji           string `json:"emoji" validate:"max=20"`
}

func (f PlutchikCombinationForm) Validate() error {
	if f.CombinedNameEn == "" {
		return fmt.Errorf("combined_name_en шаардлагатай")
	}

	if f.CombinedNameMn == "" {
		return fmt.Errorf("combined_name_mn шаардлагатай")
	}

	if len(f.CombinedNameEn) > 50 {
		return fmt.Errorf("combined_name_en 50 тэмдэгтээс бага байх ёстой")
	}

	if len(f.CombinedNameMn) > 50 {
		return fmt.Errorf("combined_name_mn 50 тэмдэгтээс бага байх ёстой")
	}

	if f.Color != "" && len(f.Color) > 7 {
		return fmt.Errorf("color 7 тэмдэгтээс бага байх ёстой (hex format)")
	}

	if len(f.Emoji) > 20 {
		return fmt.Errorf("emoji 20 тэмдэгтээс бага байх ёстой")
	}

	return nil
}