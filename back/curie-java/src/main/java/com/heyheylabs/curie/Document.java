package com.heyheylabs.curie;

import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;

import javax.mail.Address;
import javax.mail.internet.InternetAddress;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class Document {

    public static final String DEFAULT_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

    private HashMap<String, Object> fields;
    private HashMap<String, Object> raw;
    private LinkedList<String> labels;
    private String id;

    public Document(String id) {
        fields = new HashMap<String, Object>();
        raw = new HashMap<String, Object>();
        labels = new LinkedList<String>();

        this.id = id;
    }

    public void addLabel(String label) {
        labels.add(label);
    }

    @SuppressWarnings("unchecked")
    public void addRaw(String field, Object value) {
        raw.put(field, value);
    }

    public void addField(String field, Address[] recipients) {
        LinkedList<HashMap<String, String>> pairs = new LinkedList<HashMap<String,String>>();
        if (recipients != null) {
            for (Address a : recipients) {
                if ("rfc822".equalsIgnoreCase(a.getType())) {

                    HashMap<String, String> addressPair = new HashMap<String, String>();

                    InternetAddress ia = (InternetAddress) a;
                    if (ia.getPersonal() != null) {
                        addressPair.put("name", ia.getPersonal());
                    }
                    if (ia.getAddress() != null) {
                        addressPair.put("email", ia.getAddress());
                    }

                    pairs.add(addressPair);
                }
            }
        }

        fields.put(field, pairs);
    }

    public void addField(String field, Object value) {
        fields.put(field, value);
    }

    public HashMap<String, Object> asDataMap() {
        HashMap<String, Object> data = new HashMap<String, Object>();
        data.put("id", this.id);
        data.put("received", new Date());
        data.put("labels", labels);
        
        data.put("raw", raw);
        data.put("fields", fields);
        return data;
    }

    public String asJson() {
        Gson gson = new GsonBuilder()
            .disableHtmlEscaping()
            .setDateFormat(DEFAULT_DATE_FORMAT)
            .create();
        return gson.toJson(asDataMap());
    }

    public String asPrettyJson() {
        Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .disableHtmlEscaping()
            .setDateFormat(DEFAULT_DATE_FORMAT)
            .create();
        return gson.toJson(asDataMap());
    }

}
