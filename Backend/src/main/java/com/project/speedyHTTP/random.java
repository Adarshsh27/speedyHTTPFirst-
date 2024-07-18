//package com.project.speedyHTTP;
//import java.util.*;
//
//public class random {
//    public static void main(String[] args) {
//        String input = "/asf/bcs/csdsf/dcss";
//        List<String> list = Arrays.asList("/bcs/csdsf/dcss",
//                "/asf/csdsf",
//                "/asf/bcs/csdsf/dcss/extra");
//
//        Set<String> missing = missingQuery(input, list);
//
//        for (String s : missing) {
//            System.out.println(s);
//        }
//    }
//
//    public static Set<String> splitString(String str) {
//        Set<String> result = new HashSet<>();
//        String[] items = str.split("/");
//
//        for (String item : items) {
//            if (!item.isEmpty()) { // Avoid adding empty strings
//                result.add(item);
//            }
//        }
//
//        return result;
//    }
//
//    public static Set<String> missingQuery(String input, List<String> list) {
//        Set<String> inputSet = splitString(input);
//        List<Pair<Integer, Set<String>>> data = new ArrayList<>();
//
//        for (String i : list) {
//            Set<String> toCheck = splitString(i);
//            Set<String> missing = new HashSet<>();
////            if(toCheck.size() < inputSet.size()){
////                continue;
////            }
//            for (String j : toCheck) {
//                if (!inputSet.contains(j)) {
//                    missing.add(j);
//                }
//            }
////            for (String j : inputSet) {
////                if (!toCheck.contains(j)) {
////                    missing.add(j);
////                }
////            }
//            data.add(new Pair<>(missing.size(), missing));
//        }
//
//        data.sort(Comparator.comparingInt(Pair::getKey));
//
//        if (!data.isEmpty()) {
//            return data.get(0).getValue();
//        } else {
//            return new HashSet<>();
//        }
//    }
//
//    // Helper class to hold pair data
//    static class Pair<K, V> {
//        private final K key;
//        private final V value;
//
//        public Pair(K key, V value) {
//            this.key = key;
//            this.value = value;
//        }
//
//        public K getKey() {
//            return key;
//        }
//
//        public V getValue() {
//            return value;
//        }
//    }
//}
//
