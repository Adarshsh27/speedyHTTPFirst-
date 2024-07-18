package com.project.speedyHTTP.controller;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.speedyHTTP.WebSocket.MyWebSocketHandler;
import com.project.speedyHTTP.model.*;
import com.project.speedyHTTP.repository.GetNetworkCallRepo;
import com.project.speedyHTTP.repository.WebSocketService;
import com.project.speedyHTTP.service.CalculateBenchMarkService;
import lombok.Data;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/testing")
public class testingController {
    @Autowired
    private CalculateBenchMarkService calculateBenchMarkService;
    @Autowired
    private WebSocketService webSocketService;

    @PutMapping
    public boolean testing(){
        for(Long i = 0L; i < 1000000000000L ; i++){

        }
        System.out.println("returning the test call");
        return true;
    }
}
