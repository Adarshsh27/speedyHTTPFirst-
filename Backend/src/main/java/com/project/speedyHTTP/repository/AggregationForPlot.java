package com.project.speedyHTTP.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.json.JsonpUtils;
//import com.project.speedyHTTP.model.Hit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.IOException;

@Repository
public class AggregationForPlot {
    private  final ElasticsearchClient esClient ;
    @Autowired
    public AggregationForPlot(ElasticsearchClient esClient) {
        this.esClient = esClient;
    }
    public void getDataPoints(String urlHash) {
        Query termQuery = QueryBuilders.term(t -> t.field("urlHash.keyword").value(urlHash));
        SearchRequest request = SearchRequest.of(b -> b
                .index("products")
                .query(termQuery)
                .source(source -> source.filter(f -> f.includes("callMetrics.responseTime" , "timestamp")))
        );
        SearchResponse<Object> response = null;
        try {
            response = esClient.search(request, Object.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        System.out.println("aggregation for plot ");
        System.out.println(response);
        System.out.println(response.toString());
        StringBuilder sb = new StringBuilder();
        JsonpUtils.toString(response , sb);
        System.out.println("string format coming up next");
        System.out.println(sb.toString());

    }
//    public List<ResponseData> extractResponseData(String jsonString) throws IOException {
//        ObjectMapper objectMapper = new ObjectMapper();
//        SearchResponse response = objectMapper.readValue(jsonString, SearchResponse.class);
//
//        List<ResponseData> result = new ArrayList<>();
////        response.hits().hits()
//        for (Hit hit : response.hits().hits()) {
//            long timestamp = hit.getSource().getTimestamp();
//            double responseTime = hit.getSource().getCallMetrics().getResponseTime();
//            result.add(new ResponseData(timestamp, responseTime));
//        }
//
//        return result;
//
//    }


}
