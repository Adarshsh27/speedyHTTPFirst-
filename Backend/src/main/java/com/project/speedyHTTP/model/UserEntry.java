package com.project.speedyHTTP.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.swing.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "userEntry")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEntry {
    @Id
    private String uid;
    private String name;
    private List<String> bookmarks ;
    private Map<String , List<String>> bookmarksMethods = new HashMap<>();
    private Map<String, Map<String,String>> payloadFilter = new HashMap<>();
    public UserEntry(String uid, String name, List<String> bookmarks) {
        this.uid = uid;
        this.name = name;
        if(bookmarks != null){
            this.bookmarks = bookmarks;
        }
        else {
            this.bookmarks = new ArrayList<>();
        }
        this.payloadFilter = new HashMap<>();
        this.bookmarksMethods = new HashMap<>();
    }

    public Map<String, List<String>> getBookmarksMethods() {
        return bookmarksMethods;
    }

    public void setBookmarksMethods(Map<String, List<String>> bookmarksMethods) {
        this.bookmarksMethods = bookmarksMethods;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setBookmarks(List<String> bookmarks) {
        this.bookmarks = bookmarks;
    }

    public Map<String, Map<String , String>> getPayloadFilter() {
        return payloadFilter;
    }

    public void setPayloadFilter(Map<String, Map<String , String>> payloadFilter) {
        this.payloadFilter = payloadFilter;
    }

    public String getUid() {
        return uid;
    }

    public String getName() {
        return name;
    }

    public List<String> getBookmarks() {
        return bookmarks;
    }

}
