package com.project.speedyHTTP.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@JsonIgnoreProperties(ignoreUnknown = true)
public class NewURLEntry {
    private String uid;
    private String url;
    private List<String> methods;
    private List<Pair> postPayloadFilters = new ArrayList<>();
    private List<Pair> putPayloadFilters = new ArrayList<>();
    private Map<String , List<Pair>> queryParams = new HashMap<>();


    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public List<String> getMethods() {
        return methods;
    }

    public void setMethods(List<String> methods) {
        this.methods = methods;
    }

    public List<Pair> getPostPayloadFilters() {
        return postPayloadFilters;
    }

    public void setPostPayloadFilters(List<Pair> postPayloadFilters) {
        this.postPayloadFilters = postPayloadFilters;
    }

    public List<Pair> getPutPayloadFilters() {
        return putPayloadFilters;
    }

    public void setPutPayloadFilters(List<Pair> putPayloadFilters) {
        this.putPayloadFilters = putPayloadFilters;
    }

    public Map<String, List<Pair>> getQueryParams() {
        return queryParams;
    }

    public void setQueryParams(Map<String, List<Pair>> queryParams) {
        this.queryParams = queryParams;
    }
}
