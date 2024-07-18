package com.project.speedyHTTP.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties(ignoreUnknown = true)
public class NetworkCallEntry {
    @Id
    // elastic search generated id
    private  String id;
    //    url that user bookmarked url =>  domain/path*/queries
//    complete url
    private  String url;
    // user who's call it was
    private String uid;

    // so we can search on elastic search for finding lower benchmarks  , this is *://domain/path*/method and hashed
    private String urlNonQuery;


    //    sh256 encrypted urlHash , urlHash => *://domain/path*/queries/method .. we are currently using this to get plot points from the elasticSearch
    private  String urlHash;
    private  String domain;
    private  String path;
    private  String method;
    //    all the query params key value pairs
    private  Map<String , String> query = new HashMap<>();

    private  long timestamp;
    private Metrics callMetrics;
    private Map<String , String> payloadMap = new HashMap<>();

    public String getUrlNonQuery() {
        return urlNonQuery;
    }

    public void setUrlNonQuery(String urlNonQuery) {
        this.urlNonQuery = urlNonQuery;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }
    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public NetworkCallEntry(String url, String urlHash, String domain, String path, String method, List<QueryParameter> query, long timestamp, Metrics callMetrics) {
        this.id = UUID.randomUUID().toString();
        this.url = url;
        this.urlHash = urlHash;
        this.domain = domain;
        this.path = path;
        this.method = method;
        if(query != null)
        {
            for(int i = 0 ; i < query.size() ; i++){
                this.query.put(query.get(i).getQuery() , query.get(i).getValue());
            }
        }
        this.timestamp = timestamp;
        this.callMetrics = callMetrics;
    }

    public Map<String, String> getPayloadMap() {
        return payloadMap;
    }

    public void setPayloadMap(Map<String,String> payloadMap) {
        this.payloadMap = payloadMap;
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

    public Map<String , String> getQuery() {
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

    public void setQuery(Map<String , String> query) {
        this.query = query;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public void setCallMetrics(Metrics callMetrics) {
        this.callMetrics = callMetrics;
    }
    public void pushQuery(QueryParameter queryParameter){
        this.query.put(queryParameter.getQuery() , queryParameter.getValue());
    }

}
