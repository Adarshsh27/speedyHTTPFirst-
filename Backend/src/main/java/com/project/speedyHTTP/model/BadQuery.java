package com.project.speedyHTTP.model;

import lombok.Data;

import java.util.List;

@Data
public class BadQuery {
    private  String key;
    private List<String> requiredValue;
    private String givenValue;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public List<String> getRequiredValue() {
        return requiredValue;
    }

    public void setRequiredValue(List<String> requiredValue) {
        this.requiredValue = requiredValue;
    }

    public String getGivenValue() {
        return givenValue;
    }

    public void setGivenValue(String givenValue) {
        this.givenValue = givenValue;
    }
}
