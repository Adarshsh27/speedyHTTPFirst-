package com.project.speedyHTTP.service;

import com.project.speedyHTTP.model.NetworkCallEntry;
import com.project.speedyHTTP.model.NetworkCallObject;
import com.project.speedyHTTP.repository.URLParser;
import com.project.speedyHTTP.repository.NetworkCallEntryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class NetworkCallEntryService {
    @Autowired
    private NetworkCallEntryRepo networkCallEntryRepo;
    @Autowired
    private UrlEntryService urlEntryService;
    public Iterable<NetworkCallEntry> findAll(){
        return networkCallEntryRepo.findAll();
    }

    @Autowired
    private URLParser URLParser;

    public NetworkCallEntry insert(NetworkCallEntry product){
        return networkCallEntryRepo.save(product);
    }

    public boolean deleteAll(){
        networkCallEntryRepo.deleteAll();
        return true;
    }

    public NetworkCallEntry addToES(NetworkCallObject newEntry) throws IOException {
        NetworkCallEntry toAdd = adding(newEntry);
        urlEntryService.updateUrlEntry(toAdd);
        return networkCallEntryRepo.save(toAdd);
    }
    public NetworkCallEntry adding(NetworkCallObject newEntry){
        return URLParser.adding(newEntry);
    }
}
