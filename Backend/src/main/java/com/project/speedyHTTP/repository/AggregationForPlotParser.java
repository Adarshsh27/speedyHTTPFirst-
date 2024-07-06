package com.project.speedyHTTP.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.speedyHTTP.model.PlotDataPoint;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class AggregationForPlotParser
{
    public List<PlotDataPoint> getDataPoints(String jsonString){
        ObjectMapper objectMapper = new ObjectMapper();
        Response response = null;
        try {
            response = objectMapper.readValue(jsonString, Response.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        List<PlotDataPoint> dataPoints= response.getHits().getDataPoints();
        return dataPoints;

    }
    public static class Response{
        private int took;
        private boolean timed_out;
        private CalculateBenchMark.Shards _shards;
        private Hits hits;

        public Hits getHits() {
            return hits;
        }

        public void setHits(Hits hits) {
            this.hits = hits;
        }

        public CalculateBenchMark.Shards get_shards() {
            return _shards;
        }

        public void set_shards(CalculateBenchMark.Shards _shards) {
            this._shards = _shards;
        }

        public boolean isTimed_out() {
            return timed_out;
        }

        public void setTimed_out(boolean timed_out) {
            this.timed_out = timed_out;
        }

        public int getTook() {
            return took;
        }

        public void setTook(int took) {
            this.took = took;
        }
    }
    public static class Hits{
        private Object total;
        private List<Bucket> hits;
        private double max_score;

        public double getMax_score() {
            return max_score;
        }

        public void setMax_score(double max_score) {
            this.max_score = max_score;
        }

        public Object getTotal() {
            return total;
        }

        public void setTotal(Object total) {
            this.total = total;
        }

        public List<Bucket> getHits() {
            return hits;
        }

        public void setHits(List<Bucket> hits) {
            this.hits = hits;
        }
        public List<PlotDataPoint> getDataPoints(){
            List<PlotDataPoint> ans = new ArrayList<>();
//            for(Bucket i : hits){
//                ans.add(i.get_source().getPlotDataPoint());
//            }
            for(Bucket i : hits){
                ans.add(parseAndPrint(i.get_source()));
            }

            return ans;
        }
    }
    public static class Bucket{
        private String _index;
        private String _id;
        private double _score;
        private String _source;

        public String get_index() {
            return _index;
        }

        public void set_index(String _index) {
            this._index = _index;
        }

        public String get_id() {
            return _id;
        }

        public void set_id(String _id) {
            this._id = _id;
        }

        public double get_score() {
            return _score;
        }

        public void set_score(double _score) {
            this._score = _score;
        }

        public String get_source() {
            return _source;
        }

        public void set_source(String _source) {
            this._source = _source;
        }
    }
    public static PlotDataPoint parseAndPrint(String input) {
        // Remove the outer braces
        input = input.substring(1, input.length() - 1);

        // Split the string by commas that are not within braces
        String[] parts = input.split(",(?![^{}]*\\})");

        // Variables to hold the parsed values
        long timestamp = 0;
        double responseTime = 0.0;

        // Iterate over the parts and extract the values
        for (String part : parts) {
            part = part.trim();
            if (part.startsWith("timestamp=")) {
                timestamp = Long.parseLong(part.split("=")[1]);
            } else if (part.startsWith("callMetrics={")) {
                String callMetrics = part.substring(part.indexOf("{") + 1, part.indexOf("}"));
                String[] metrics = callMetrics.split(",");
                for (String metric : metrics) {
                    metric = metric.trim();
                    if (metric.startsWith("responseTime=")) {
                        responseTime = Double.parseDouble(metric.split("=")[1]);
                    }
                }
            }
        }

        // Print the parsed values
        PlotDataPoint ans = new PlotDataPoint();
        System.out.println("Timestamp: " + timestamp);
        ans.setTimestamp(Long.toString(timestamp));
        ans.setResponseTime(responseTime);
        System.out.println("Response Time: " + responseTime);
        return ans;
    }

//    public static class Source{
//        @JsonProperty("timestamp")
//        private String timestamp;
//        @JsonProperty("callMetrics")
//        private CallMetrics callMetrics;
//
//        public String getTimestamp() {
//            return timestamp;
//        }
//
//        public void setTimestamp(String timestamp) {
//            this.timestamp = timestamp;
//        }
//
//        public CallMetrics getCallMetrics() {
//            return callMetrics;
//        }
//
//        public void setCallMetrics(CallMetrics callMetrics) {
//            this.callMetrics = callMetrics;
//        }
//        public PlotDataPoint getPlotDataPoint(){
//           PlotDataPoint ans = new PlotDataPoint();
//           ans.setTimestamp(timestamp);
//           ans.setResponseTime(callMetrics.getResponseTime());
//           return ans;
//        }
//
//    }
//    public static class CallMetrics{
//        private double responseTime;
//
//        public double getResponseTime() {
//            return responseTime;
//        }
//
//        public void setResponseTime(double responseTime) {
//            this.responseTime = responseTime;
//        }
//    }
}
