package com.project.speedyHTTP.repository;

import com.project.speedyHTTP.model.UserEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntryRepository extends MongoRepository<UserEntry, String> {

}
