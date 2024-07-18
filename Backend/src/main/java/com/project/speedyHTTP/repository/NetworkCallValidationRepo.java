package com.project.speedyHTTP.repository;

import com.google.gson.Gson;
import com.project.speedyHTTP.model.*;
import com.project.speedyHTTP.processing.HashUtility;
//import com.project.speedyHTTP.random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;


import java.util.*;

@Repository
public class NetworkCallValidationRepo {
    @Autowired
    private URLParser urlParser;


    // list[0] = queries missing
    // list[1] = payload missing
    // list[2] = not bookmarked by user


    public ValidationResult validation(NetworkCallEntry networkCallEntry , UserEntry user){
        String simpleUrl = urlParser.getSimpleURL(networkCallEntry.getUrl());
        String userUrl = urlParser.getUserUrl(networkCallEntry.getUrl() , networkCallEntry.getMethod());
        boolean flag = false;
//        System.out.println("user provided url " + userUrl);
//        System.out.println("bookmarks");
        for(String bookmark : user.getUserProvidedUrl()){
            System.out.println(bookmark);
            if(userUrl.equals(bookmark)){
                flag = true;
            }
        }
//        System.out.println("by initial validation check we get => " + flag );
        // checking if user has bookmarked this url or not
        ValidationResult validationResult1 = new ValidationResult();
        for(String bookmark : user.getBookmarks()){
//            System.out.println("bookmark : " + bookmark);
            if(simpleUrl.equals(bookmark)){
                // checking if the method is correct or not
                for(String method : user.getMethodsToTrack().get(HashUtility.sha256(simpleUrl))){
//                    System.out.println("methods : " + method);
                    flag = true;
                    break;
                }
                if(flag){
                    break;
                }
            }
        }

        if(flag){
        }else{
//            System.out.println("url not tracked by user");
            validationResult1.setTracked(false);
            return validationResult1;
        }
        // key should be *://domain/path*/method and hashed

        // we get a list of strings in the form of /a/b/c/d.. sorted .. now we need to check if this matches by anything
        List<String> queriesToTrack = user.getQueryParams().get(HashUtility.sha256(simpleUrl + "/" + networkCallEntry.getMethod()));
        // the query map
        Map<String,String> queryMap = networkCallEntry.getQuery();
//        System.out.println("map is ");
//        queryMap.forEach((key , value ) -> {
////            System.out.println("key : " + key + " value : " + value );
//        });

//        System.out.println("queryParams");
//        System.out.println(queriesToTrack);
//        System.out.println(networkCallEntry.getQuery());
        String queryKeys = convertMapToString(networkCallEntry.getQuery());
//        System.out.println("query keys : " + queryKeys);
        boolean missingQuery = (missingQuery(queryKeys , queriesToTrack));
//        System.out.println("missing query ");
//        System.out.println(missingQuery);

        if(missingQuery){
            // not tracked by us

            validationResult1.setTracked(false);

            return validationResult1;
        }
        String complexUrl = simpleUrl + queryKeys + "/" + networkCallEntry.getMethod();
//        System.out.println("in validation the complex URL is : " + complexUrl);
        String complexUrlHashed = HashUtility.sha256(complexUrl);
        validationResult1.setTracked(true);
        // now we match
        // 1) if queries params have specified values
        List<BadQuery> badQueries = new ArrayList<>();
        Map<String , List<String>> queryValues = user.getQueriesToTrack().get(complexUrlHashed);
//        System.out.println("the queryValues map");
        System.out.println(new Gson().toJson(queryValues));
//        System.out.println("the network calls queryValues");
        System.out.println(new Gson().toJson(networkCallEntry.getQuery()));
        if(queryValues!=null){
//            System.out.println("inside of query param checking ");
        for(String key : queryValues.keySet()){
//            System.out.println("value of query key is " + key);

            if(networkCallEntry.getQuery().get(key) == null){

             BadQuery badEntry = new BadQuery();
             badEntry.setKey(key);
             badEntry.setGivenValue("null");
             badEntry.setRequiredValue(queryValues.get(key));
             badQueries.add(badEntry);
            }else{
                Boolean foundQuery = false;
                for(String value : queryValues.get(key)){
                    if(value.equals(networkCallEntry.getQuery().get(key)) || value.equals("*")){
                        foundQuery = true;
                        break;
                    }
                }
                if(foundQuery){

                }else{
                    BadQuery badQuery = new BadQuery();
                    badQuery.setKey(key);
                    badQuery.setRequiredValue(queryValues.get(key));
                    badQuery.setGivenValue(networkCallEntry.getQuery().get(key));
                    badQueries.add(badQuery);
                }
            }
        }

        }

        // now we have a list of all queries which did not match what we asked them to
        // 2) if payload have specified values

        List<BadPayload> badPayloads = new ArrayList<>();
        // 3) if payload
        Map<String , List<String>> payloadValues = user.getPayloadToTrack().get(complexUrlHashed);

//        System.out.println("the payload map is");
        System.out.println(new Gson().toJson(payloadValues));
//        System.out.println("the network call payload map is");
        System.out.println(new Gson().toJson(networkCallEntry.getPayloadMap()));
        if(payloadValues!= null){
//            System.out.println("inside of payload Value checking ");
        for(String key : payloadValues.keySet()){
//            System.out.println("key is : " + key);
            if(networkCallEntry.getPayloadMap().get(key) == null){
//                System.out.println("not found");
//                System.out.println(networkCallEntry.getPayloadMap().get(key));
                BadPayload badEntry = new BadPayload();
                badEntry.setKey(key);
                badEntry.setGivenValue("null");
                badEntry.setRequiredValue(payloadValues.get(key));
                badPayloads.add(badEntry);
            }else{
                Boolean foundPayload = false;
                for(String value : payloadValues.get(key)){
                    if(value.equals(networkCallEntry.getPayloadMap().get(key)) || value.equals("*")){
                        foundPayload = true;
                        break;
                    }
                }
                if(foundPayload){
                    break;
                }else{
//                    System.out.println("value not found so we check what we have");
//                    System.out.println(networkCallEntry.getPayloadMap().get(key));
                    BadPayload badPayload = new BadPayload();
                    badPayload.setKey(key);
                    badPayload.setRequiredValue(payloadValues.get(key));
                    badPayload.setGivenValue(networkCallEntry.getPayloadMap().get(key));
                    badPayloads.add(badPayload);
                }
            }
        }
        }
        // now we have all the payloads that have different values

        // get url => should be *://domain / path * / query / method => hence the complexUrl

//        List<String> payloadToTrack = user.getPayloadFilter().get(complexUrlHashed);
//        System.out.println(payloadToTrack);
//        if(payloadToTrack != null){
//        for(String field : payloadToTrack){
//            if(networkCallEntry.getPayloadMap().get(field) == null){
//                validationResult.get(1).add(field);
//            }
//        }
//        }

//        System.out.println(badPayloads);
//        System.out.println(badQueries);
        validationResult1.setBadPayloads(badPayloads);
        validationResult1.setBadQueries(badQueries);
        if(badQueries.isEmpty() && badPayloads.isEmpty()){
//            System.out.println("passed");
            validationResult1.setPassed(true);
        }else{
//            System.out.println("failed" + " " + badQueries.isEmpty() + " " + badPayloads.isEmpty());
            validationResult1.setPassed(false);
        }
//        System.out.println("queries and payload missing");
        return validationResult1;
    }
    public  String convertMapToString(Map<String, String> map) {
        // Get the keys and sort them
        List<String> keys = new ArrayList<>(map.keySet());
        Collections.sort(keys);

        // Build the resulting string
        String result = "";
        for (String key : keys) {
            result += "/" + key;
//            result.append("/").append(map.get(key));
        }
//        System.out.println("query string in the function : " + result);
        return result;
    }
    public  Set<String> splitString(String str) {
        Set<String> result = new HashSet<>();
        String[] items = str.split("/");

        for (String item : items) {
            if (!item.isEmpty()) { // Avoid adding empty strings
                result.add(item);
            }
        }

        result.add("");
        return result;
    }

