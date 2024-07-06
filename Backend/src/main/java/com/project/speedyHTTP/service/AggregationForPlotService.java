package com.project.speedyHTTP.service;

//import com.project.speedyHTTP.model.Hit;
import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.json.JsonpUtils;
import com.project.speedyHTTP.model.PlotDataPoint;
import com.project.speedyHTTP.repository.AggregationForPlot;
import com.project.speedyHTTP.repository.AggregationForPlotParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class AggregationForPlotService {
    @Autowired
    private AggregationForPlot aggregationForPlot;
    @Autowired
    private AggregationForPlotParser aggregationForPlotParser;
    private ElasticsearchClient esClient ;
    @Autowired
    public AggregationForPlotService(ElasticsearchClient esClient) {
        this.esClient = esClient;
    }
    public String getJsonString(String urlHash) {
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
        return sb.toString();


    }
    public List<PlotDataPoint> getDataPoint(String urlHash){
        return aggregationForPlotParser.getDataPoints(getJsonString(urlHash));
    }
}
