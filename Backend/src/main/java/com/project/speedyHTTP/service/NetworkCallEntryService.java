package com.project.speedyHTTP.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.project.speedyHTTP.model.NetworkCallEntry;
import com.project.speedyHTTP.model.NetworkCallObject;
import com.project.speedyHTTP.model.QueryParameter;
import com.project.speedyHTTP.model.ValidationResult;
import com.project.speedyHTTP.repository.*;
import com.sun.tools.jconsole.JConsoleContext;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class NetworkCallEntryService {
    @Autowired
    private NetworkCallEntryRepo networkCallEntryRepo;
    @Autowired
    private UrlEntryService urlEntryService;
    @Autowired
    private UserEntryService userEntryService;
    public Iterable<NetworkCallEntry> findAll(){
        return networkCallEntryRepo.findAll();
    }
    @Autowired
    private URLParser URLParser;
    @Autowired
    private NetworkCallValidationRepo networkCallValidationRepo;
    @Autowired
    private CheckBenchmarkRepo checkBenchmarkRepo;
    @Autowired
    private GetNetworkCallRepo getNetworkCallRepo;
    @Autowired
    private WebSocketService webSocketService;
    private ElasticsearchClient esClient ;
    @Autowired
    public NetworkCallEntryService(ElasticsearchClient esClient) {
        this.esClient = esClient;
    }
    public NetworkCallEntry insert(NetworkCallEntry product){
        return networkCallEntryRepo.save(product);
    }

    public boolean deleteAll(){
        networkCallEntryRepo.deleteAll();
        return true;
    }
    public boolean deleteEntry(String id){
         networkCallEntryRepo.deleteById(id);
         return true;
    }
    public NetworkCallEntry networkCallEntry(String id){
        Query termQuery = QueryBuilders.term(t -> t.field("id.keyword").value(id));
        SearchRequest request = SearchRequest.of(t->t.query(termQuery));
        System.out.println(request.toString());
        SearchResponse<Object> response = null;
        try {
            response = esClient.search(request, Object.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        System.out.println(response.toString());
        Gson gson = new GsonBuilder().serializeSpecialFloatingPointValues().create();
        System.out.println("Printing Response");
        String jsonString = gson.toJson(response);
        System.out.println(" our string finally ");
        System.out.println(jsonString);
        ObjectMapper objectMapper = new ObjectMapper();
        response hi = null;
        try {
            hi = gson.fromJson(jsonString, response.class);
//            hi = objectMapper.readValue(jsonString, Parsing.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        NetworkCallEntry ans = hi.getHits().getHits().get(0).getSource();
        System.out.println(hi.getHits().getHits());
        System.out.println("ans + ");


//        ans.add(null);
        return ans;
//        System.out.println(hi.toString());
//        return null;

    }
    public NetworkCallEntry addToES(NetworkCallObject newEntry) throws IOException {
        NetworkCallEntry networkCallEntry = createNetworkCallEntry(newEntry);
        System.out.println("created new Network Call Entry");
        ValidationResult validationResult = networkCallValidationRepo.validation(networkCallEntry , userEntryService.getUser(newEntry.getUid()).get());
        if(validationResult.isPassed() && validationResult.isTracked()){
            System.out.println("passed validation");
            if(checkBenchmarkRepo.checkBenchmark(networkCallEntry)){
                System.out.println("benchMark is met");
            }else{
                System.out.println("failed to meet the benchmark");
                // we need to tell user why the benchmark failed.. so check this
                // LOOK INTO THIS
                // so how can a benchmark fail?
                // new query param , or different query values ... get the ideal entry and rest is upon controller

                // ideal entry with same query ..
                NetworkCallEntry idealEntry = getNetworkCallRepo.nearestIdealNetworkCallWithExactMatching(checkBenchmarkRepo.getBenchmarkTime(networkCallEntry.getUrlHash()), networkCallEntry.getUrlHash());
                webSocketService.alertForBenchmark(idealEntry , networkCallEntry);

                // ideal entry if some extra query
//                NetworkCallEntry idealEntry2 = getNetworkCallRepo.findLowerNetworkCalls(networkCallEntry);
//                if(idealEntry != idealEntry2){
//                    webSocketService.alertForBenchmark(idealEntry , networkCallEntry);
//                }


                // CHECK --
                // if we want exactly n - 1 queries.. or current method is good

            }
            // updating the benchmark here
            System.out.println("saving the entry");
            System.out.println(networkCallEntry.getUrl());
            System.out.println(networkCallEntry.getMethod());
            urlEntryService.updateUrlBenchmarkEntry(networkCallEntry);
            return networkCallEntryRepo.save(networkCallEntry);
        }
        else{
            System.out.println("failed validation");
            // validation is failed, so we need to inform user why
            if(!validationResult.isTracked()){
                // if this is the case then url was not tracked by the user in the first place so no need
                // so we do not need to tell user anything
                System.out.println("not tracked by user ");
                System.out.println(validationResult);
            }else{
                // something is missing so we need to inform what
                webSocketService.validationFail(networkCallEntry , validationResult);
            }
            return null;
        }
    }
    public NetworkCallEntry createNetworkCallEntry(NetworkCallObject newEntry){
        return URLParser.createNetworkCallEntry(newEntry);
    }
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class response{
        private Hits hits;

        public Hits getHits() {
            return hits;
        }

        public void setHits(Hits hits) {
            this.hits = hits;
        }
    }
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static  class Hits{
        private List<Bucket> hits;

        public List<Bucket> getHits() {
            return hits;
        }

        public void setHits(List<Bucket> hits) {
            this.hits = hits;
        }
    }
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
    private static class Bucket{
        private NetworkCallEntry source;

    public NetworkCallEntry getSource() {
        return source;
    }

    public void setSource(NetworkCallEntry source) {
        this.source = source;
    }
}
}
