package com.project.speedyHTTP.model;

public class ResponseData {
    private long timestamp;
    private double responseTime;

    public ResponseData(long timestamp, double responseTime) {
        this.timestamp = timestamp;
        this.responseTime = responseTime;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public double getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(double responseTime) {
        this.responseTime = responseTime;
    }
}
