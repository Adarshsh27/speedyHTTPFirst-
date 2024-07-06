package com.project.speedyHTTP.model;

import lombok.Data;

@Data
public class Metrics {
    private  double responseTime;
    private  double totalTime;

    public void setResponseTime(double responseTime) {
        this.responseTime = responseTime;
    }

    public void setTotalTime(double totalTime) {
        this.totalTime = totalTime;
    }

    public double getResponseTime() {
        return responseTime;
    }

    public double getTotalTime() {
        return totalTime;
    }
}
