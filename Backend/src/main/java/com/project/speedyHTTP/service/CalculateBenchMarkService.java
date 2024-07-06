package com.project.speedyHTTP.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.json.JsonData;

import java.io.IOException;
import java.util.List;

import co.elastic.clients.json.JsonpUtils;
import com.project.speedyHTTP.processing.BenchmarkCreation;
import com.project.speedyHTTP.repository.CalculateBenchMark;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CalculateBenchMarkService {
    @Autowired
    private CalculateBenchMark avgAggregateParser;
    private final ElasticsearchClient esClient ;

    @Autowired
    private BenchmarkCreation benchmarkCreation;
    @Autowired
    public CalculateBenchMarkService(ElasticsearchClient esClient) throws IOException {
        this.esClient = esClient;
    }
    public double getAggregate(String urlHash, String time1 , String time2) throws IOException {
//        String urlHash ="d9ffe8407807bb0cd899d6aeaa8c59b72316ac9386ca05400e164467f688a4de";
        Query termQuery = QueryBuilders.term(t->t.field("urlHash.keyword").value(urlHash));
        Query timeQuery = QueryBuilders.range(r->r.field("timestamp").gte(JsonData.of(time1)).lte(JsonData.of(time2)).format("epoch_millis"));
        Query query = QueryBuilders.bool(b->b.must(termQuery,timeQuery));
//        Aggregation aggregation =  Aggregation.of(a->a.avg(av->av.field("callMetrics.responseTime")));
//        SearchRequest searchRequest = SearchRequest.of(s->s.index("products").size(0).query(query).aggregations("avg_response_time",aggregation));
        SearchRequest searchRequest = SearchRequest.of(s->s.index("products").query(query).source(source -> source.filter(f -> f.includes("callMetrics"))));
        SearchResponse<Object> response = esClient.search(searchRequest, Object.class);
        StringBuilder sb = new StringBuilder();
        JsonpUtils.toString(response, sb);

        System.out.println(sb.toString());
        List<Double> responseTimes = avgAggregateParser.getAggregationValue(sb.toString());
//        double value = avgAggregateParser.getAggregationValue(sb.toString());

        System.out.println("response in string is " );
        System.out.println(sb.toString());

        System.out.println("printing search request");
        System.out.println(searchRequest);
        System.out.println("printing search reponse");
        System.out.println(response);
        System.out.println("printting time ");
        for (Double i : responseTimes) {
            System.out.print(i + " ");
        }
        System.out.println();
        double benchMark = benchmarkCreation.getBenchmark(responseTimes);
        return benchMark;
//        return 0;
//        return value;
    }

}
