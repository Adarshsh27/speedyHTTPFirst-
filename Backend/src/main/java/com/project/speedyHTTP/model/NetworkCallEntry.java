package com.project.speedyHTTP.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import java.util.*;

@Document(indexName = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NetworkCallEntry {
    @Id
    private  String id;
    private  String url;
    private  String urlHash;
    private  String domain;
    private  String path;
    private  String method;
    private  List<QueryParameter> query;
    private  long timestamp;
    private Metrics callMetrics;
    private String payload;
    private Map<String , String> payloadMap = new HashMap<>();

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public NetworkCallEntry(String url, String urlHash, String domain, String path, String method, List<QueryParameter> query, long timestamp, Metrics callMetrics , String payload) {
        this.id = UUID.randomUUID().toString();
        this.url = url;
        this.urlHash = urlHash;
        this.domain = domain;
        this.path = path;
        this.method = method;
        this.query = new ArrayList<>();
        if(query != null)
        {
            for(int i = 0 ; i < query.size() ; i++){
                this.query.add(query.get(i));
            }
        }
        this.timestamp = timestamp;
        this.callMetrics = callMetrics;
        this.payload = payload;
        this.payloadMap = new HashMap<>();
    }

    public Map<String, String> getPayloadMap() {
        return payloadMap;
    }

    public void setPayloadMap(Map<String,String> payloadMap) {
        this.payloadMap = payloadMap;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    public String getUrl() {
        return url;
    }

    public String getUrlHash() {
        return urlHash;
    }

    public String getDomain() {
        return domain;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public List<QueryParameter> getQuery() {
        return query;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public Metrics getCallMetrics() {
        return callMetrics;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setUrlHash(String urlHash) {
        this.urlHash = urlHash;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public void setQuery(List<QueryParameter> query) {
        this.query = query;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public void setCallMetrics(Metrics callMetrics) {
        this.callMetrics = callMetrics;
    }
    public void pushQuery(QueryParameter queryParameter){
        this.query.add(queryParameter);
    }

}
