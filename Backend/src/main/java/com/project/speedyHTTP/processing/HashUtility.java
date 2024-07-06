package com.project.speedyHTTP.processing;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class HashUtility {

    /**
     * Computes SHA-256 hash of the input string and returns it as a hexadecimal string.
     *
     * @param input The input string to hash.
     * @return The SHA-256 hash as a hexadecimal string.
     */
    public static String sha256(String input) {
        try {
            // Create a MessageDigest instance for SHA-256
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            // Pass the input data to the digest
            byte[] hashBytes = digest.digest(input.getBytes());

            // Convert the hash bytes to a hexadecimal string
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();

        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null; // Or handle the error as needed
        }
    }
}