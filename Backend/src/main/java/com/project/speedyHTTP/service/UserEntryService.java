package com.project.speedyHTTP.service;
import com.project.speedyHTTP.model.UserEntry;
import com.project.speedyHTTP.repository.EntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

@Service
public class UserEntryService {
    @Autowired
    private EntryRepository entryRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

    public boolean addUrlToUser(String userID, String newURL) {
        Query query = new Query(Criteria.where("uid").is(userID));
        Update update = new Update().addToSet("bookmarks", newURL);
        mongoTemplate.updateFirst(query, update, UserEntry.class);
        return true;
    }

    public boolean removeUrlFromUser(String userId, String url) {
        Query query = new Query(Criteria.where("uid").is(userId));
        Update update = new Update().pull("bookmarks", url);
        mongoTemplate.updateFirst(query, update, UserEntry.class);
        return true;
    }

    public UserEntry addUserEntry(UserEntry user){
        return entryRepository.save(user);
    }
    public List<UserEntry> findAllEntries(){
        return entryRepository.findAll();
    }
    public Optional<UserEntry> getUser(String ID){
        return entryRepository.findById(ID);
    }

    public boolean deleteUserEntry(String ID){
        entryRepository.deleteById(ID);
        return true;
    }

}
