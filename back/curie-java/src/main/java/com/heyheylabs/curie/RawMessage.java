package com.heyheylabs.curie;

import java.util.HashMap;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class RawMessage implements Validatable {
    
    private static String VALIDATION_SCHEMA = "message-raw.json";
    
    private String id;
    private HashMap<String, String> headerPairs = new HashMap<String, String>();
    
    public RawMessage(String id) {
        this.id = id;
    }
    
    public void addKeyValue(String header, String value) {
        this.headerPairs.put(header, value);
    }
    
    public HashMap<String, Object> asDataMap() {
        HashMap<String, Object> data = new HashMap<String, Object>();
        data.put("id", id);
        data.put("values", headerPairs);
        return data;
    }
     
    public String asJson() {
        Gson gson = new GsonBuilder()
            .disableHtmlEscaping()
            .create();
        return gson.toJson(asDataMap());
    }

    public String asPrettyJson() {
        Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .disableHtmlEscaping()
            .create();
        return gson.toJson(asDataMap());
    }
    
    @Override
    public String getSchemaFileName() {
        return VALIDATION_SCHEMA;
    }
}
