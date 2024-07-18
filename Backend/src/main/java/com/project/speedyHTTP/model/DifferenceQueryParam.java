package com.project.speedyHTTP.model;

public  class DifferenceQueryParam {
    private String key;
    private String idealValue;
    private String badValue;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getIdealValue() {
        return idealValue;
    }

    public void setIdealValue(String idealValue) {
        this.idealValue = idealValue;
    }

    public String getBadValue() {
        return badValue;
    }

    public void setBadValue(String badValue) {
        this.badValue = badValue;
    }

    public DifferenceQueryParam(String key, String idealValue, String badValue) {
        this.key = key;
        this.idealValue = idealValue;
        this.badValue = badValue;
    }
}