    public  boolean missingQuery(String input, List<String> list) {
        if(list == null || list.isEmpty()){
            return true;
        }
        Set<String> inputSet = splitString(input);
        inputSet.add("");
        List<Pair<Integer, List<String>>> data = new ArrayList<>();
//        System.out.println("input queries ");
//        System.out.println(inputSet);

        // this flag is to match if all the query params match or not. because it suppose the new network call has more query params... it is not tracked by us .... so we need to ignore it
//        Boolean flag = false;
//        list.add("");
        boolean flag = false;
        for (String i : list) {
            Set<String> toCheck = splitString(i);
            List<String> missing = new ArrayList<>();
//            if(toCheck.size() < inputSet.size()){
//                continue;
//            }
//            Boolean temp = true;
        //          if there is a call with extra query params from whatever we have...
//            System.out.println("to check ");
//            System.out.println(toCheck);
            boolean temp = true;
            for (String j : toCheck) {
                if (!inputSet.contains(j)) {
                    missing.add(j);
                    temp = false;
//                    temp = false;
                }
            }
            for (String j : inputSet) {
                if (!toCheck.contains(j)) {
                   temp = false;
                }
            }

//            System.out.println(temp);
            if(temp == true){
                flag = true;
            }
//            System.out.println("missing");
//            System.out.println(missing);
            data.add(new Pair<>(missing.size(), missing));
        }
//        System.out.println("final flag ");
//        System.out.println(flag);
        return !flag;

    }

    // Helper class to hold pair data
    public  class Pair<K, V> {
        private final K key;
        private final V value;

        public Pair(K key, V value) {
            this.key = key;
            this.value = value;
        }

        public K getKey() {
            return key;
        }

        public V getValue() {
            return value;
        }
    }

}
