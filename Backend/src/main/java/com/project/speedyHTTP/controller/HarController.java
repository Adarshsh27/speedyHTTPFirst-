package com.project.speedyHTTP.controller;

import com.project.speedyHTTP.service.HarAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/har")
public class HarController {
    @Autowired
    private HarAnalysisService harAnalysisService;
    @PostMapping
    public String handleFileUpload(@RequestParam("harFile") MultipartFile file , @RequestParam("uid") String uid) {
        if (file.isEmpty()) {
            return "Please select a file to upload.";
        }
        try {
            // Save the file or process it as needed
            byte[] bytes = file.getBytes();

            System.out.println("user id ");
            System.out.println(uid);
            System.out.println("here is the HAR file");
            harAnalysisService.analyzeHar(bytes , uid);
            return "File uploaded successfully: " + file.getOriginalFilename();
        } catch (IOException e) {
            return "Failed to upload file: " + e.getMessage();
        }
    }
}
