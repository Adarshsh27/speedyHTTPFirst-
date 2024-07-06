package com.project.speedyHTTP.controller;
import com.project.speedyHTTP.model.UserEntry;
import com.project.speedyHTTP.service.UserEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/userEntry")
public class UserEntryController {
    @Autowired
    public UserEntryService userEntryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserEntry addUserEntry(@RequestBody UserEntry newUser){
        return userEntryService.addUserEntry(newUser);
    }


    @GetMapping
    public List<UserEntry> getAllUser(){
//        System.out.println("printing the entire list");
        return userEntryService.findAllEntries();
    }


    @GetMapping(path = "/{id}")
    public UserEntry getUserByID(@PathVariable("id") String id){
//        System.out.println(id);
        return userEntryService.getUser(id).orElse(null);
    }
    @PutMapping(path = "/{id}")
    public boolean addUrlToUser(@PathVariable("id") String id , @RequestBody String newUrl ){
        System.out.println(id + " " + newUrl);
        return userEntryService.addUrlToUser(id , newUrl);
    }

    @DeleteMapping(path = "/{id}")
    public boolean removeUrlFromUser(@PathVariable("id") String id , @RequestBody String url){
        return userEntryService.removeUrlFromUser(id , url);
    }

    @DeleteMapping(path = "delete/{id}")
    public boolean deleteUser(@PathVariable("id") String id){
        return userEntryService.deleteUserEntry(id);
    }

}
