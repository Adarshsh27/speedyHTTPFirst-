package com.project.speedyHTTP.model;

import java.util.List;

public class BadPayload {
    private String key;
    private String givenValue;
    private List<String> requiredValue;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getGivenValue() {
        return givenValue;
    }

    public void setGivenValue(String givenValue) {
        this.givenValue = givenValue;
    }

    public List<String> getRequiredValue() {
        return requiredValue;
    }

    public void setRequiredValue(List<String> requiredValue) {
        this.requiredValue = requiredValue;
    }
}
