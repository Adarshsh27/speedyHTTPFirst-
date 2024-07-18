package com.project.speedyHTTP.repository;
import com.project.speedyHTTP.model.NetworkCallEntry;
import com.project.speedyHTTP.model.NetworkCallObject;
import com.project.speedyHTTP.service.NetworkCallEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import javax.json.*;
import javax.json.stream.JsonParsingException;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Repository
public class HarAnalyzer {
    @Autowired
    private NetworkCallEntryService networkCallEntryService;
    public JsonObject parseHar(byte[] bytes, String uid) throws JsonParsingException, JsonException {
        // Decode byte array to string
        String json = new String(bytes, StandardCharsets.UTF_8);

        // Parse JSON string to JsonObject
        try (InputStream is = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));
             JsonReader reader = Json.createReader(is)) {
            return reader.readObject();
        } catch (Exception e) {
            // Log the exception and rethrow
//            System.err.println("Failed to parse HAR data: " + e.getMessage());
            try {
                throw e;
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        }
    }

    public void analyzeHar(JsonObject har , String uid ) {
        JsonObject log = har.getJsonObject("log");
        JsonArray entries = log.getJsonArray("entries");

        for (JsonObject entry : entries.getValuesAs(JsonObject.class)) {
            JsonObject request = entry.getJsonObject("request");
            JsonObject response = entry.getJsonObject("response");
            JsonObject timings = entry.getJsonObject("timings");

            String url = request.getString("url");
            String method = request.getString("method");
            int status = response.getInt("status");

            // Get the start time as an epoch value string
            String startedDateTime = entry.getString("startedDateTime");
            Instant instant = Instant.from(DateTimeFormatter.ISO_INSTANT.parse(startedDateTime));
            long startTimeEpoch = instant.getEpochSecond();

            // Get the total time and response time
            double totalTime = entry.getJsonNumber("time").doubleValue();
            double receiveTime = timings.getJsonNumber("receive").doubleValue();

            // Get the request payload if it exists
            Map<String , String> payloadMap = new HashMap<>();
            String payload  ="";
            if (request.containsKey("postData")) {
                JsonObject postData = request.getJsonObject("postData");
                if (postData.containsKey("text")) {
                    payload = postData.getString("text");
                }
            }
            payloadMap = convertPayloadToMap(payload);
            NetworkCallObject newEntry = new NetworkCallObject(url , method , receiveTime , totalTime , startTimeEpoch , payloadMap , uid);
            try {
                networkCallEntryService.addToES(newEntry);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
//            System.out.println("HTTP Method: " + method);
//            System.out.println("Request URL: " + url);
//            System.out.println("Response Status: " + status);
//            System.out.println("Start Time (Epoch): " + startTimeEpoch);
//            System.out.println("Total Time: " + totalTime + " ms");
//            System.out.println("Response Time: " + receiveTime + " ms");
//            System.out.println("Payload: " + payload);
//            System.out.println("--------------------------------------------------");
        }
    }
//    private Map<String, String> convertPayloadToMap(String payload) {
//        System.out.println("payload we are asked to convert");
//        System.out.println(payload);
//        Map<String, String> payloadMap = new HashMap<>();
//        try (JsonReader jsonReader = Json.createReader(new ByteArrayInputStream(payload.getBytes(StandardCharsets.UTF_8)))) {
//            JsonObject jsonObject = jsonReader.readObject();
//            for (Map.Entry<String, JsonValue> entry : jsonObject.entrySet()) {
//                payloadMap.put(entry.getKey(), entry.getValue().toString());
//            }
//        } catch (Exception e) {
//            System.err.println("Failed to convert payload to map: " + e.getMessage());
//        }
//        return payloadMap;
//    }
//    private Map<String, String> convertPayloadToMap(String payload) {
//        System.out.println("payload asking to convert");
//        System.out.println(payload);
//        Map<String, String> payloadMap = new HashMap<>();
//        try (JsonReader jsonReader = Json.createReader(new ByteArrayInputStream(payload.getBytes(StandardCharsets.UTF_8)))) {
//            JsonStructure jsonStructure = jsonReader.read();
//            if (jsonStructure.getValueType() == JsonValue.ValueType.OBJECT) {
//                JsonObject jsonObject = jsonStructure.asJsonObject();
//                for (Map.Entry<String, JsonValue> entry : jsonObject.entrySet()) {
//                    payloadMap.put(entry.getKey(), entry.getValue().toString());
//                }
//            } else if (jsonStructure.getValueType() == JsonValue.ValueType.ARRAY) {
//                JsonArray jsonArray = jsonStructure.asJsonArray();
//                for (int i = 0; i < jsonArray.size(); i++) {
//                    payloadMap.put(String.valueOf(i), jsonArray.get(i).toString());
//                }
//            } else {
//                System.err.println("Payload is neither a JSON object nor a JSON array.");
//            }
//        } catch (Exception e) {
//            System.err.println("Failed to convert payload to map: " + e.getMessage());
//        }
//        return payloadMap;
//    }
    private Map<String, String> convertPayloadToMap(String payload) {
        Map<String, String> payloadMap = new HashMap<>();

        if (payload == null || payload.isEmpty()) {
//            System.err.println("Payload is empty or null.");
            return payloadMap;
        }

        try (JsonReader jsonReader = Json.createReader(new ByteArrayInputStream(payload.getBytes(StandardCharsets.UTF_8)))) {
            JsonStructure jsonStructure = jsonReader.read();
            if (jsonStructure.getValueType() == JsonValue.ValueType.OBJECT) {
                JsonObject jsonObject = jsonStructure.asJsonObject();
                for (Map.Entry<String, JsonValue> entry : jsonObject.entrySet()) {
                    payloadMap.put(entry.getKey(), entry.getValue().toString());
                }
            } else if (jsonStructure.getValueType() == JsonValue.ValueType.ARRAY) {
                JsonArray jsonArray = jsonStructure.asJsonArray();
                for (int i = 0; i < jsonArray.size(); i++) {
                    payloadMap.put(String.valueOf(i), jsonArray.get(i).toString());
                }
            } else {
//                System.err.println("Payload is neither a JSON object nor a JSON array.");
            }
        } catch (JsonParsingException e) {
//            System.err.println("Failed to parse JSON payload: " + e.getMessage());
            // Fallback: treat payload as a plain string
            payloadMap.put("payload", payload);
        } catch (Exception e) {
//            System.err.println("Failed to convert payload to map: " + e.getMessage());
        }
        return payloadMap;
    }


}
