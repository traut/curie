package com.heyheylabs.curie;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.mail.MessagingException;

import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Test;

import com.heyheylabs.curie.message.MessageParsed;
import com.heyheylabs.curie.message.MessageRaw;

public class ParserTest {

    private static final Log log = LogFactory.getLog(ParserTest.class);
    
    private static final String SCHEMAS_DIR = "../schemas";
    
    static {
        System.setProperty("java.awt.headless", "true");
    }

    public ParserTest() throws IOException {
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
        
        String filename = "plain-email.txt";
        URL resource = ClassLoader.getSystemResource(filename);
        
        Store store = new Store(new File(resource.getPath()).getParent(), SCHEMAS_DIR);
        Parser parser = new Parser(store);
        
        InputStream is = ClassLoader.getSystemResourceAsStream(filename);
        String mid = "plain-email";
        
        Pair<MessageParsed,MessageRaw> pair = parser.parseMessage(mid, is);
        
        MessageParsed parsed = pair.getLeft();
        MessageRaw raw = pair.getRight();
        
        Map data = parsed.asDataMap();
        HashMap<String, Object> rawData = raw.asDataMap();
        
        Map fields = (Map) data.get("fields");
        
        assertEquals(true, store.isValid(parsed));
		assertEquals(true, store.isValid(raw));
        
        
		List body = (List) fields.get("body");
        
        assertEquals(getFirstForType(body, "text"), "Hey, testing queue\n\n\nSergey");
        
        assertEquals(mid, data.get("id"));

        assertEquals(mid, rawData.get("id"));
        
        List references = (List) fields.get("references");
        
		assertEquals(2, references.size());
        assertEquals("<CABjC=OsuboJJWPdMRY=QbTragOz-tSBijOj68ZVo-BvfESwVzg@mail.gmail.com>", references.get(0));
        
        Object receivedHeaderValues = ((Map) rawData.get("values")).get("Received");
        
        assertNotNull(receivedHeaderValues);
        assertEquals(true, receivedHeaderValues instanceof Iterable);
        assertEquals(3, ((List) receivedHeaderValues).size());
        
    }

    @SuppressWarnings("rawtypes")
    @Test
    public void testHtmlAndTextEmail() throws MessagingException, IOException {
    	
    	String filename = "html-and-text-email.txt";
    	URL resource = ClassLoader.getSystemResource(filename);
    	Store store = new Store(new File(resource.getPath()).getParent(), SCHEMAS_DIR);
        Parser parser = new Parser(store);
    	
        InputStream is = ClassLoader.getSystemResourceAsStream(filename);
        Pair<MessageParsed, MessageRaw> pair = parser.parseMessage(filename, is);
        
        assertEquals(true, store.isValid(pair.getLeft()));
        assertEquals(true, store.isValid(pair.getRight()));

        Map data = pair.getLeft().asDataMap();

        List body = (List) ((Map) data.get("fields")).get("body");
        assertNotNull(getFirstForType(body, "text"));
    }
    
    @SuppressWarnings("rawtypes")
    @Test
    public void testBodyAsMultipartInline() throws MessagingException, IOException {
        
    	String filename = "body-in-parts.txt";
    	URL resource = ClassLoader.getSystemResource(filename);
        Store store = new Store(new File(resource.getPath()).getParent(), SCHEMAS_DIR);
        Parser parser = new Parser(store);
    	
    	InputStream is = ClassLoader.getSystemResourceAsStream(filename);
        Pair<MessageParsed, MessageRaw> pair = parser.parseMessage(filename, is);
        
        assertEquals(true, store.isValid(pair.getLeft()));
        assertEquals(true, store.isValid(pair.getRight()));

        Map data = pair.getLeft().asDataMap();

        List body = (List) ((Map) data.get("fields")).get("body");
        assertNotNull(getFirstForType(body, "text"));
    }

    @Test
    public void testEmailWithAttachment() throws MessagingException, IOException {
        
        String filename = "with-attachment.txt";
        
        URL resource = ClassLoader.getSystemResource(filename);
        Store store = new Store(new File(resource.getPath()).getParent(), SCHEMAS_DIR);
        Parser parser = new Parser(store);
        
        InputStream is = ClassLoader.getSystemResourceAsStream(filename);
        Pair<MessageParsed, MessageRaw> doc = parser.parseMessage("with-attachment", is);
        
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
