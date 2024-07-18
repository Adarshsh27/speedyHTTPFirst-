package com.project.speedyHTTP.model;

import java.util.ArrayList;
import java.util.List;

public class Message {
    String message;
    private temp networkCallEntry;
    private List<String> missingQueries = new ArrayList<>();
    private List<String> missingPayload = new ArrayList<>();

    public List<String> getMissingQueries() {
        return missingQueries;
    }
    public Message(){
        this.message = "validationFailed";
        temp ne = new temp();
        ne.setUrl("hi we are checking");
        List<String> nee = new ArrayList<>();
        List<String> need = new ArrayList<>();
        nee.add("adarsh");
        nee.add("alok");
        need.add("rishabh");
        need.add("shubham");
        this.networkCallEntry = ne;
        this.missingQueries = nee;
        this.missingPayload = need;
    }
    public void setMissingQueries(List<String> missingQueries) {
        this.missingQueries = missingQueries;
    }

    public List<String> getMissingPayload() {
        return missingPayload;
    }

    public void setMissingPayload(List<String> missingPayload) {
        this.missingPayload = missingPayload;
    }

    public temp getNetworkCallEntry() {
        return networkCallEntry;
    }

    public void setNetworkCallEntry(temp networkCallEntry) {
        this.networkCallEntry = networkCallEntry;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
    private static  class temp{
        private String url;

        public String getUrl() {
            return url;
        }
        public void setUrl(String url) {
            this.url = url;
        }
    }

}
