package com.heyheylabs.curie;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import javax.mail.MessagingException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.simple.JSONObject;

import com.heyheylabs.curie.Parser;

public class ParserTest {
    
    private static final Log log = LogFactory.getLog(ParserTest.class);
    
    
    public static void main(String[] args) throws MessagingException, IOException {
        
        String fileName = "/Users/traut/Work/curiemail/back/curie-java/src/test/test-email";
        
        HashMap<String, List<String>> messageData = new Parser().parseMessage(new File(fileName));
        
        JSONObject blob1 = new JSONObject(messageData);
        
        log.info(blob1.toJSONString());
        
    }

}
