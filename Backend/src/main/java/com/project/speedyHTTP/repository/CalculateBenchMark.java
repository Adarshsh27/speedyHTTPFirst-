package com.project.speedyHTTP.repository;
import com.project.speedyHTTP.model.Metrics;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

//@Service
@Repository
public class CalculateBenchMark {

//    public static void main(String[] args) throws IOException {
//        String jsonString = "{ \"took\": 6, \"timed_out\": false, \"_shards\": { \"failed\": 0, \"successful\": 1, \"total\": 1, \"skipped\": 0 }, \"hits\": { \"total\": { \"relation\": \"eq\", \"value\": 4 }, \"hits\": [], \"max_score\": null }, \"aggregations\": { \"avg#avg_response_time\": { \"value\": 13.549999952316284 } } }";
//
//        ObjectMapper objectMapper = new ObjectMapper();
//        Response response = objectMapper.readValue(jsonString, Response.class);
//
//        double avgResponseTime = response.getAggregations().getAvgResponseTime().getValue();
//        System.out.println("Average Response Time: " + avgResponseTime);
//    }
    public List<Double> getAggregationValue(String jsonString){
        ObjectMapper objectMapper = new ObjectMapper();
        Response response = null;
        try {
            response = objectMapper.readValue(jsonString, Response.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        List<callMetricHits> callMetricArray = response.getHits().getHits();
        List<Double> responseTimes = new ArrayList<>();
        for(int i = 0 ; i < callMetricArray.size() ; i++){
            String jsonObj = callMetricArray.get(i).get_source();
            System.out.println(jsonObj);
            responseTimes.add(getMetrics(jsonObj).getResponseTime());
        }
        return responseTimes;
    }
    public static Metrics getMetrics(String input){
        input = input.replace("{callMetrics={", "").replace("}}", "");
        System.out.println("here input is : " + input);
        // Step 2: Split the string into key-value pairs
        String[] keyValuePairs = input.split(", ");

        // Step 3: Extract the values for responseTime and totalTime
        double responseTime = 0;
        double totalTime = 0;

        for (String pair : keyValuePairs) {
            String[] keyValue = pair.split("=");
            String key = keyValue[0];
            double value = Double.parseDouble(keyValue[1]);

            if (key.equals("responseTime")) {
                responseTime = value;
            } else if (key.equals("totalTime")) {
                totalTime = value;
            }
        }
        Metrics ans = new Metrics();
        ans.setTotalTime(totalTime);
        ans.setResponseTime(responseTime);
        // Print the extracted values
        System.out.println("Response Time: " + responseTime);
        System.out.println("Total Time: " + totalTime);
        return ans;
    }

    // Classes representing the JSON structure
    public static class Response {
        private int took;
        private boolean timed_out;
        private Shards _shards;
        private Hits hits;
        private double max_score;
//        private Aggregations aggregations;


        public double getMax_score() {
            return max_score;
        }

        public void setMax_score(double max_score) {
            this.max_score = max_score;
        }

        public int getTook() {
            return took;
        }

        public void setTook(int took) {
            this.took = took;
        }

        public boolean isTimed_out() {
            return timed_out;
        }

        public void setTimed_out(boolean timed_out) {
            this.timed_out = timed_out;
        }

        public Shards get_shards() {
            return _shards;
        }

        public void set_shards(Shards _shards) {
            this._shards = _shards;
        }

        public Shards getShards() {
            return _shards;
        }

        public void setShards(Shards _shards) {
            this._shards = _shards;
        }

        public Hits getHits() {
            return hits;
        }

        public void setHits(Hits hits) {
            this.hits = hits;
        }

//        public Aggregations getAggregations() {
//            return aggregations;
//        }

//        public void setAggregations(Aggregations aggregations) {
//            this.aggregations = aggregations;
//        }
    }

    public static class Shards {
        private int failed;
        private int successful;
        private int total;
        private int skipped;

        public int getFailed() {
            return failed;
        }

        public void setFailed(int failed) {
            this.failed = failed;
        }

        public int getSuccessful() {
            return successful;
        }

        public void setSuccessful(int successful) {
            this.successful = successful;
        }

        public int getTotal() {
            return total;
        }

        public void setTotal(int total) {
            this.total = total;
        }

        public int getSkipped() {
            return skipped;
        }

        public void setSkipped(int skipped) {
            this.skipped = skipped;
        }
    }

    public static class Hits {
        private Object total;
        private List<callMetricHits> hits;
        private Object max_score;

        public List<callMetricHits> getHits() {
            return hits;
        }

        public void setHits(List<callMetricHits> hits) {
            this.hits = hits;
        }

        public Object getTotal() {
            return total;
        }

        public void setTotal(Object total) {
            this.total = total;
        }


        public Object getMax_score() {
            return max_score;
        }

        public void setMax_score(Object max_score) {
            this.max_score = max_score;
        }
    }

    public  static class callMetricHits{
        private Object _index;
        private Object _id;
        private Object _score;
        private String _source;

        public Object get_index() {
            return _index;
        }

        public void set_source(String _source) {
            this._source = _source;
        }

        public void set_index(Object _index) {
            this._index = _index;
        }

        public Object get_id() {
            return _id;
        }

        public void set_id(Object _id) {
            this._id = _id;
        }

        public Object get_score() {
            return _score;
        }

        public void set_score(Object _score) {
            this._score = _score;
        }

        public String get_source() {
            return _source;
        }

    }


//    public static class Source{
//        @JsonProperty("callMetrics")
//        private Metrics callMetrics;
//
//        @JsonCreator
//        public Source(@JsonProperty("callMetrics") Metrics callMetrics) {
//            this.callMetrics = callMetrics;
//        }
//
//        public Metrics getCallMetric() {
//            return callMetrics;
//        }
//
//        public void setCallMetric(Metrics callMetric) {
//            this.callMetrics = callMetric;
//        }
//    }
//

    public static class callMetrics extends Metrics{

    }


    public static class Total {
        private String relation;
        private int value;

        public String getRelation() {
            return relation;
        }

        public void setRelation(String relation) {
            this.relation = relation;
        }

        public int getValue() {
            return value;
        }

        public void setValue(int value) {
            this.value = value;
        }
    }

    public static class Aggregations {
        @JsonProperty("avg#avg_response_time")
        private AvgResponseTime avgResponseTime;

        public AvgResponseTime getAvgResponseTime() {
            return avgResponseTime;
        }

        public void setAvgResponseTime(AvgResponseTime avgResponseTime) {
            this.avgResponseTime = avgResponseTime;
        }
    }

    public static class AvgResponseTime {
        private double value;

        public double getValue() {
            return value;
        }

        public void setValue(double value) {
            this.value = value;
        }
    }
}
