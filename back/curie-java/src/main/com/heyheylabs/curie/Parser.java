package com.heyheylabs.curie;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Properties;
import java.util.TimeZone;

import javax.mail.Address;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Part;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMessage.RecipientType;
import javax.mail.internet.MimeUtility;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.simple.JSONObject;

/*
 * CurieMail parser
 */
public class Parser {

    private static final Log log = LogFactory.getLog(Parser.class);
    
    private static final Charset DEFAULT_CHARSET = Charset.forName("UTF-8");
    private static final SimpleDateFormat DEFAULT_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.S'Z'");

    private Properties props;
    private Session session;


    public Parser() {
        props = new Properties();
        session = Session.getInstance(props);
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));        
    }
    public static void main(String[] args) throws IOException, MessagingException {

        if (args.length != 1) {
            System.err.println("Usage: Parser <filename>");
            System.exit(1);
        }

        String filename = args[0];

        Parser parser = new Parser();
        HashMap<String, List<String>> result = parser.parseMessage(new File(filename));
        
        add(result, "received", DEFAULT_DATE_FORMAT.format(new Date()));
        add(result, "original", filename);

        JSONObject jsonBlob = new JSONObject(result);
        //log.info("JSON: " + jsonString);
        
        String jsonFilename = filename + ".json";
        File file = new File(jsonFilename);
        if (file.exists()) {
            file.delete();
        }
        BufferedWriter writer = new BufferedWriter(new FileWriter(file));
        jsonBlob.writeJSONString(writer);
        writer.flush();
        writer.close();
        
        log.info("JSON blob in " + jsonFilename);
    }


    public HashMap<String, List<String>> parseMessage(File file) throws MessagingException, IOException {

        HashMap<String, List<String>> parsed = new HashMap<String, List<String>>();

        long start = System.currentTimeMillis();

        FileInputStream fis = new FileInputStream(file);
        MimeMessage email = new MimeMessage(session, fis);
        
        String subject = email.getSubject();
        if (subject != null) {
            add(parsed, "header_subject", subject);
        }
        add(parsed, "header_message_id", email.getMessageID());
        

        addAddresses(parsed, email.getRecipients(RecipientType.TO), "header_to_name", "header_to_email");
        addAddresses(parsed, email.getRecipients(RecipientType.CC), "header_cc_name", "header_cc_email");
        addAddresses(parsed, email.getRecipients(RecipientType.BCC), "header_bcc_name", "header_bcc_email");
        addAddresses(parsed, email.getFrom(), "header_from_name", "header_from_email");

        add(parsed, "header_orig_date", DEFAULT_DATE_FORMAT.format(email.getSentDate()));
        add(parsed, "header_in_reply_to", email.getHeader("In-Reply-To"));
        
        parsePart(email, parsed);

        log.info(file.getAbsolutePath() + " parsed in " + (System.currentTimeMillis() - start) / (float) 1000 + " secs");
        fis.close();

        return parsed;
    }


    private void addAddresses(HashMap<String, List<String>> parsed, Address[] recipients, String nameField, String emailField) {
        if (recipients != null) {
            for (Address a : recipients) {
                if ("rfc822".equalsIgnoreCase(a.getType())) {
                    InternetAddress ia = (InternetAddress) a;
                    if (ia.getPersonal() != null) {
                        add(parsed, nameField, ia.getPersonal());
                    }
                    if (ia.getAddress() != null) {
                        add(parsed, emailField, ia.getAddress());
                    }
                }
            }
        }
    }

    private static void add(HashMap<String, List<String>> map, String key, String... values) {
        if (values != null && values.length > 0) {
            if (map.containsKey(key)) {
                map.get(key).addAll(Arrays.asList(values));
            } else {
                map.put(key, new LinkedList<String>(Arrays.asList(values)));
            }
        }
        
    }

    public void parsePart(Part p, HashMap<String, List<String>> parsed) throws IOException, MessagingException {
        if (p.isMimeType("text/plain") || p.isMimeType("text/html")) {
            add(parsed, "body", p.getContent().toString());
        } else if (p.isMimeType("multipart/*")) {
            Multipart mp = (Multipart) p.getContent();
            for (int i = 0; i < mp.getCount(); i++) {
                parsePart(mp.getBodyPart(i), parsed);
            }
        } else if (p.isMimeType("message/rfc822")) {
            parsePart((Part) p.getContent(), parsed);
        }
    }


    protected Charset readCharset(String contentType) {
        Charset charset = Charset.defaultCharset();
        if (StringUtils.contains(contentType, "charset=")) {
            String[] _split = contentType.split("charset=");
            if (_split != null && _split.length == 2) {
                String _c = _split[1];
                try {
                    charset = Charset.forName(_c);
                } catch (Exception e) {
                    log.error("Invalid content-type charset: '" + contentType + "'", e);
                }
            }
        }

        return charset;
    }
}
