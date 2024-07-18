package com.project.speedyHTTP.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.*;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;

import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.json.JsonData;
import co.elastic.clients.json.JsonpUtils;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.project.speedyHTTP.model.Metrics;
import com.project.speedyHTTP.model.NetworkCallEntry;
import com.project.speedyHTTP.processing.BenchmarkCreation;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class GetNetworkCallRepo {
    private  ElasticsearchClient esClient;
    @Autowired
    public GetNetworkCallRepo(ElasticsearchClient esClient) {
        this.esClient = esClient;
    }
    @Autowired
    private BenchmarkCreation benchmarkCreation;

    public NetworkCallEntry nearestNetworkCall(double responseTime , String urlNonQuery) throws IOException {
        // Define the script
        Script script = new Script.Builder()
                .inline(i -> i
                        .source("Math.abs(doc['callMetrics.responseTime'].value - params.value)")
                        .params(Map.of("value", JsonData.of(responseTime)))
                )
                .build();

        Query termQuery = QueryBuilders.term(t -> t.field("urlNonQuery.keyword").value(urlNonQuery));

        // Combine the term query with the script sort
        SearchRequest searchRequest = new SearchRequest.Builder()
                .index("products")
                .query(q -> q
                        .bool(b -> b
                                .must(termQuery)
                                .must(m -> m.matchAll(ma -> ma))
                        )
                )
                .sort(s -> s
                        .script(ss -> ss
                                .type(ScriptSortType.Number)
                                .script(script)
                                .order(SortOrder.Asc)
                        )
                )
                .size(1)
                .build();
        // Execute the search request
//        System.out.println(searchRequest.toString());
        SearchResponse<Object> response = esClient.search(searchRequest, Object.class);
        Gson gson = new GsonBuilder().serializeSpecialFloatingPointValues().create();
//        System.out.println("Printing Response");
        String jsonString = gson.toJson(response);

//        System.out.println(" our string finally ");
//        System.out.println(jsonString);
        ObjectMapper objectMapper = new ObjectMapper();
        Parsing hi = null;
        try {
            hi = gson.fromJson(jsonString, Parsing.class);
//            hi = objectMapper.readValue(jsonString, Parsing.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        NetworkCallEntry ourAnswer = null;
        try{
            ourAnswer = hi.getHits().getHits().get(0).getSource();
        }
        catch(Exception e){
//            System.out.println("nothing to show");
        }
//        System.out.println("network call entry");
//        System.out.println(gson.toJson((ourAnswer)));
//        System.out.println("gson ");
//        System.out.println(gson.toJson(hi));
        return ourAnswer;
    }
    public NetworkCallEntry nearestIdealNetworkCall(double responseTime , String urlNonQuery) throws IOException {
        // Define the script
        Script script = new Script.Builder()
                .inline(i -> i
                        .source("Math.abs(doc['callMetrics.responseTime'].value - params.value)")
                        .params(Map.of("value", JsonData.of(responseTime)))
                )
                .build();

        Query termQuery = QueryBuilders.term(t -> t.field("urlNonQuery.keyword").value(urlNonQuery));

        // Combine the term query with the script sort
        SearchRequest searchRequest = new SearchRequest.Builder()
                .index("products")
                .query(q -> q
                        .bool(b -> b
                                .must(termQuery)
                                .must(m -> m.matchAll(ma -> ma))
                        )
                )
                .sort(s -> s
                        .script(ss -> ss
                                .type(ScriptSortType.Number)
                                .script(script)
                                .order(SortOrder.Asc)
                        )
                )
                .size(1)
                .build();
        // Execute the search request
//        System.out.println(searchRequest.toString());
        SearchResponse<Object> response = esClient.search(searchRequest, Object.class);
        Gson gson = new GsonBuilder().serializeSpecialFloatingPointValues().create();
//        System.out.println("Printing Response");
        String jsonString = gson.toJson(response);

//        System.out.println(" our string finally ");
//        System.out.println(jsonString);
        ObjectMapper objectMapper = new ObjectMapper();
        Parsing hi = null;
        try {
            hi = gson.fromJson(jsonString, Parsing.class);
//            hi = objectMapper.readValue(jsonString, Parsing.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        NetworkCallEntry ourAnswer = null;
        try{
            ourAnswer = hi.getHits().getHits().get(0).getSource();
        }
        catch(Exception e){
//            System.out.println("nothing to show");
        }
//        System.out.println("network call entry");
//        System.out.println(gson.toJson((ourAnswer)));
//        System.out.println("gson ");
//        System.out.println(gson.toJson(hi));
        return ourAnswer;
    }
    public NetworkCallEntry nearestIdealNetworkCallWithExactMatching(double responseTime , String urlHash) throws IOException {
        // Define the script
        Script script = new Script.Builder()
                .inline(i -> i
                        .source("Math.abs(doc['callMetrics.responseTime'].value - params.value)")
                        .params(Map.of("value", JsonData.of(responseTime)))
                )
                .build();

        Query termQuery = QueryBuilders.term(t -> t.field("urlHash.keyword").value(urlHash));

        // Combine the term query with the script sort
        SearchRequest searchRequest = new SearchRequest.Builder()
                .index("products")
                .query(q -> q
                        .bool(b -> b
                                .must(termQuery)
                                .must(m -> m.matchAll(ma -> ma))
                        )
                )
                .sort(s -> s
                        .script(ss -> ss
                                .type(ScriptSortType.Number)
                                .script(script)
                                .order(SortOrder.Asc)
                        )
                )
                .size(1)
                .build();
        // Execute the search request
//        System.out.println(searchRequest.toString());
        SearchResponse<Object> response = esClient.search(searchRequest, Object.class);
        Gson gson = new GsonBuilder().serializeSpecialFloatingPointValues().create();
//        System.out.println("Printing Response");
        String jsonString = gson.toJson(response);

//        System.out.println(" our string finally ");
//        System.out.println(jsonString);
        ObjectMapper objectMapper = new ObjectMapper();
        Parsing hi = null;
        try {
            hi = gson.fromJson(jsonString, Parsing.class);
//            hi = objectMapper.readValue(jsonString, Parsing.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        NetworkCallEntry ourAnswer = null;
        try{
            ourAnswer = hi.getHits().getHits().get(0).getSource();
        }
        catch(Exception e){
//            System.out.println("nothing to show");
        }
//        System.out.println("network call entry");
//        System.out.println(gson.toJson((ourAnswer)));
//        System.out.println("gson ");
//        System.out.println(gson.toJson(hi));
        return ourAnswer;
    }


    public  NetworkCallEntry findLowerNetworkCalls(NetworkCallEntry networkCallEntry) throws IOException {
        // Build the bool query with should clauses
//        {BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder();
//
//        for (String queryString : queries) {
//            Query query = Query.of(q -> q
//                    .match(m -> m
//                            .field("query.query")
//                            .query(queryString)
//                    )
//            );
//            boolQueryBuilder.should(query);
//        }
//
//        // Set minimum_should_match to n - 1
//        boolQueryBuilder.minimumShouldMatch(String.valueOf(queries.size() - 1));
//
//        // Build the search request
//        SearchRequest searchRequest = new SearchRequest.Builder()
//                .index("products")
//                .query(q -> q.bool(boolQueryBuilder.build()))
//                .build();
//        System.out.println(searchRequest.toString());
//        StringBuilder sb = new StringBuilder();
//        // Execute the search request
//        SearchResponse<Object> response =  esClient.search(searchRequest, Object.class);
//        JsonpUtils.toString(response , sb);
//        System.out.println(sb.toString());
//        return response;}

        List<String> queries = new ArrayList<>();
        for (Map.Entry<String, String> entry : networkCallEntry.getQuery().entrySet()) {
            queries.add(entry.getKey());
        }

        Query termQuery = QueryBuilders.term(t -> t.field("urlNonQuery.keyword").value(networkCallEntry.getUrlNonQuery()));
        BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder();
        boolQueryBuilder.must(termQuery);

        for (String queryString : queries) {
            Query query = QueryBuilders.exists(e -> e.field("query." + queryString));
            boolQueryBuilder.should(query);
        }

        // Set minimum_should_match to n - 1
        boolQueryBuilder.minimumShouldMatch(String.valueOf(queries.size() - 1));

        // Build the search request with _source filtering
        SearchRequest searchRequest = new SearchRequest.Builder()
                .index("products")
                .query(q -> q.bool(boolQueryBuilder.build()))
                .source(s -> s.filter(f -> f.includes("callMetrics.responseTime")))
                .build();

//        System.out.println(searchRequest.toString());

        // Execute the search request
        SearchResponse<Object> response = esClient.search(searchRequest, Object.class);

        // Handle the response as needed
//        System.out.println(response.hits().hits().size() + " hits found.");
//        {
//            List<String> queries = new ArrayList<>();
//            for (var entry : networkCallEntry.getQuery().entrySet()) {
//                queries.add(entry.getKey());
//            }
//            Query termQuery = QueryBuilders.term(t -> t.field("urlNonQuery.keyword").value(networkCallEntry.getUrlNonQuery()));
//            BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder();
//            boolQueryBuilder.must(termQuery);
//            for (String queryString : queries) {
//                Query query = Query.of(q -> q
//                        .match(m -> m
//                                .field("query.query")
//                                .query(queryString)
//                        )
//                );
//                boolQueryBuilder.should(query);
//            }
//
//            // Set minimum_should_match to n - 1
//            boolQueryBuilder.minimumShouldMatch(String.valueOf(queries.size() - 1));
//
//            // Build the search request with _source filtering
//            SearchRequest searchRequest = new SearchRequest.Builder()
//                    .index("products")
//                    .query(q -> q.bool(boolQueryBuilder.build()))
//                    .source(s -> s.filter(f -> f.includes("callMetrics.responseTime")))
//                    .build();
//
//            System.out.println(searchRequest.toString());
//
//            // Execute the search request
//            SearchResponse<Object> response = esClient.search(searchRequest, Object.class);
//        }
            StringBuilder sb = new StringBuilder();
        JsonpUtils.toString(response, sb);
//        System.out.println(sb.toString());
        Gson gson = new GsonBuilder().serializeSpecialFloatingPointValues().create();
//        System.out.println("Printing Response");
        String jsonString = gson.toJson(response);

//        System.out.println(" our string finally ");
//        System.out.println(jsonString);
        ObjectMapper ob = new ObjectMapper();
        lowerHits ls = null;
        ls = gson.fromJson(jsonString , lowerHits.class);
        List<Double> responseTimes = new ArrayList<>();
        for(int i = 0 ; i < ls.getHits().getHits().size() ; i++){
            responseTimes.add(ls.getHits().getHits().get(i).getSource().getCallMetrics().getResponseTime());
        }
//        System.out.println("final list of doubles");
        // working perfectly
//        System.out.println(responseTimes);
        double nearestBenchmark = benchmarkCreation.getBenchmark(responseTimes);
        NetworkCallEntry nearestNetworkCallEntry = nearestNetworkCall(nearestBenchmark , networkCallEntry.getUrlNonQuery());
        return nearestNetworkCallEntry;
//        return null;
//        return response;
    }
    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class Parsing{
        public Hits hits;

        public Hits getHits() {
            return hits;
        }

        public void setHits(Hits hits) {
            this.hits = hits;
        }
    }
    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class Hits{
        private List<Document> hits;
        private Double maxScore;

        public List<Document> getHits() {
            return hits;
        }

        public void setHits(List<Document> hits) {
            this.hits = hits;
        }

        public Double getMaxScore() {
            return maxScore;
        }

        public void setMaxScore(Double maxScore) {
            this.maxScore = maxScore;
        }
    }
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Document{
        private NetworkCallEntry source;
        private Double score;

        public NetworkCallEntry getSource() {
            return source;
        }

        public void setSource(NetworkCallEntry source) {
            this.source = source;
        }

        public Double getScore() {
            return score;
        }

        public void setScore(Double score) {
            this.score = score;
        }
    }
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class lowerHits{
        private Hits2 hits;

        public Hits2 getHits() {
            return hits;
        }

        public void setHits(Hits2 hits) {
            this.hits = hits;
        }
    }
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Hits2{
        private List<innerHits> hits;

        public List<innerHits> getHits() {
            return hits;
        }

        public void setHits(List<innerHits> hits) {
            this.hits = hits;
        }
    }
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class innerHits{
        private cMetrics source;

        public cMetrics getSource() {
            return source;
        }

        public void setSource(cMetrics source) {
            this.source = source;
        }
    }
    public static class cMetrics{
        private Metrics callMetrics;

        public Metrics getCallMetrics() {
            return callMetrics;
        }

        public void setCallMetrics(Metrics callMetrics) {
            this.callMetrics = callMetrics;
        }
    }


}
