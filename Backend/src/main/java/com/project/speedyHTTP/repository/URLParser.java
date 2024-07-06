package com.project.speedyHTTP.repository;


import java.net.MalformedURLException;

import com.project.speedyHTTP.model.Metrics;
import com.project.speedyHTTP.model.NetworkCallEntry;
import com.project.speedyHTTP.model.NetworkCallObject;
import com.project.speedyHTTP.model.QueryParameter;
import com.project.speedyHTTP.processing.HashUtility;
import org.springframework.stereotype.Repository;

import java.net.URL;
import java.net.URISyntaxException;
import java.util.Map;
import java.util.TreeMap;

@Repository
public class URLParser {
//    public static void main(String[] args) {
//        String urlString = "https://example.com/path/to/resource?name=JohnDoe&age=25&city=NewYork";
//        LocalDateTime now = LocalDateTime.now();
//        String timestamp = Timestamp.valueOf(now).toString();
//        NetworkCallObject temp = new NetworkCallObject(urlString , "GET" , 1.00 , 2.92 , timestamp);
//        adding(temp);
//    }
    public String getHashId(String givenUrl){
        URL url = null;
        try {
            url = new URL(givenUrl);
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
        String domain = url.getHost();


        // Extract the path
        String path = url.getPath();


        // Extract the query parameters
        String query = url.getQuery();
        Map<String, String> queryParams = null;
        try {
            queryParams = getQueryParams(query);
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
        System.out.println("Query Parameters: " + queryParams);
        String urlToHash = "";
        urlToHash += domain;
        urlToHash += path;

        for (Map.Entry<String, String> entry : queryParams.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            urlToHash += key;
            System.out.println("Key: " + key + ", Value: " + value);
        }

        System.out.println("url to hash " + urlToHash);
        return HashUtility.sha256(urlToHash);
    }
    public NetworkCallEntry adding(NetworkCallObject newEntry){


        URL url = null;
        try {
            url = new URL(newEntry.getUrl());
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
        String domain = url.getHost();
        String path = url.getPath();
        Metrics metrics = new Metrics();
        metrics.setResponseTime(newEntry.getResponseTime());
        metrics.setTotalTime(newEntry.getTotalTime());
        NetworkCallEntry ans = new NetworkCallEntry(newEntry.getUrl(), null , domain , path , newEntry.getMethod() , null , newEntry.getTimestamp() , metrics , newEntry.getPayload());
//        ans.setUrl(newEntry.getUrl());

        // Extract the domain

//        ans.setDomain(domain);
        System.out.println("Domain: " + domain);

        // Extract the path

//        ans.setPath(path);
        System.out.println("Path: " + path);

        // Extract the query parameters
        String query = url.getQuery();
        Map<String, String> queryParams = null;
        try {
            queryParams = getQueryParams(query);
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
        System.out.println("Query Parameters: " + queryParams);
        String urlToHash = "";
        urlToHash += domain;
        urlToHash += path;


        for (Map.Entry<String, String> entry : queryParams.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            ans.pushQuery(new QueryParameter(key, value));
            urlToHash += key;
            System.out.println("Key: " + key + ", Value: " + value);
        }

//        ans.setTimestamp(newEntry.getTimestamp());
        System.out.println("url to hash " + urlToHash);
        ans.setUrlHash(HashUtility.sha256(urlToHash));
//        ans.setCallMetrics(new Metrics(newEntry.getResponseTime() , newEntry.getTotalTime()));
        System.out.println("url " + ans.getUrl());
        System.out.println("domain " + ans.getDomain());
        System.out.println("callmetrics " + ans.getCallMetrics());
        System.out.println("method " + ans.getMethod());
        System.out.println("hash " + ans.getUrlHash());
        System.out.println("id " + ans.getId());
        System.out.println("new Entry ts " + ans.getTimestamp());
        System.out.println("timestamp " + ans.getTimestamp());
        System.out.println("query " + ans.getQuery());
        System.out.println("path " + ans.getPath());
        return ans;
    }
    // Method to parse query parameters into a Map
    public Map<String, String> getQueryParams(String query) throws URISyntaxException {
        Map<String, String> queryParams = new TreeMap<>();
        if (query != null) {
            String[] pairs = query.split("&");
            for (String pair : pairs) {
                int idx = pair.indexOf("=");
                String key = idx > 0 ? pair.substring(0, idx) : pair;
                String value = idx > 0 && pair.length() > idx + 1 ? pair.substring(idx + 1) : null;
                queryParams.put(key, value);
            }
        }
        return queryParams;
    }
}
