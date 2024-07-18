package com.project.speedyHTTP.service;

import com.project.speedyHTTP.repository.HarAnalyzer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.json.JsonObject;

@Service
public class HarAnalysisService {
    @Autowired
    private final HarAnalyzer harAnalyzer;
    public HarAnalysisService(HarAnalyzer harAnalyzer) {
        this.harAnalyzer = harAnalyzer;
    }

    public void analyzeHar(byte[] bytes , String uid) {
        JsonObject har = harAnalyzer.parseHar(bytes , uid );
        harAnalyzer.analyzeHar(har , uid);
    }
}

