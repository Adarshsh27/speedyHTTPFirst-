package com.project.speedyHTTP.model;

public class PlotDataPoint {
    private String timestamp;
    private double responseTime;
    private String id;
    private double benchmarkTime;

    public double getBenchmarkTime() {
        return benchmarkTime;
    }

    public void setBenchmarkTime(double benchmarkTime) {
        this.benchmarkTime = benchmarkTime;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public double getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(double responseTime) {
        this.responseTime = responseTime;
    }

}
