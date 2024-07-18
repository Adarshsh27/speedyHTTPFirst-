package com.project.speedyHTTP.controller;


import co.elastic.clients.json.JsonpUtils;
import com.google.gson.Gson;
import com.project.speedyHTTP.model.*;
import com.project.speedyHTTP.processing.HashUtility;
import com.project.speedyHTTP.repository.URLParser;
import com.project.speedyHTTP.service.AggregationForPlotService;
import com.project.speedyHTTP.service.CalculateBenchMarkService;
import com.project.speedyHTTP.service.NetworkCallEntryService;
import com.project.speedyHTTP.service.UrlEntryService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.json.Json;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/networkCalls")
public class NetworkCallEntryController {

    @Autowired
    private NetworkCallEntryService networkCallEntryService;
    @Autowired
    private CalculateBenchMarkService calculateBenchMarkService;
    @Autowired
    private AggregationForPlotService aggregationForPlotService;

    @Autowired
    private UrlEntryService urlEntryService;
    @Autowired
    private URLParser urlParser;
    @GetMapping
    public Iterable<NetworkCallEntry> findAll() {
        System.out.println("getting everything");
        return networkCallEntryService.findAll();
    }

//    @PostMapping
//    public NetworkCallEntry insert(@RequestBody String newEntry) throws IOException {
//        System.out.println("here in controller");
//        System.out.println(newEntry);
////        System.out.println(newEntry.toString());
////        System.out.println("getting payload for new");
////        System.out.println(newEntry.getPayloadMap());
////        return networkCallEntryService.addToES(newEntry);
//        return null;
//
//    }
    @PostMapping
    public NetworkCallEntry insert(@RequestBody String newEntry) throws IOException {
        System.out.println("here in controller");
        System.out.println(newEntry);
//        StringBuilder sb = new StringBuilder();
//        JsonpUtils.toString(newEntry , sb);
//        String json = new Gson().toJson(newEntry , newEntry.getClass());
        System.out.println("json string is");
//        System.out.println(json);
        NetworkCallObject ans = new Gson().fromJson(newEntry , NetworkCallObject.class);
//        String ans = new Gson().toString(new Entry);
        System.out.println("JSON STRING");
        System.out.println(new Gson().toJson(ans , ans.getClass()));
        System.out.println("getting payload for new");
//        System.out.println(newEntry.getPayloadMap());


//        System.out.println("json again");
//        System.out.println(json);
        return networkCallEntryService.addToES(ans);
    }

    @PostMapping(path = "/get")
    public GetAggregateResponse getAggregate(@RequestBody AggregateRequest aggregateRequest) throws IOException {
        String urlHash = HashUtility.sha256((aggregateRequest.getUrl() + "/" + aggregateRequest.getMethod()));
        if(urlEntryService.getUrl(urlHash)==null){
            return new GetAggregateResponse(0 , new NetworkCallEntry());
        }
        double response = calculateBenchMarkService.getAggregate(urlHash, aggregateRequest.getMethod(), aggregateRequest.getTime1(),aggregateRequest.getTime2() , aggregateRequest.getFlag(), aggregateRequest.getUid() , true);
        NetworkCallEntry nearestEntry = new NetworkCallEntry();
        if(response != 0){
            nearestEntry = calculateBenchMarkService.nearestEntryWithExactMatch(response ,urlHash);
        }else{

        }
        GetAggregateResponse ans = new GetAggregateResponse();
        ans.setNearestEntry(nearestEntry);
        ans.setResponseTime(response);
        System.out.println("in controller ");
        System.out.println(response);
        return ans;
    }
    @GetMapping(path = "/{id}")
    public NetworkCallEntry getnetworkCallEntry(@PathVariable("id") String id){
        return networkCallEntryService.networkCallEntry(id);
    }

    @DeleteMapping
    public boolean deleteAll(){
        return networkCallEntryService.deleteAll();
    }
    @DeleteMapping(path = "/{id}")
    public boolean deleteEntry(@PathVariable("id") String id){
        return networkCallEntryService.deleteEntry(id);
    }

    @PostMapping(path = "/plot")
    public List<PlotDataPoint> getDataPoints(@RequestBody PlotRequest plotRequest){
        System.out.println("in controller the request string is ");
        System.out.println(plotRequest.getUrl());
        return aggregationForPlotService.getDataPoint(plotRequest);
    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NetworkCallPost{
        private  NetworkCallObject networkCallObject;
        private String uid;

        public NetworkCallObject getNetworkCallObject() {
            return networkCallObject;
        }

        public void setNetworkCallObject(NetworkCallObject networkCallObject) {
            this.networkCallObject = networkCallObject;
        }

        public String getUid() {
            return uid;
        }

        public void setUid(String uid) {
            this.uid = uid;
        }
    }

}
