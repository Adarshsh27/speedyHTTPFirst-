package com.project.speedyHTTP.service;
import com.project.speedyHTTP.model.NetworkCallEntry;
import com.project.speedyHTTP.model.UrlEntry;
import com.project.speedyHTTP.repository.UrlEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.List;
import java.util.Map;

@Service
public class UrlEntryService {
    @Autowired
    private UrlEntryRepository urlEntryRepository;
    @Autowired
    private com.project.speedyHTTP.repository.URLParser URLParser;
    @Autowired
    private CalculateBenchMarkService calculateBenchMarkService;


    public UrlEntry addUrlEntry(UrlEntry url){
        return urlEntryRepository.save(url);
    }
    public List<UrlEntry> findAllEntries(){
        return urlEntryRepository.findAll();
    }
    public UrlEntry getUrl(String id){
        return urlEntryRepository.findById(id).orElse(null);
    }

    public UrlEntry updateUrlEntry(NetworkCallEntry newEntry) throws IOException {
        String id = newEntry.getUrlHash();
        UrlEntry current = getUrl(id);

        try {
            Map<String, String > queryParams = URLParser.getQueryParams((new URL(newEntry.getUrl())).getQuery());
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }

        if(current == null){
            String hashId = URLParser.getHashId(newEntry.getUrl());
            current = new UrlEntry(hashId , newEntry.getUrl() , newEntry.getCallMetrics().getTotalTime() , 1 , 0);
            // check for benchmark of other entries with fewer query params

        }else{
            if(current.getNewEntries() >= ((current.getTotalCalls())/10)){
                current.setBenchMarkTime(calculateBenchMarkService.getAggregate(current.getId(), Long.toString(0) , Long.toString(newEntry.getTimestamp())));
            }
        }
        double responseTime = newEntry.getCallMetrics().getResponseTime();
        double getBenchMark = current.getBenchMarkTime();
        if(((Math.abs(responseTime - getBenchMark) / (getBenchMark))*100) >= 50){

        }
        return urlEntryRepository.save(current);
    }
    public boolean deleteUrlEntry(String id){
        urlEntryRepository.deleteById(id);
        return true;
    }
    public boolean deleteAll(){
        urlEntryRepository.deleteAll();
        return true;
    }
}
