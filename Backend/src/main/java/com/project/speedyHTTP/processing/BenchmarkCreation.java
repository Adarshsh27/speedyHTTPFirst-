package com.project.speedyHTTP.processing;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

import java.util.Arrays;
@Repository
public class BenchmarkCreation {
    public  class Point {
        double[] coordinates;

        public Point(double... coordinates) {
            this.coordinates = coordinates;
        }
        public  Point(Point point){
            this.coordinates = point.getCoordinates();
        }
        public double[] getCoordinates() {
            return coordinates;
        }

    }

    public  Point findGeometricMedian(List<Point> points, double epsilon) {
        int n = points.size();
        int dimension = points.get(0).getCoordinates().length;
        int maxIterations = n * 100; // Define maxIterations based on the size of the list
        double[] currentPoint = new double[dimension];

        // Initialize with the centroid of the points
        for (Point point : points) {
            double[] coords = point.getCoordinates();
            for (int i = 0; i < dimension; i++) {
                currentPoint[i] += coords[i];
            }
        }
        for (int i = 0; i < dimension; i++) {
            currentPoint[i] /= n;
        }

        for (int iteration = 0; iteration < maxIterations; iteration++) {
            double[] nextPoint = new double[dimension];
            double weightSum = 0.0;
            boolean zeroDistance = false;

            for (Point point : points) {
                double[] coords = point.getCoordinates();
                double distance = distance(currentPoint, coords);
                if (distance == 0) {
                    zeroDistance = true;
                    continue; // Avoid division by zero
                }
                double weight = 1.0 / distance;
                weightSum += weight;
                for (int i = 0; i < dimension; i++) {
                    nextPoint[i] += coords[i] * weight;
                }
            }

            if (zeroDistance) {
                // If any point is exactly at the current point, return the current point
                return new Point(currentPoint);
            }

            boolean converged = true;
            for (int i = 0; i < dimension; i++) {
                nextPoint[i] /= weightSum;
                if (Math.abs(nextPoint[i] - currentPoint[i]) > epsilon) {
                    converged = false;
                }
                currentPoint[i] = nextPoint[i];
            }

            if (converged) {
                break;
            }
        }

        return new Point(currentPoint);
    }

    private  double distance(double[] a, double[] b) {
        double sum = 0;
        for (int i = 0; i < a.length; i++) {
            sum += Math.pow(a[i] - b[i], 2);
        }
        return Math.sqrt(sum);
    }

//    public double[] computeGeometricMedian(List<Point> points, double epsilon) {
//        int dimension = points.get(0).getCoordinates().length;
//        double[] median = initialGuess(points, dimension);
//        int cnt = 0;
//        double difference;
//        do {
//            double[] numeratorSum = new double[dimension];
//            double denominatorSum = 0;
//                cnt++;
//
//            for (Point point : points) {
//                double distance = distance(median, point.getCoordinates());
//                if (distance == 0) {
//                    continue;
//                }
//                for (int i = 0; i < dimension; i++) {
//                    numeratorSum[i] += point.getCoordinates()[i] / distance;
//                }
//                denominatorSum += 1 / distance;
//            }
//
//            double[] newMedian = new double[dimension];
//            for (int i = 0; i < dimension; i++) {
//                newMedian[i] = numeratorSum[i] / denominatorSum;
//            }
//
//            difference = distance(median, newMedian);
//            median = newMedian;
//        } while (difference > epsilon && cnt < 3 * points.size());
//        System.out.println("finally ");
//        System.out.println(cnt + " " + 3* points.size() + " " + median[0]);
//        return median;
//    }
//
//    private double distance(double[] a, double[] b) {
//        double sum = 0;
//        for (int i = 0; i < a.length; i++) {
//            sum += Math.pow(a[i] - b[i], 2);
//        }
//        return Math.sqrt(sum);
//    }

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
        if(responseTime.size()==0){
            System.out.println("returning 0");
            return 0;
        }
        List<Point> points = new ArrayList<>();
        for(Double i : responseTime){
            points.add(new Point(i));
        }
        double epsilon = 1e-6;
//        double median = computeGeometricMedian(points , epsilon)[0];
        double median = findGeometricMedian(points , epsilon).getCoordinates()[0];
        System.out.println("median");
        System.out.println(median);
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


