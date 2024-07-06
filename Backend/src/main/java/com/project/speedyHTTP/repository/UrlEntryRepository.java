package com.project.speedyHTTP.repository;

import com.project.speedyHTTP.model.UrlEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UrlEntryRepository extends MongoRepository<UrlEntry, String> {
}
