package com.project.speedyHTTP.WebSocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.speedyHTTP.model.BenchmarkAlertMessage;
import com.project.speedyHTTP.model.Message;
import com.project.speedyHTTP.model.NetworkCallEntry;
import com.project.speedyHTTP.model.ValidationAlertMessage;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
@Component
public class MyWebSocketHandler extends TextWebSocketHandler {
    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("Connected: " + session.getId());
        sessions.add(session);
        System.out.println(sessions);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        ObjectMapper ob = new ObjectMapper();
        String payload = message.getPayload();
        System.out.println("Received: " + payload);
        messageObject messageObj = new messageObject();
        String response = ob.writeValueAsString(messageObj);
        session.sendMessage(new TextMessage(response));
    }


    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("Disconnected: " + session.getId());
        sessions.remove(session);
    }


    /**
     * This function sends a benchmark alert to the chrome extension
     * @param alert
     * @throws IOException
     */
    public void sendBenchmarkAlert(BenchmarkAlertMessage alert) throws IOException {
        System.out.println("about to send a message ");
        ObjectMapper objectMapper = new ObjectMapper();
        String message = objectMapper.writeValueAsString(alert);
        System.out.println("sessions " + sessions.size());
        System.out.println(sessions);
        synchronized (sessions) {
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    System.out.println("sending the message apparently ");
                    System.out.println( new TextMessage(message));
                    session.sendMessage(new TextMessage(message));
                }
            }
        }
    }
    public void testing2(BenchmarkAlertMessage message) throws IOException{
        System.out.println("about to send a message ");
        ObjectMapper objectMapper = new ObjectMapper();
        String messagetosend = objectMapper.writeValueAsString(message);
        System.out.println("sessions " + sessions.size());
        System.out.println(sessions);
        synchronized (sessions) {
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    System.out.println("sending the message apparently ");
                    System.out.println( new TextMessage(messagetosend));
                    session.sendMessage(new TextMessage(messagetosend));
                }
            }
        }
    }
    public void testing(Message message) throws IOException {
        System.out.println("about to send a message ");
        ObjectMapper objectMapper = new ObjectMapper();
        String messagetosend = objectMapper.writeValueAsString(message);
        synchronized (sessions) {
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(messagetosend));
                }
            }
        }
    }

    /**
     * This function Sends the validation alert to the chrome extension
     * @param validationAlertMessage
     * @throws IOException
     */
    public void sendValidationAlert(ValidationAlertMessage validationAlertMessage) throws IOException {
        System.out.println("about to send a message ");
        ObjectMapper objectMapper = new ObjectMapper();
        String message = objectMapper.writeValueAsString(validationAlertMessage);
        System.out.println("sessions " + sessions.size());
        System.out.println(sessions);
        synchronized (sessions) {
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    System.out.println("sending the message apparently ");
                    System.out.println( new TextMessage(message));
                    session.sendMessage(new TextMessage(message));
                }
            }
        }
    }




}

