package com.project.speedyHTTP.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
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
