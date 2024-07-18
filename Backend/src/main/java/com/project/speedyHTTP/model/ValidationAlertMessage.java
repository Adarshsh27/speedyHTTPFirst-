package com.project.speedyHTTP.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class ValidationAlertMessage
{
    private String message;
    private NetworkCallEntry networkCallEntry;
    private List<BadQuery> badQueries = new ArrayList<>();
    private List<BadPayload> badPayloadList = new ArrayList<>();

    public NetworkCallEntry getNetworkCallEntry() {
        return networkCallEntry;
    }
    public void setNetworkCallEntry(NetworkCallEntry networkCallEntry) {
        this.networkCallEntry = networkCallEntry;
    }
    public List<BadQuery> getBadQueries() {
        return badQueries;
    }

    public void setBadQueries(List<BadQuery> badQueries) {
        this.badQueries = badQueries;
    }

    public List<BadPayload> getBadPayloadList() {
        return badPayloadList;
    }

    public void setBadPayloadList(List<BadPayload> badPayloadList) {
        this.badPayloadList = badPayloadList;
    }

    private String id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ValidationAlertMessage() {
        this.id = UUID.randomUUID().toString();
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }



}
