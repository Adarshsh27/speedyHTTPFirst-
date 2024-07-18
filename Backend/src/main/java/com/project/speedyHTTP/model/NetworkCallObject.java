package com.project.speedyHTTP.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.HashMap;
import java.util.Map;
//@JsonIgnoreProperties(ignoreUnknown = true)
public class NetworkCallObject {
    private String url;
    private String method;
    private double responseTime;
    private double totalTime;
    private long timestamp;
    private Map <String , String > payloadMap = new HashMap<>();
    private String uid;

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public NetworkCallObject(String url, String method, double responseTime, double totalTime, long timestamp , Map<String,String> payloadMap, String uid) {
        this.url = url;
        this.method = method;
        this.responseTime = responseTime;
        this.totalTime = totalTime;
        this.timestamp = timestamp;
        this.uid = uid;
    }

    public Map<String, String> getPayloadMap() {
        return payloadMap;
    }

    public void setPayloadMap(Map<String, String> payloadMap) {
        this.payloadMap = payloadMap;
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
