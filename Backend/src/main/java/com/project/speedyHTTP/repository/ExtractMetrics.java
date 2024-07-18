package com.project.speedyHTTP.repository;

public class ExtractMetrics {
    public static void main(String[] args) {
        String input = "{callMetrics={responseTime=10.399999976158142, totalTime=10.5}}";

        input = input.replace("{callMetrics={", "").replace("}}", "");

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

        // Print the extracted values
//        System.out.println("Response Time: " + responseTime);
//        System.out.println("Total Time: " + totalTime);
    }
}
