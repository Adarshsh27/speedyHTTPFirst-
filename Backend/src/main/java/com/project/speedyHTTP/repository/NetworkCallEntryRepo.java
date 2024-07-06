package com.project.speedyHTTP.repository;
import com.project.speedyHTTP.model.NetworkCallEntry;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NetworkCallEntryRepo extends ElasticsearchRepository<NetworkCallEntry, String> {

}
