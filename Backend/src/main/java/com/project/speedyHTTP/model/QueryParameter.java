package com.project.speedyHTTP.model;

public class QueryParameter {
    public String query;
    public String value;

    public QueryParameter(String query, String value) {
        this.query = query;
        this.value = value;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
