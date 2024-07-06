package com.project.speedyHTTP.processing;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

import java.util.Arrays;
@Repository
public class BenchmarkCreation {
    public class Point {
        double[] coordinates;

        public Point(double... coordinates) {
            this.coordinates = coordinates;
        }

        public double[] getCoordinates() {
            return coordinates;
        }
    }

    public double[] computeGeometricMedian(List<Point> points, double epsilon) {
        int dimension = points.get(0).getCoordinates().length;
        double[] median = initialGuess(points, dimension);

        double difference;
        do {
            double[] numeratorSum = new double[dimension];
            double denominatorSum = 0;

            for (Point point : points) {
                double distance = distance(median, point.getCoordinates());
                if (distance == 0) {
                    continue;
                }
                for (int i = 0; i < dimension; i++) {
                    numeratorSum[i] += point.getCoordinates()[i] / distance;
                }
                denominatorSum += 1 / distance;
            }

            double[] newMedian = new double[dimension];
            for (int i = 0; i < dimension; i++) {
                newMedian[i] = numeratorSum[i] / denominatorSum;
            }

            difference = distance(median, newMedian);
            median = newMedian;
        } while (difference > epsilon);

        return median;
    }

    private double distance(double[] a, double[] b) {
        double sum = 0;
        for (int i = 0; i < a.length; i++) {
            sum += Math.pow(a[i] - b[i], 2);
        }
        return Math.sqrt(sum);
    }

    private double[] initialGuess(List<Point> points, int dimension) {
        double[] sum = new double[dimension];
        for (Point point : points) {
            for (int i = 0; i < dimension; i++) {
                sum[i] += point.getCoordinates()[i];
            }
        }
        for (int i = 0; i < dimension; i++) {
            sum[i] /= points.size();
        }
        return sum;
    }
    public double getBenchmark(List<Double> responseTime){
        List<Point> points = new ArrayList<>();
        for(Double i : responseTime){
            points.add(new Point(i));
        }
        double epsilon = 1e-6;
        double median = computeGeometricMedian(points , epsilon)[0];
        return median;
    }
//    public static void main(String[] args) {
//        List<Point> points = new ArrayList<>(Arrays.asList(
//                new Point(1, 2),
//                new Point(2, 3),
//                new Point(3, 4),
//                new Point(4, 5),
//                new Point(5, 6)
//        ));
//
//        double epsilon = 1e-6;  // Convergence threshold
//        double[] median = computeGeometricMedian(points, epsilon);
//        System.out.println("Geometric Median with initial points: " + Arrays.toString(median));
//
//        Point[] newPoints = {
//                new Point(1000, 1000),
//                new Point(100, 100),
//                new Point(50, 50),
//                new Point(2000, 2000)
//        };
//
//        for (Point newPoint : newPoints) {
//            points.add(newPoint);
//            median = computeGeometricMedian(points, epsilon);
//            System.out.println("Geometric Median after adding " + Arrays.toString(newPoint.getCoordinates()) + ": " + Arrays.toString(median));
//        }
//    }
}


