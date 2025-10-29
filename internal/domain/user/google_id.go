package user

type GoogleID struct {
	value string
}

func NewGoogleID(id string) (GoogleID, error) {
	if id == "" {
		return GoogleID{}, ErrEmptyGoogleID
	}

	return GoogleID{value: id}, nil
}

func (g GoogleID) String() string {
	return g.value
}
