package com.project.speedyHTTP.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.swing.*;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.*;


@Document(collection = "userEntry")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserEntry {
    @Id
    private String uid;
    private String name;
//    string => url => *://domain/path* non hashed
    private List<String> bookmarks = new ArrayList<>();

//    counting the simple url, if it reaches zero we remove the url completely ... key => simpleUrl hashed
//    private Map<String , Integer > simpleUrlCount = new HashMap<>();

//    key = url => *://domain/path*/query/method and that too hashed and this is for validation
    private Map<String, List<String>> payloadFilter = new HashMap<>();

//    map to filter payload on the ui , key -> *://domain/path* and that too hashed
    private Map<String , Map<String , List<String>>> uiPayloadFilter = new HashMap<>();


//        key = url => *://domain/path*/method and that too hashed and we will use this only in backend for validation
//        queryParams are seperated by '/'... so a/b/c ... a/b/c/d .. are different entries
    private Map<String , List<String>> queryParams = new HashMap<>();
    // list of urls provided by user .. in the form of *://domain/path*/query
    private List<String> userProvidedUrl = new ArrayList<>();

    // what we can do is for validation we just see if any of the keys that appear in the parameter has any value in the list
    // now what should be the key? .. *://domain/path*/query/method? .. yea good enough
    private Map<String , Map<String , List<String>>> queriesToTrack = new HashMap<>();

    // this is for payloadvalues if they have any
    // key will be complex url .. => *://domain/path*/queries/method
    private Map<String , Map<String , List<String>>> payloadToTrack = new HashMap<>();

    public Map<String, Map<String, List<String>>> getPayloadToTrack() {
        return payloadToTrack;
    }

    public void setPayloadToTrack(Map<String, Map<String, List<String>>> payloadToTrack) {
        this.payloadToTrack = payloadToTrack;
    }

    public Map<String, Map<String, List<String>>> getQueriesToTrack() {
        return queriesToTrack;
    }

    public void setQueriesToTrack(Map<String, Map<String, List<String>>> queriesToTrack) {
        this.queriesToTrack = queriesToTrack;
    }


    // list of methods to track for ui where key is userProvidedUrl , *://domain/path*/query
    private Map<String , List<String>> methodsToTrackForUser = new HashMap<>();

    // key = url => *://domain/path* and hashed
    private Map<String , List<String>> methodsToTrack = new HashMap<>();

    // payload filter for user ui
    private Map<String , Map<String , List<String>>> payloadFilterForUser = new HashMap<>();

    public Map<String, Map<String, List<String>>> getPayloadFilterForUser() {
        return payloadFilterForUser;
    }

    public void setPayloadFilterForUser(Map<String, Map<String, List<String>>> payloadFilterForUser) {
        this.payloadFilterForUser = payloadFilterForUser;
    }

    public Map<String, List<String>> getMethodsToTrackForUser() {
        return methodsToTrackForUser;
    }

    public void setMethodsToTrackForUser(Map<String, List<String>> methodsToTrackForUser) {
        this.methodsToTrackForUser = methodsToTrackForUser;
    }

    public List<String> getUserProvidedUrl() {
        return userProvidedUrl;
    }

    public void setUserProvidedUrl(List<String> userProvidedUrl) {
        this.userProvidedUrl = userProvidedUrl;
    }

//    public Map<String, Integer> getSimpleUrlCount() {
//        return simpleUrlCount;
//    }

//    public void setSimpleUrlCount(Map<String, Integer> simpleUrlCount) {
//        this.simpleUrlCount = simpleUrlCount;
//    }

    // key => simpleUrl , second key = method String
    public Map<String, Map<String, List<String>>> getUiPayloadFilter() {
        return uiPayloadFilter;
    }

    public void setUiPayloadFilter(Map<String, Map<String, List<String>>> uiPayloadFilter) {
        this.uiPayloadFilter = uiPayloadFilter;
    }

    public Map<String , String> getQueryMap(){
        Map<String , String> queryMap = new HashMap<>();
        return queryMap;
    }

    public Map<String, List<String>> getMethodsToTrack() {
        return methodsToTrack;
    }

    public void setMethodsToTrack(Map<String, List<String>> methodsToTrack) {
        this.methodsToTrack = methodsToTrack;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public Map<String, List<String>> getQueryParams() {
        return queryParams;
    }

    public void setQueryParams(Map<String, List<String>> queryParams) {
        this.queryParams = queryParams;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setBookmarks(List<String> bookmarks) {
        this.bookmarks = bookmarks;
    }

    public Map<String, List<String>> getPayloadFilter() {
        return payloadFilter;
    }

    public void setPayloadFilter(Map<String, List< String>> payloadFilter) {
        this.payloadFilter = payloadFilter;
    }

    public String getUid() {
        return uid;
    }

    public String getName() {
        return name;
    }

    public List<String> getBookmarks() {
        return bookmarks;
    }

}
