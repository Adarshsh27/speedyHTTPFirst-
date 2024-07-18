package com.project.speedyHTTP.model;

import java.util.ArrayList;
import java.util.List;

public class ValidationResult {
    private boolean tracked;
    private List<BadQuery> badQueries = new ArrayList<>();
    private List<BadPayload> badPayloads = new ArrayList<>();
    private boolean passed;

    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }

    public boolean isTracked() {
        return tracked;
    }

    public void setTracked(boolean tracked) {
        this.tracked = tracked;
    }

    public List<BadQuery> getBadQueries() {
        return badQueries;
    }

    public void setBadQueries(List<BadQuery> badQueries) {
        this.badQueries = badQueries;
    }

    public List<BadPayload> getBadPayloads() {
        return badPayloads;
    }

    public void setBadPayloads(List<BadPayload> badPayloads) {
        this.badPayloads = badPayloads;
    }
}
