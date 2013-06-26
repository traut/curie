package com.heyheylabs.curie;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.mail.MessagingException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Test;

public class ParserTest {

    private static final Log log = LogFactory.getLog(ParserTest.class);
    private Parser parser;
    private Store store;

    public ParserTest() throws IOException {
        store = new Store();
        parser = new Parser(store);
        log.info("Привет, эклипс-консоль!");
    }

    public String getFirstForType(List<HashMap<String, String>> values, String key) {
        for(HashMap<String, String> val : values) {
            if (val.get("type") == key) {
                return val.get("value");
            }
        }
        return null;
    }

    @Test
    public void testPlainEmail() throws MessagingException, IOException {
        InputStream is = ClassLoader.getSystemResourceAsStream("plain-email.txt");
        Document doc = parser.parseMessage("plain-email", is);
        
        assertEquals(true, store.isValid(doc));
        
        //log.info(doc.asPrettyJson());

        Map<String, Object> data = doc.asDataMap();
        List<HashMap<String, String>> body = (List<HashMap<String, String>>) ((Map) data.get("fields")).get("body");
        assertEquals(getFirstForType(body, "text"), "Hey, testing queue\n\n\nSergey");
    }

    @Test
    public void testHtmlAndTextEmail() throws MessagingException, IOException {
        InputStream is = ClassLoader.getSystemResourceAsStream("html-and-text-email.txt");
        Document doc = parser.parseMessage("html-and-text-email", is);
        
        assertEquals(true, store.isValid(doc));

        //log.info(doc.asPrettyJson());

        Map<String, Object> data = doc.asDataMap();

        List<HashMap<String, String>> body = (List<HashMap<String, String>>) ((Map) data.get("fields")).get("body");
        assertNotNull(getFirstForType(body, "text"));
    }

    @Test
    public void testEmailWithAttachment() throws MessagingException, IOException {
        InputStream is = ClassLoader.getSystemResourceAsStream("with-attachment.txt");
        Document doc = parser.parseMessage("with-attachment", is);
        
        assertEquals(true, store.isValid(doc));

        //log.info(doc.asPrettyJson());

        Map<String, Object> data = doc.asDataMap();
        HashMap<String, Object> fields = (HashMap<String, Object>) data.get("fields");
        List<HashMap<String, String>> attachments = (List<HashMap<String, String>>) fields.get("attachments");
        
        assertEquals(1, attachments.size());
        
        for(HashMap<String, String> attachment : attachments) {
            Store.getAttachment(attachment.get("file")).delete();
        }
    }

}
