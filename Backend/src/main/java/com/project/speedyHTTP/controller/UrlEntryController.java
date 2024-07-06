package com.project.speedyHTTP.controller;
import com.project.speedyHTTP.model.UrlEntry;
import com.project.speedyHTTP.service.UrlEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/urlEntry")
public class UrlEntryController {
    @Autowired
    private UrlEntryService urlEntryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UrlEntry addUrlEntry(@RequestBody UrlEntry url){
        System.out.println("trying to add the url ");
        System.out.println(url);
        return urlEntryService.addUrlEntry(url);
    }

    @GetMapping
    public List<UrlEntry> getAllUser(){
        System.out.println("printing the entire list");
        return urlEntryService.findAllEntries();
    }
    @GetMapping(path = "/{id}")
    public UrlEntry getUrlByID(@PathVariable("id") String id){
        System.out.println(id);
        return urlEntryService.getUrl(id);
    }
    @DeleteMapping(path = "/{id}")
    public boolean deleteUser(@PathVariable("id") String id){
        return urlEntryService.deleteUrlEntry(id);
    }
    @DeleteMapping
    public boolean deleteAll(){
        urlEntryService.deleteAll();
        return true;
    }
}
