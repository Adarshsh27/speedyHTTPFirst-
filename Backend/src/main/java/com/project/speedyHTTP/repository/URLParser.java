package com.project.speedyHTTP.repository;


import java.net.MalformedURLException;

import com.google.gson.Gson;
import com.project.speedyHTTP.model.Metrics;
import com.project.speedyHTTP.model.NetworkCallEntry;
import com.project.speedyHTTP.model.NetworkCallObject;
import com.project.speedyHTTP.model.QueryParameter;
import com.project.speedyHTTP.processing.HashUtility;
import org.springframework.stereotype.Repository;

import java.net.URL;
import java.net.URISyntaxException;
import java.util.*;

@Repository
public class URLParser {

    public String getHashId(String givenUrl , String method){
        // returns *://domain/path*/query/method
        URL url = null;
//        System.out.println("url : " + givenUrl );
//        System.out.println("method : " + method);
        try {
            url = new URL(givenUrl);
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
        String domain = url.getHost();
        // Extract the path
        String path = url.getPath();
        if(path.isEmpty()){
            path = path +"/";
        }
//        System.out.println("in Get Hash Id in URLParser");
//        System.out.println("domain : " + domain);
//        System.out.println("path : " + path);
        // Extract the query parameters
        String query = url.getQuery();
//        System.out.println("query : " + query);
        Map<String, String> queryParams = null;
        try {
            queryParams = getQueryParams(query);
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
//        System.out.println("Query Parameters: " + queryParams);
        String urlToHash = "*://";
        urlToHash += domain;
        urlToHash += path;
        urlToHash += "*/";
        for (Map.Entry<String, String> entry : queryParams.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            urlToHash += key + "/";
//            System.out.println("Key: " + key + ", Value: " + value);
        }

        urlToHash += method;
//        System.out.println("final complex url : " + urlToHash );
//        System.out.println("url to hash " + urlToHash);
        return HashUtility.sha256(urlToHash);
    }
    public String getSimpleURLHashed(String newUrl){
        String simpleURL = getSimpleURL(newUrl);
        return HashUtility.sha256(simpleURL);
    }
    public String getSimpleUrlFromUserUrl(String urlString) {
        int lastStarIndex = urlString.lastIndexOf('*');
        if (lastStarIndex != -1) {
            return urlString.substring(0, lastStarIndex) + "*";
        } else {
            // Handle case where '*' is not found (optional)
            return urlString;
        }
    }
    public String userUrl(String newUrl){
        URL url = null;
        try {
            url = new URL(newUrl);
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
        String domain = url.getHost();
        String path = url.getPath();
        if(path.isEmpty()){
            path +="/";
        }
        String queryKeys = getQueryKeys(newUrl);
        String ans ="*://" + domain + path +"*"+ queryKeys;
//        System.out.println(ans);
        return ans;
    }
    public String getComplexUrl(String newUrl , String Method){
        URL url = null;
        try {
            url = new URL(newUrl);
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
        String domain = url.getHost();
        String path = url.getPath();
        if(path.isEmpty()){
            path +="/";
        }

        String complexUrl = "*://";
        complexUrl += domain;
        complexUrl += path + "*/";
        // Extract the query parameters
        String query = url.getQuery();
        Map<String, String> queryParams = null;
        try {
            queryParams = getQueryParams(query);
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
//        System.out.println("Query Parameters: " + queryParams);

        for (Map.Entry<String, String> entry : queryParams.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            complexUrl += key + "/";

        }
        complexUrl +=  Method;

        return complexUrl;

    }
    public String getSimpleURL(String newUrl){
        URL url = null;
        try {
            url = new URL(newUrl);
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
        String domain = url.getHost();
        String path = url.getPath();
        if(path.isEmpty()){
            path +="/";
        }
        // Extract the domain
        String simpleUrl = "*://";
//        System.out.println("domain is " + domain);
//        ans.setDomain(domain);
//        System.out.println("Domain: " + domain);
        simpleUrl += domain;

        // Extract the path

//        ans.setPath(path);
//        System.out.println("Path: " + path);
        simpleUrl += path;
        simpleUrl += "*";

//        System.out.println("simple url is : " + simpleUrl);
        return simpleUrl;
    }
    public NetworkCallEntry createNetworkCallEntry(NetworkCallObject newEntry){
        URL url = null;
        try {
            url = new URL(newEntry.getUrl());
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
        String domain = url.getHost();
        String path = url.getPath();
        if(path.isEmpty()){
            path +="/";
        }
        Metrics metrics = new Metrics();
        metrics.setResponseTime(newEntry.getResponseTime());
        metrics.setTotalTime(newEntry.getTotalTime());

        NetworkCallEntry ans = new NetworkCallEntry(newEntry.getUrl(), null , domain , path , newEntry.getMethod() , null , newEntry.getTimestamp() , metrics);

        ans.setUid(newEntry.getUid());

        ans.setPayloadMap(newEntry.getPayloadMap());
//        System.out.println("ans payload map");
//        System.out.println(ans.getPayloadMap());
        // Extract the domain
        String urlNonQuery= "*://";
        urlNonQuery += domain;
        urlNonQuery += path ;
        // Extract the query parameters
        String query = url.getQuery();
        Map<String, String> queryParams = null;
        try {
            queryParams = getQueryParams(query);
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
//        System.out.println("Query Parameters: " + queryParams);
        String urlToHash = "*://";
        urlToHash += domain;
        urlToHash += path + "*/";


        for (Map.Entry<String, String> entry : queryParams.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            ans.pushQuery(new QueryParameter(key, value));
            urlToHash += key +"/";
        }
        urlNonQuery += "*/"+newEntry.getMethod();
        urlToHash += newEntry.getMethod();

        ans.setUrlHash(HashUtility.sha256(urlToHash));
        ans.setUrlNonQuery(HashUtility.sha256(urlNonQuery));
//        System.out.println("new Entry : " + new Gson().toJson(ans , NetworkCallEntry.class));
        return ans;
    }
    public String queryKeysFromUserUrl(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }

        int index = input.lastIndexOf('*');

        if (index == -1) {
            return "";
        }

        return input.substring(index + 1);
    }
    public String getUserUrl(String givenUrl , String method){
        // returns *://domain/path*/query/method
        URL url = null;
//        System.out.println("url : " + givenUrl );
//        System.out.println("method : " + method);
        try {
            url = new URL(givenUrl);
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
        String domain = url.getHost();
        // Extract the path
        String path = url.getPath();
        if(path.isEmpty()){
            path = path +"/";
        }
//        System.out.println("in Get Hash Id in URLParser");
//        System.out.println("domain : " + domain);
//        System.out.println("path : " + path);
        // Extract the query parameters
        String query = url.getQuery();
//        System.out.println("query : " + query);
        Map<String, String> queryParams = null;
        try {
            queryParams = getQueryParams(query);
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
//        System.out.println("Query Parameters: " + queryParams);
        String urlToHash = "*://";
        urlToHash += domain;
        urlToHash += path;
        urlToHash += "*";
        for (Map.Entry<String, String> entry : queryParams.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            urlToHash += key + "/";
//            System.out.println("Key: " + key + ", Value: " + value);
        }
//
//        urlToHash += method;
//        System.out.println("user URL : " + urlToHash );
        return urlToHash;
//        System.out.println("url to hash " + urlToHash);
    }
    // Method to parse query parameters into a Map
    // Of the form /a/b/c/d
    public String getQueryKeys(String newUrl){
        URL url = null;
        try {
            url = new URL(newUrl);
        } catch (
                MalformedURLException e) {
            throw new RuntimeException(e);
        }

        String query = url.getQuery();
        List<String>keys = new ArrayList<>();
        Map<String, String> queryParams = null;
        try {
            queryParams = getQueryParams(query);
        } catch (
                URISyntaxException e) {
            throw new RuntimeException(e);
        }


        String queryKeys = "/";
        for (Map.Entry<String, String> entry : queryParams.entrySet()) {
            String key = entry.getKey();
            keys.add(entry.getKey());
        }
        Collections.sort(keys);
        for(String i : keys){
            queryKeys += i + "/";
        }
        if (queryKeys != null && queryKeys.length() > 0) {
            queryKeys = queryKeys.substring(0, queryKeys.length() - 1);
        }
//        System.out.println("query keys for " + queryKeys);
        return queryKeys;
    }
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
