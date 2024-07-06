package com.project.speedyHTTP.controller;


import com.project.speedyHTTP.model.*;
import com.project.speedyHTTP.service.AggregationForPlotService;
import com.project.speedyHTTP.service.CalculateBenchMarkService;
import com.project.speedyHTTP.service.NetworkCallEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping
    public Iterable<NetworkCallEntry> findAll() {
        System.out.println("getting everything");
        return networkCallEntryService.findAll();
    }
    @DeleteMapping
    public boolean deleteAll(){
        return networkCallEntryService.deleteAll();
    }
    @PostMapping
    public NetworkCallEntry insert(@RequestBody NetworkCallObject newEntry) throws IOException {
        return networkCallEntryService.addToES(newEntry);
    }

    @PostMapping(path = "/get")
    public double getAggregate(@RequestBody AggregateRequest aggregateRequest) throws IOException {
        double response = calculateBenchMarkService.getAggregate(aggregateRequest.getUrlHash(),aggregateRequest.getTime1(),aggregateRequest.getTime2());
        System.out.println("in controller ");
        System.out.println(response);
        return response;
    }

    @PostMapping(path = "/plot")
    public List<PlotDataPoint> getDataPoints(@RequestBody PlotRequest plotRequest){
        System.out.println("in controller the request string is ");
        System.out.println(plotRequest.getUrlHash());
        return aggregationForPlotService.getDataPoint(plotRequest.getUrlHash());
    }
}
