package com.heyheylabs.curie;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;
import java.util.TimeZone;

import javax.mail.Address;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Part;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMessage.RecipientType;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.simple.JSONObject;

import com.surftools.BeanstalkClient.Client;
import com.surftools.BeanstalkClientImpl.ClientImpl;



public class Parser {

    private static final Log log = LogFactory.getLog(Parser.class);
    
    private static final Charset DEFAULT_CHARSET = Charset.forName("UTF-8");
    private static final SimpleDateFormat DEFAULT_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.S'Z'");
    
    private static final String QUEUE_HOST = "localhost";
    private static final int QUEUE_PORT = 11300;

    private Properties props;
    private Session session;


    public Parser() {
        props = new Properties();
        session = Session.getInstance(props);
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    private HashMap<String, Set<String>> parseMessage(File file) throws MessagingException, IOException {

        HashMap<String, Set<String>> parsed = new HashMap<String, Set<String>>();

        long start = System.currentTimeMillis();

        FileInputStream fis = new FileInputStream(file);
        MimeMessage email = new MimeMessage(session, fis);

        /*
        email.getAllHeaderLines();
        for (Enumeration<Header> e = email.getAllHeaders(); e.hasMoreElements();) {
            Header h = e.nextElement();
            logger.info(h.getName() + ": " + h.getValue());
        }
         */

        add(parsed, "header_subject", new String(email.getSubject().getBytes(), DEFAULT_CHARSET));
        add(parsed, "header_message_id", email.getMessageID());
        add(parsed, "received", DEFAULT_DATE_FORMAT.format(new Date()));

        addAddresses(parsed, email.getRecipients(RecipientType.TO), "header_to_name", "header_to_email");
        addAddresses(parsed, email.getRecipients(RecipientType.BCC), "header_bcc_name", "header_bcc_email");
        addAddresses(parsed, email.getRecipients(RecipientType.BCC), "header_bcc_name", "header_bcc_email");
        addAddresses(parsed, email.getFrom(), "header_from_name", "header_from_email");

        add(parsed, "header_orig_date", DEFAULT_DATE_FORMAT.format(email.getSentDate()));

        //Address sender = email.getSender();
        //add(parsed, "header_in_reply_to", email.getHeader("In-Reply-To"));
        //Charset messageCharset = readCharset(email.getContentType());
        parsePart(email, parsed);

        log.info(file.getAbsolutePath() + " parsed in " + (System.currentTimeMillis() - start) / (float) 1000 + " secs");
        fis.close();

        return parsed;
    }

    public static void main(String[] args) throws IOException, MessagingException {

        if (args.length != 1) {
            System.err.println("Usage: Parser <filename>");
            System.exit(1);
        }

        String filename = args[0];

        HashMap<String, Set<String>> result = new Parser().parseMessage(new File(filename));
        Client client = new ClientImpl(QUEUE_HOST, QUEUE_PORT);
        long jobId = client.put(65536, 0, 120, new JSONObject(result).toJSONString().getBytes());

        log.info("Pushed as job " + jobId);
        
        client.close();

    }

    private void addAddresses(HashMap<String, Set<String>> parsed, Address[] recipients, String nameField, String emailField) {
        if (recipients != null) {
            for (Address a : recipients) {
                if ("rfc822".equalsIgnoreCase(a.getType())) {
                    InternetAddress ia = (InternetAddress) a;
                    add(parsed, nameField, ia.getPersonal());
                    add(parsed, emailField, ia.getAddress());
                }
            }
        }
    }

    private static void add(HashMap<String, Set<String>> map, String key, String... values) {
        if (map.containsKey(key)) {
            System.out.println(key);
            System.out.println(map.get(key));
            System.out.println(Arrays.asList(values));
            map.get(key).addAll(Arrays.asList(values));
        } else {
            map.put(key, new HashSet<String>(Arrays.asList(values)));
        }
    }

    public void parsePart(Part p, HashMap<String, Set<String>> parsed) throws IOException, MessagingException {
        if (p.isMimeType("text/plain") || p.isMimeType("text/html")) {
            add(parsed, "body", new String(p.getContent().toString().getBytes(), DEFAULT_CHARSET));
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
