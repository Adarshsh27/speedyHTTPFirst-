package com.project.speedyHTTP.model;

import java.util.ArrayList;
import java.util.List;

public class PlotRequestFinalObject {
    private double benchmarkTime;
    private List<PlotDataPoint> data = new ArrayList<>();

    public double getBenchmarkTime() {
        return benchmarkTime;
    }

    public void setBenchmarkTime(double benchmarkTime) {
        this.benchmarkTime = benchmarkTime;
    }

    public List<PlotDataPoint> getData() {
        return data;
    }

    public void setData(List<PlotDataPoint> data) {
        this.data = data;
    }
}
