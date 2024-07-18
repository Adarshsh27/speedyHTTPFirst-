package com.project.speedyHTTP.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetAggregateResponse {
    private double responseTime;
    private NetworkCallEntry nearestEntry;

    public double getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(double responseTime) {
        this.responseTime = responseTime;
    }

    public NetworkCallEntry getNearestEntry() {
        return nearestEntry;
    }

    public void setNearestEntry(NetworkCallEntry nearestEntry) {
        this.nearestEntry = nearestEntry;
    }
}
