package com.project.speedyHTTP.repository;

import com.project.speedyHTTP.model.NetworkCallEntry;
import com.project.speedyHTTP.model.UrlEntry;
import com.project.speedyHTTP.service.UrlEntryService;
import org.springframework.aop.scope.ScopedProxyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.ResponseStatus;

@Repository
public class CheckBenchmarkRepo {
    @Autowired
    private UrlEntryService urlEntryService;

    public boolean checkBenchmark(NetworkCallEntry newEntry){
        UrlEntry urlEntry = urlEntryService.getUrl(newEntry.getUrlHash());
        if(urlEntry == null){

        System.out.println("url entry is null");
        return true;
        }
        if(urlEntry.getTotalCalls() == 0){
            System.out.println("total call is zero");
            return true;
        }
        double responseTime = newEntry.getCallMetrics().getResponseTime();
        double benchmarkTime = urlEntry.getBenchMarkTime();
        if((Math.abs(responseTime - benchmarkTime)/benchmarkTime * 100) <= 20){
//            // might need to update benchmark once so wait
//            double newCalls = urlEntry.getNewEntries();
//            if(((newCalls / urlEntry.getTotalCalls()) * 100) >= 10 ){
//                // lets update the benchmark
//            }else{
//                // lets just save and not update
//            }
            System.out.println("benchmark time : " + benchmarkTime + "response Time : " + responseTime);


            // NO NEED TO UPDATE BENCHMARK , WE ARE DOING THAT IN NETWORK CALL ENTRY SERVICE
            return true;
        }
        else{
            System.out.println("----------BENCHMARKED FAILED -----------");
            System.out.println("benchmark time : " + benchmarkTime + "response Time : " + responseTime);
            // no need to raise alert, we have done that in networkCallEntryService
            return false;
        }
    }
    public double getBenchmarkTime(String urlHash){
        return urlEntryService.getUrl(urlHash).getBenchMarkTime();
    }
}
