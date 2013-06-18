package com.heyheylabs.curie;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.TimeZone;

import javax.mail.Address;
import javax.mail.internet.InternetAddress;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class Document {

    public static final String DEFAULT_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

    private final HashMap<String, Object> data = new HashMap<String, Object>();

    public Document() {
        data.put("raw", new HashMap<String, Object>());
        data.put("received", new Date());
    }

    public void addAsOne(String field, Object value) {
        data.put(field, value);
    }
    
    public void addAsList(String field, Object... values) {
        if (values != null) {
            LinkedList selected = new LinkedList();
            for (Object v : values) {
                if (v != null) {
                    selected.add(v);
                }
            }
            data.put(field, selected);
        }
    }

    @SuppressWarnings("unchecked")
    public void addRaw(String field, Object value) {
        ((HashMap<String, Object>) data.get("raw")).put(field, value);
    }

    public void addAddresses(String field, Address[] recipients) {
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

        data.put(field, pairs);
    }

    public String toJson() {
        return new Gson().toJson(data);
    }
    
    public String toPrettyJson() {
        Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .disableHtmlEscaping()
            .setDateFormat(DEFAULT_DATE_FORMAT)
            .create();
        return gson.toJson(data);
    }
    
    public Map<String, Object> getData() {
        return data;
    }

}
