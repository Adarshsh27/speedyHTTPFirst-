package com.project.speedyHTTP.model;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.Map;


@Document(collection = "urlEntry")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UrlEntry {
    @Id
    private String id;
    private String url;
    private double benchMarkTime;
    private int totalCalls;
    private int newEntries;
    private Map<String, String> queryParams = new HashMap<>();

    public UrlEntry(String id, String url, double benchMarkTime, int totalCalls, int newEntries) {
        this.id = id;
        this.url = url;
        this.benchMarkTime = benchMarkTime;
        this.totalCalls = totalCalls;
        this.newEntries = newEntries;
    }

    public int getNewEntries() {
        return newEntries;
    }


    public void setNewEntries(int newEntries) {
        this.newEntries = newEntries;
    }

    public String getId() {
        return id;
    }


    public String getUrl() {
        return url;
    }

    public double getBenchMarkTime() {
        return benchMarkTime;
    }

    public void setBenchMarkTime(double benchMarkTime) {
        this.benchMarkTime = benchMarkTime;
    }

    public int getTotalCalls() {
        return totalCalls;
    }

    public void setTotalCalls(int totalCalls) {
        this.totalCalls = totalCalls;
    }


}