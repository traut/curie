package com.heyheylabs.curie.message;

import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import com.google.common.collect.Lists;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class MessageRaw implements IValidatable {

    private static String VALIDATION_SCHEMA = "message-raw.json";

    private String id;
    private Map<String, Object> headers = new HashMap<String, Object>();

    public MessageRaw(String id) {
        this.id = id;
    }

    public void addHeaderValue(String header, String value) {
        if (headers.containsKey(header)) {
            Object existingValue = headers.get(header);
            if (existingValue instanceof List) {
                ((List) existingValue).add(value);
                return;
            } else {
                List<Object> list = new LinkedList<Object>();
                list.add(existingValue);
                list.add(value);
                headers.put(header, list);
            }            
        } else {
            headers.put(header, value);
        }
    }

    public HashMap<String, Object> asDataMap() {
        HashMap<String, Object> data = new HashMap<String, Object>();

        data.put("id", id);
        data.put("values", headers);
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
