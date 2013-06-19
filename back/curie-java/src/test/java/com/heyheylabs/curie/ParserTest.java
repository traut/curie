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

import com.github.fge.jsonschema.exceptions.ProcessingException;

public class ParserTest {
    
    private static final Log log = LogFactory.getLog(ParserTest.class);
    private Parser parser;
    
    public ParserTest() throws IOException {
        parser = new Parser();
        System.out.println("Привет, эклипс-консоль!");
    }
    
    public String getFirstForKey(List<HashMap<String, String>> values, String key) {
        for(HashMap<String, String> val : values) {
            if (val.containsKey(key)) {
                return val.get(key);
            }
        }
        return null;
    }
    
    @Test
    public void testPlainEmail() throws MessagingException, IOException {
        InputStream is = ClassLoader.getSystemResourceAsStream("plain-email.txt");
        Document doc = parser.parseMessage("plain-email", is);
        log.info(doc.toPrettyJson());
        
        Map<String, Object> data = doc.getData();
        List<HashMap<String, String>> body = (List<HashMap<String, String>>) ((Map) data.get("raw")).get("Body");
        assertEquals(getFirstForKey(body, "text"), "Hey, testing queue\n\n\nSergey");
    }
    
    @Test
    public void testHtmlAndTextEmail() throws MessagingException, IOException {
        InputStream is = ClassLoader.getSystemResourceAsStream("html-and-text-email.txt");
        Document doc = parser.parseMessage("html-and-text-email", is);
        
        log.info(doc.toPrettyJson());
        
        Map<String, Object> data = doc.getData();
        
        List<HashMap<String, String>> body = (List<HashMap<String, String>>) ((Map) data.get("raw")).get("Body");
        assertNotNull(getFirstForKey(body, "text"));
    }

    @Test
    public void testEmailWithAttachment() throws MessagingException, IOException {
        InputStream is = ClassLoader.getSystemResourceAsStream("with-attachment.txt");
        Document doc = parser.parseMessage("with-attachment", is);
        
        log.info(doc.toPrettyJson());
        
        Map<String, Object> data = doc.getData();
        
        List<HashMap<String, String>> body = (List<HashMap<String, String>>) ((Map) data.get("raw")).get("Body");
        assertNotNull(getFirstForKey(body, "text"));
        
        for(HashMap<String, String> parts : body) {
            if (parts.containsKey("attachment")) {
                new File(parts.get("filename")).delete();
            }
        }
    }
    
    @Test
    public void testEmailWithReply() throws MessagingException, IOException {
        InputStream is = ClassLoader.getSystemResourceAsStream("with-reply.txt");
        Document doc = parser.parseMessage("with-reply", is);
        
        log.info(doc.toPrettyJson());
        
        Map<String, Object> data = doc.getData();
        
        List<HashMap<String, String>> body = (List<HashMap<String, String>>) ((Map) data.get("raw")).get("Body");
        assertNotNull(getFirstForKey(body, "text"));
    }
    
    @Test
    public void testEmailWithForward() throws MessagingException, IOException {
        InputStream is = ClassLoader.getSystemResourceAsStream("with-forward.txt");
        Document doc = parser.parseMessage("with-forward", is);
        
        log.info(doc.toPrettyJson());
        
        Map<String, Object> data = doc.getData();
        
        List<HashMap<String, String>> body = (List<HashMap<String, String>>) ((Map) data.get("raw")).get("Body");
        assertNotNull(getFirstForKey(body, "text"));
    }
    
    @Test
    public void testValidation() throws MessagingException, IOException, ProcessingException {
        InputStream is = ClassLoader.getSystemResourceAsStream("with-forward.txt");
        Document doc = parser.parseMessage("with-forward-and-validation", is);
        log.info(doc.toPrettyJson());
        
        assertEquals(true, parser.validate(doc));
    }
}
