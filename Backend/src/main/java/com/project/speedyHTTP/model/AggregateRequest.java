package com.project.speedyHTTP.model;

public class AggregateRequest {
    private String urlHash;
    private String time1;
    private String time2;


    public AggregateRequest(String urlHash, String time1, String time2) {
        this.urlHash = urlHash;
        this.time1 = time1;
        this.time2 = time2;
    }

    public String getUrlHash() {
        return urlHash;
    }

    public void setUrlHash(String urlHash) {
        this.urlHash = urlHash;
    }

    public String getTime1() {
        return time1;
    }

    public void setTime1(String time1) {
        this.time1 = time1;
    }

    public String getTime2() {
        return time2;
    }

    public void setTime2(String time2) {
        this.time2 = time2;
    }
}
