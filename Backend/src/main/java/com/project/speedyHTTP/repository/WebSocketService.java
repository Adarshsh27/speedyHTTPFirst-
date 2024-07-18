package com.project.speedyHTTP.repository;

import com.project.speedyHTTP.WebSocket.MyWebSocketHandler;
import com.project.speedyHTTP.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class WebSocketService {
    @Autowired
    private MyWebSocketHandler myWebSocketHandler;

    @Autowired
    private URLParser urlParser;

    // we need to alert that benchmark is not met
    public void alertForBenchmark(NetworkCallEntry idealEntry , NetworkCallEntry badEntry){
        BenchmarkAlertMessage message = new BenchmarkAlertMessage();
        message.setNetworkCallEntry(badEntry);
        message.setIdealCallEntry(idealEntry);
        message.setId(UUID.randomUUID().toString());
        message.setMessage("benchmarkFailed");
        // case one -> we have a different query param that is added .. so we need to find that first
        boolean extraQuery = false;
        String extraKey = "";
        String extraValue = "";
        List<DifferenceQueryParam> differentQuery = new ArrayList<>();
        boolean identical = true;

        for(String key : badEntry.getQuery().keySet()){
            if(idealEntry.getQuery() == null || idealEntry.getQuery().get(key) == null){
                // so this an extra query param .. so lets mark this
                extraQuery = true;
                extraKey = key;
                extraValue = badEntry.getQuery().get(key);
            }
            if(idealEntry.getQuery() == null ||idealEntry.getQuery().get(key) == null || (!idealEntry.getQuery().get(key).equals(badEntry.getQuery().get(key)))){
                identical = false;
            }
            if(idealEntry.getQuery() != null && idealEntry.getQuery().get(key) != null && (!idealEntry.getQuery().get(key).equals(badEntry.getQuery().get(key)))){
                differentQuery.add(new DifferenceQueryParam(key , idealEntry.getQuery().get(key) , badEntry.getQuery().get(key)));
            }
        }
        if(extraQuery){
            // we pass the extra query parameter and its values
            message.setError("extraQuery");
            message.setExtraQuery(new DifferenceQueryParam(extraKey , null , extraValue));
            message.setDifferentQueryParams(differentQuery);
        }

        else if(identical){
        // case two -> query is exactly matching with the ideal one .. then in this case we report that backend is down or something
        message.setError("identical");
        }else{
        // case three -> the value of query params are different but queries are the same
            message.setError("differentQueryValues");
            message.setDifferentQueryParams(differentQuery);
        }

        // now we send the message to the WebController and it will send it to the backend
        try {
            myWebSocketHandler.sendBenchmarkAlert(message);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
    // we need to alert that the call that you just made lacked some queries or payload
    public void validationFail(NetworkCallEntry badEntry ,ValidationResult validationResult){
        ValidationAlertMessage validationAlertMessage = new ValidationAlertMessage();
        validationAlertMessage.setMessage("validationFailed");
        validationAlertMessage.setNetworkCallEntry(badEntry);
        // validation will be of size 2 only because in case of no bookmark we will not notify the user

        validationAlertMessage.setBadQueries(validationResult.getBadQueries());
        validationAlertMessage.setBadPayloadList(validationResult.getBadPayloads());
        // validation 0 for missing queries

        // now our message is ready
        try {
            myWebSocketHandler.sendValidationAlert(validationAlertMessage);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
    public void testing2(BenchmarkAlertMessage message) throws IOException {
            myWebSocketHandler.testing2(message);
    }
    public void testing(Message message){
        try {
            myWebSocketHandler.testing(message);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }



}
