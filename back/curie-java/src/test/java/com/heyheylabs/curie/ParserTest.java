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

import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Test;

public class ParserTest {

    private static final Log log = LogFactory.getLog(ParserTest.class);
    private Parser parser;
    private Store store;
    
    static {
        System.setProperty("java.awt.headless", "true");
    }


    public ParserTest() throws IOException {
        store = new Store("../schemas", "/tmp");
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

    @SuppressWarnings("rawtypes")
	@Test
    public void testPlainEmail() throws MessagingException, IOException {
        InputStream is = ClassLoader.getSystemResourceAsStream("plain-email.txt");
        String mid = "plain-email";
        
        Pair<ParsedMessage,RawMessage> pair = parser.parseMessage(mid, is);
        
        ParsedMessage parsed = pair.getLeft();
        RawMessage raw = pair.getRight();
        
        Map data = parsed.asDataMap();
        Map fields = (Map) data.get("fields");
        
        assertEquals(true, store.isValid(parsed));
		assertEquals(true, store.isValid(raw));
        
        
		List body = (List) fields.get("body");
        
        assertEquals(getFirstForType(body, "text"), "Hey, testing queue\n\n\nSergey");
        
        assertEquals(mid, data.get("id"));
        assertEquals(mid, raw.asDataMap().get("id"));
        
        List references = (List) fields.get("references");
        
		assertEquals(2, references.size());
        assertEquals("<CABjC=OsuboJJWPdMRY=QbTragOz-tSBijOj68ZVo-BvfESwVzg@mail.gmail.com>", references.get(0));
    }

    @SuppressWarnings("rawtypes")
    @Test
    public void testHtmlAndTextEmail() throws MessagingException, IOException {
        InputStream is = ClassLoader.getSystemResourceAsStream("html-and-text-email.txt");
        String mid = "html-and-text-email";
        Pair<ParsedMessage, RawMessage> pair = parser.parseMessage(mid, is);
        
        assertEquals(true, store.isValid(pair.getLeft()));
        assertEquals(true, store.isValid(pair.getRight()));

        Map data = pair.getLeft().asDataMap();

        List body = (List) ((Map) data.get("fields")).get("body");
        assertNotNull(getFirstForType(body, "text"));
    }

    @Test
    public void testEmailWithAttachment() throws MessagingException, IOException {
        InputStream is = ClassLoader.getSystemResourceAsStream("with-attachment.txt");
        
        Pair<ParsedMessage, RawMessage> doc = parser.parseMessage("with-attachment", is);
        
        assertEquals(true, store.isValid(doc.getLeft()));
        assertEquals(true, store.isValid(doc.getRight()));

        Map<String, Object> data = doc.getLeft().asDataMap();
        Map fields = (Map) data.get("fields");
        List attachments = (List) fields.get("attachments");
        
        assertEquals(1, attachments.size());
        
        //for(HashMap<String, String> attachment : attachments) {
        //    store.getAttachment(attachment.get("file")).delete();
        //}
    }

}
