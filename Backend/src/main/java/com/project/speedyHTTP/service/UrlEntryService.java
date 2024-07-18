package com.project.speedyHTTP.service;
import com.project.speedyHTTP.model.NetworkCallEntry;
import com.project.speedyHTTP.model.UrlEntry;
import com.project.speedyHTTP.repository.GetNetworkCallRepo;
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
    @Autowired
    private GetNetworkCallRepo getNetworkCallRepo;

    public UrlEntry addUrlEntry(UrlEntry url){
        return urlEntryRepository.save(url);
    }
    public List<UrlEntry> findAllEntries(){
        return urlEntryRepository.findAll();
    }
    public UrlEntry getUrl(String id){
        return urlEntryRepository.findById(id).orElse(null);
    }

    /**
     * We are updating the benchmark value for this particular type of call
     * @param newEntry
     * @return
     * @throws IOException
     */
    public UrlEntry updateUrlBenchmarkEntry(NetworkCallEntry newEntry) throws IOException {
        String id = newEntry.getUrlHash();
        UrlEntry current = getUrl(id);
        // this is the first of its kind so just save it
        if(current == null){
            String hashId = newEntry.getUrlHash();
            current = new UrlEntry(hashId , newEntry.getUrl() , newEntry.getCallMetrics().getResponseTime() , 1 , 0);
        }else{
            current.setNewEntries(current.getNewEntries() + 1);
            current.setTotalCalls(current.getTotalCalls() + 1);
            current.setMethod(newEntry.getMethod());
            // so we have some benchmark existing
            if(current.getNewEntries() >= ((current.getTotalCalls())/10)){
                // we need to update
                // ok so here have set only the benchmark time and not update the query param map because we will find that n , n -1 query thing anyways
                // LOOK INTO THIS
                // calculating the new Benchmark
                System.out.println("we are going in ");
                double newBenchmark = (calculateBenchMarkService.getAggregate(newEntry.getUrl(), current.getMethod(), Long.toString(0) , Long.toString(newEntry.getTimestamp()), false , newEntry.getUid(),false));
//                NetworkCallEntry idealEntry = getNetworkCallRepo.nearestIdealNetworkCall(newBenchmark , newEntry.getUrlHash());
//   ------>      Asking mentors first... should i keep it with the calculated time, or the ideal entry time
                // this is correct because if we alter benchmark to anyside our calculation changes.
                current.setBenchMarkTime(newBenchmark);
            }
        }
        System.out.println("here");
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
