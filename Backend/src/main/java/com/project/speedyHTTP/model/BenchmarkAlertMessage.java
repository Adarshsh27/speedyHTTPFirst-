package com.project.speedyHTTP.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class BenchmarkAlertMessage {

    /*error : a.error,
    id : a.id,
    url : a.networkCallEntry.url,
    query : a.networkCallEntry.query,
    payloadMap : a.networkCallEntry.payloadMap,
    callMetrics : {
        responseTime : a.networkCallEntry.callMetrics.responseTime
    },
    extraQueryParams : [],
    differentQueryParams : [],
    idealCallEntry : {
        url : a.idealCallEntry.url,
                query : a.idealCallEntry.query,
                payloadMap : a.idealCallEntry.payloadMap,
                callMetrics : {
            responseTime : a.idealCallEntry.callMetrics.responseTime
        }
    }*/

    public BenchmarkAlertMessage(String message) {
        this.message = message;
    }

    private String message;
    private String id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    private NetworkCallEntry networkCallEntry;
    private NetworkCallEntry idealCallEntry;

    private String error;
    private List<DifferenceQueryParam> differentQueryParams = new ArrayList<>();
    private DifferenceQueryParam extraQueryParams = new DifferenceQueryParam(null , null , null );

    public NetworkCallEntry getNetworkCallEntry() {
        return networkCallEntry;
    }

    public void setNetworkCallEntry(NetworkCallEntry networkCallEntry) {
        this.networkCallEntry = networkCallEntry;
    }
    public BenchmarkAlertMessage(String error, List<DifferenceQueryParam> differenceArray, DifferenceQueryParam extraQuery) {
        this.error = error;
        this.differentQueryParams = differenceArray;
        this.extraQueryParams = extraQuery;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public List<DifferenceQueryParam> getDifferentQueryParams() {
        return differentQueryParams;
    }

    public void setDifferentQueryParams(List<DifferenceQueryParam> differenceArray) {
        this.differentQueryParams = differenceArray;
    }

    public DifferenceQueryParam getExtraQuery() {
        return extraQueryParams;
    }

    public NetworkCallEntry getIdealCallEntry() {
        return idealCallEntry;
    }

    public void setIdealCallEntry(NetworkCallEntry idealCallEntry) {
        this.idealCallEntry = idealCallEntry;
    }

    public DifferenceQueryParam getExtraQueryParams() {
        return extraQueryParams;
    }

    public void setExtraQueryParams(DifferenceQueryParam extraQueryParams) {
        this.extraQueryParams = extraQueryParams;
    }

    public void setExtraQuery(DifferenceQueryParam extraQuery) {
        this.extraQueryParams = extraQuery;
    }
}
