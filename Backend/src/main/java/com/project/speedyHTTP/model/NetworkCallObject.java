package com.project.speedyHTTP.model;

public class NetworkCallObject {
    private String url;
    private String method;
    private double responseTime;
    private double totalTime;
    private long timestamp;
    private  String payload;

    public NetworkCallObject(String url, String method, double responseTime, double totalTime, long timestamp , String payload) {
        this.url = url;
        this.method = method;
        this.responseTime = responseTime;
        this.totalTime = totalTime;
        this.timestamp = timestamp;
        this.payload = payload;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public double getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(double responseTime) {
        this.responseTime = responseTime;
    }

    public double getTotalTime() {
        return totalTime;
    }

    public void setTotalTime(double totalTime) {
        this.totalTime = totalTime;
    }
}
