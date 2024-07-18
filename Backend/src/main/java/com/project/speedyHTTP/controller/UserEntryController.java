package com.project.speedyHTTP.controller;
import com.google.gson.Gson;
import com.project.speedyHTTP.model.*;
import com.project.speedyHTTP.processing.HashUtility;
import com.project.speedyHTTP.service.UserEntryService;
import com.sun.tools.jconsole.JConsoleContext;
import com.sun.tools.jconsole.JConsolePlugin;
import jakarta.xml.ws.RequestWrapper;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLOutput;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/userEntry")
public class UserEntryController {
    @Autowired
    public UserEntryService userEntryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserEntry addUserEntry(@RequestBody UserEntry user){
        return userEntryService.addUserEntry(user);
    }
    @GetMapping
    public List<UserEntry> getAllUser(){
//        System.out.println("printing the entire list");
        return userEntryService.findAllEntries();
    }


    @GetMapping(path = "/{id}")
    public UserEntry getUserByID(@PathVariable("id") String id){
        return  userEntryService.getUser(id).orElse(null);
    }
//    @PutMapping(path = "/{id}")
//    public boolean addUrlToUser(@PathVariable("id") String id , @RequestBody String newUrl ){
//        System.out.println(id + " " + newUrl);
//        return userEntryService.addUrlToUser(id , newUrl);
//    }

    @DeleteMapping(path = "/{id}")
    public boolean removeUrlFromUser(@PathVariable("id") String id , @RequestBody RemoveURLEntry removeURLEntry){
        System.out.println("we got the body");
        if(removeURLEntry.getMessage().equals("payload")){
            System.out.println("removing payload");
            userEntryService.updateUserRemovePayload(removeURLEntry);
        }else if(removeURLEntry.getMessage().equals("url")){
            System.out.println("removing url ");
            userEntryService.updateUserRemoveUrl(removeURLEntry);
        }else if(removeURLEntry.getMessage().equals("method")){
            System.out.println("removing method");
            userEntryService.updateUserRemoveMethod(removeURLEntry);
        }
//        return userEntryService.removeUrlFromUser(id , url);
        return true;
    }
    @PutMapping(path = "/{id}")
    public Optional<UserEntry> updateUser(@RequestBody NewURLEntry newURLEntry){
        System.out.println("we getting");
        System.out.println(newURLEntry);
//        Map<String, List<Pair>> data = newURLEntry.getQueryParams();
//        data.forEach((key, value) -> {
//            System.out.println("Key: " + key);
//            value.forEach(pair -> System.out.println("Field: " + pair.getField() + ", Value: " + pair.getValue()));
//        });
////        System.out.println("post payload filters ");
////        for(String i : newURLEntry.getPostPayloadFilters()){
////            System.out.print(i + " , ");
////        }
////        System.out.println();
////        System.out.println("put payload filters ");
////        for(String i : newURLEntry.getPutPayloadFilters()){
////            System.out.print(i + " , ");
////        }
//        System.out.println();
        System.out.println("JSON format of the url entry");
        System.out.println(new Gson().toJson(newURLEntry));
        System.out.println(newURLEntry.getUrl());
        System.out.println(newURLEntry.getMethods());
        System.out.println(newURLEntry.getQueryParams());
        System.out.println(newURLEntry.getPostPayloadFilters());
        System.out.println(newURLEntry.getPutPayloadFilters());
//        return null;
          return userEntryService.updateUserAdd(newURLEntry);
    }
//    @PutMapping(path = "/{id}")
//    public Optional<UserEntry> updateUser(@RequestBody NewURLEntry newURLEntry){
////        System.out.println("post payload filters ");
////        for(String i : newURLEntry.getPostPayloadFilters()){
////            System.out.print(i + " , ");
////        }
////        System.out.println();
////        System.out.println("put payload filters ");
////        for(String i : newURLEntry.getPutPayloadFilters()){
////            System.out.print(i + " , ");
////        }
////        System.out.println();
//        System.out.println(newURLEntry.getUrl());
//        System.out.println(newURLEntry.getMethods());
//        System.out.println(newURLEntry.getQueryParams());
//        System.out.println(newURLEntry.getPostPayloadFilters());
//        System.out.println(newURLEntry.getPutPayloadFilters());
//          return userEntryService.updateUserAdd(newURLEntry);
//    }
    @DeleteMapping
    public boolean deleteAll(){
        return userEntryService.deleteAll();
    }

    @GetMapping(path = "/url/{id}")
    public List<String> getUrl(@PathVariable("id") String id){
        return userEntryService.getUser(id).get().getUserProvidedUrl();
    }

    @PostMapping(path = "/method")
    public List<String> getMethod(@RequestBody GetMethodRequest request){
        System.out.println(request.getId());
        System.out.println(request.getUserUrl());
        System.out.println(userEntryService.getUser(request.getId()).get());
        System.out.println(userEntryService.getUser((request.getId())).get().getMethodsToTrackForUser());
        System.out.println(userEntryService.getUser((request.getId())).get().getMethodsToTrackForUser().get(HashUtility.sha256(request.getUserUrl())));
       return (userEntryService.getUser(request.getId()).get()).getMethodsToTrackForUser().get(HashUtility.sha256(request.getUserUrl()));
    }

    @DeleteMapping(path = "delete/{id}")
    public boolean deleteUser(@PathVariable("id") String id){
        return userEntryService.deleteUserEntry(id);
    }
}
