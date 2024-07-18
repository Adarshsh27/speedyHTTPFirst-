package com.project.speedyHTTP.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class RemoveURLEntry {
    private String message;
    private String userUrl;
    private String uid;
    private List<String> method = new ArrayList<>();
    private List<String> payload = new ArrayList<>();
    private String queryToRemove;

    public String getQueryToRemove() {
        return queryToRemove;
    }

    public void setQueryToRemove(String queryToRemove) {
        this.queryToRemove = queryToRemove;
    }
    public String getMessage() {
        return message;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }
    public void setMessage(String message) {
        this.message = message;
    }

    public String getUserUrl() {
        return userUrl;
    }

    public void setUserUrl(String userUrl) {
        this.userUrl = userUrl;
    }

    public List<String> getMethod() {
        return method;
    }

    public void setMethod(List<String> method) {
        this.method = method;
    }

    public List<String> getPayload() {

        return payload;
    }

    public void setPayload(List<String> payload) {
        this.payload = payload;
    }
}
