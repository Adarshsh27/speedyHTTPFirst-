package com.project.speedyHTTP;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.speedyHTTP.model.NetworkCallEntry;
import com.project.speedyHTTP.repository.URLParser;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class  TestingClass {
//    @Autowired
//    private static URLParser urlParser;
//    private static String preprocessSource(String source) {
//        // Replace `=` with `:`
//        String jsonLikeString = source.replace("=", ":");
//
//        // Add quotes around keys and values, except for JSON objects/arrays and numbers
//        Pattern keyPattern = Pattern.compile("([a-zA-Z0-9_]+):");
//        Matcher keyMatcher = keyPattern.matcher(jsonLikeString);
//        StringBuffer sbKeys = new StringBuffer();
//        while (keyMatcher.find()) {
//            keyMatcher.appendReplacement(sbKeys, "\"" + keyMatcher.group(1) + "\":");
//        }
//        keyMatcher.appendTail(sbKeys);
//
//        String jsonString = sbKeys.toString();
//
//        // Add quotes around values if they are not numbers or JSON objects/arrays
//        Pattern valuePattern = Pattern.compile(":\\s*([^\\s\"{}\\[\\],]+)\\s*([,}])");
//        Matcher valueMatcher = valuePattern.matcher(jsonString);
//        StringBuffer sbValues = new StringBuffer();
//        while (valueMatcher.find()) {
//            valueMatcher.appendReplacement(sbValues, ":\"" + valueMatcher.group(1) + "\"" + valueMatcher.group(2));
//        }
//        valueMatcher.appendTail(sbValues);
//
//        // Remove _class field
//        jsonString = sbValues.toString().replaceAll("\"_class\":\"[^\"]*\",?", "");
//        System.out.println(jsonString);
//        return jsonString;
//    }
    private static  void test(String newUrl){
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
        System.out.println("query keys for " + queryKeys);
//        return queryKeys;
    }


//    public static List<NetworkCallEntry> parseResponse(String jsonResponse) throws JsonProcessingException {
//        ObjectMapper mapper = new ObjectMapper();
//        JsonNode rootNode = mapper.readTree(jsonResponse);
//        JsonNode hitsNode = rootNode.path("hits").path("hits");
//
//        List<NetworkCallEntry> networkCallEntries = new ArrayList<>();
//        for (JsonNode hit : hitsNode) {
//            String source = hit.path("_source").asText();
//            String processedSource = preprocessSource(source);
//            NetworkCallEntry entry = mapper.readValue(processedSource, NetworkCallEntry.class);
//            networkCallEntries.add(entry);
//        }
//
//        return networkCallEntries;
//    }

    public static void main(String[] args) {
//        String jsonResponse = "{ \"took\": 3, \"timed_out\": false, \"_shards\": { \"failed\": 0, \"successful\": 1, \"total\": 1, \"skipped\": 0 }, \"hits\": { \"total\": { \"relation\": \"eq\", \"value\": 7 }, \"hits\": [ { \"_index\": \"products\", \"_id\": \"5ccf91e5-04ca-454a-8023-4d1cee58194b\", \"_score\": null, \"_source\": \"{_class=com.project.speedyHTTP.model.NetworkCallEntry, id=5ccf91e5-04ca-454a-8023-4d1cee58194b, url=https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener, urlHash=ae3c43d22766d1dce6df7fd114ff319bcd5ce3a2b8a1b0b74afa33697542c994, domain=developer.mozilla.org, path=/en-US/docs/Web/API/EventTarget/addEventListener, method=GET, query={}, timestamp=1720442355425, callMetrics={responseTime=8.799999952316284, totalTime=8.799999952316284}, payloadMap={}}\", \"sort\": [ 0.2199998092651363 ] } ], \"max_score\": null } }";
//        preprocessSource(jsonResponse);
        test("https://www.amazon.in/s?k=realme+air+5+pro+case+cover");
//        try {
//            List<NetworkCallEntry> entries = parseResponse(jsonResponse);
//            entries.forEach(System.out::println);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
    }
    public static Map<String, String> getQueryParams(String query) throws URISyntaxException {
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
