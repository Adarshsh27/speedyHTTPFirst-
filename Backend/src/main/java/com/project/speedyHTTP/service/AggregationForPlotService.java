package com.project.speedyHTTP.service;

//import com.project.speedyHTTP.model.Hit;
import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import co.elastic.clients.elasticsearch.core.ScrollRequest;
import co.elastic.clients.elasticsearch.core.ScrollResponse;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.json.JsonpUtils;
import com.project.speedyHTTP.model.PlotDataPoint;
import com.project.speedyHTTP.model.PlotRequest;
import com.project.speedyHTTP.model.PlotRequestFinalObject;
import com.project.speedyHTTP.processing.HashUtility;
import com.project.speedyHTTP.repository.AggregationForPlot;
import com.project.speedyHTTP.repository.AggregationForPlotParser;
import com.project.speedyHTTP.repository.URLParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class AggregationForPlotService {
    @Autowired
    private AggregationForPlot aggregationForPlot;
    @Autowired
    private URLParser urlParser;
    @Autowired
    private UrlEntryService urlEntryService;
    @Autowired
    private AggregationForPlotParser aggregationForPlotParser;
    private ElasticsearchClient esClient ;
    @Autowired
    public AggregationForPlotService(ElasticsearchClient esClient) {
        this.esClient = esClient;
    }
    public String getJsonString(String urlHash , Boolean flag , String uid) {
        Query termQuery = QueryBuilders.term(t -> t.field("urlHash.keyword").value(urlHash));
//        Query sizeQuery = QueryBuilders.term(t->t.field("size").value(10000));

        SearchRequest request;
        if(flag){
//            System.out.println("making first call");
            Query userFilterQuery = QueryBuilders.term(t -> t.field("uid.keyword").value(uid));
            Query finalQuery = QueryBuilders.bool(b -> b.must(termQuery, userFilterQuery));
             request = SearchRequest.of(b -> b
                    .index("products")
                    .query(finalQuery)
                    .source(source -> source.filter(f -> f.includes("callMetrics.responseTime" , "timestamp")))
            );
        }else{
//        System.out.println("making second call");
//        Query finalQuery = QueryBuilders.bool(b->b.must(termQuery , sizeQuery));
         request = SearchRequest.of(b -> b
                .index("products")
                .query(termQuery).size(10000)
                .source(source -> source.filter(f -> f.includes("callMetrics.responseTime" , "timestamp")))
        );

        }
//        ScrollRequest scrollRequest = ScrollRequest.of();
//        System.out.println(request.toString());

        SearchResponse<Object> response = null;
        try {
//            ScrollResponse<Object> scrollResponse = esClient.scroll(scrollRequest , Object.class);
//            while(scrollResponse.)
            response = esClient.search(request, Object.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

//        System.out.println("aggregation for plot ");
//        System.out.println(response);
//        System.out.println(response.toString());
        StringBuilder sb = new StringBuilder();
        JsonpUtils.toString(response , sb);
//        System.out.println("string format coming up next");
//        System.out.println(sb.toString());
        return sb.toString();
    }
    public List<PlotDataPoint> getDataPoint(PlotRequest plotRequest){
//        String urlHash = urlParser.getHashId(plotRequest.getUrl() , plotRequest.getMethod());
        String urlHash = HashUtility.sha256(plotRequest.getUrl() + "/" + plotRequest.getMethod());
//        System.out.println("we get : " + urlHash);
        List<PlotDataPoint> ans =  aggregationForPlotParser.getDataPoints(getJsonString(urlHash , plotRequest.getFlag(), plotRequest.getUid()));
//        System.out.println("in service");
//        System.out.println(ans);
//        PlotRequestFinalObject obj = new PlotRequestFinalObject();
//        obj.setData(ans);
//        obj.setBenchmarkTime(urlEntryService.getUrl(urlHash).getBenchMarkTime());
            double bt = urlEntryService.getUrl(urlHash).getBenchMarkTime();
            for(PlotDataPoint i : ans){
                i.setBenchmarkTime(bt);
            }
//        System.out.println("benchmark " + obj.getBenchmarkTime());
//        for(PlotDataPoint i : obj.getData()){
//            System.out.println(i.getId() + " " + i.getTimestamp() + " " + i.getResponseTime());
//        }
        return ans;
    }
}
