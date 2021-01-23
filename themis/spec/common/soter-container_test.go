package common

import (
	"encoding/base64"
	"testing"
)

func TestExampleContainer(t *testing.T) {
	containerB64 := "VUVDMgAAAC1s1W74A6Sx9yhDygNh4YEb0LShLZrEgTosYF2yRVG4pHGoaa6N"
	containerBytes, _ := base64.StdEncoding.DecodeString(containerB64)

	container, remaining := ParseSoterContainer(containerBytes)
	if container == nil {
		t.Fatal("not a Soter container")
	}
	if len(remaining) != 0 {
		t.Error("unexpected trailing bytes")
	}

	if container.Tag() != "UEC2" {
		t.Error("invalid tag")
		t.Log("actual:  ", container.Tag())
		t.Log("expected:", "UEC2")
	}

	if len(container.Payload) != 33 {
		t.Error("invalid payload length")
		t.Log("actual:  ", len(container.Payload))
		t.Log("expected:", 33)
	}
}
