package com.project.speedyHTTP.WebSocket;

public class messageObject {
    private String message;
    private Obje object;

    public messageObject() {
        this.message = "hello from outside";
        this.object = new Obje();
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Obje getObject() {
        return object;
    }

    public void setObject(Obje object) {
        this.object = object;
    }

    private static class Obje{
        private String anotherMessage;

        public Obje( ) {
            this.anotherMessage = "Hello from the inside";
        }

        public String getAnotherMessage() {
            return anotherMessage;
        }

        public void setAnotherMessage(String anotherMessage) {
            this.anotherMessage = anotherMessage;
        }
    }

}

