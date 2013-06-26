package com.heyheylabs.curie;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Properties;
import java.util.TimeZone;

import javax.mail.BodyPart;
import javax.mail.Header;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Part;
import javax.mail.Session;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMessage.RecipientType;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.github.fge.jsonschema.exceptions.ProcessingException;


/*
 * CurieMail parser
 */
public class Parser {

    private static final Log log = LogFactory.getLog(Parser.class);

    private Properties props;
    private Session session;

    private Store store;

    public static void main(String[] args) throws IOException, MessagingException, ProcessingException {

        if (args.length != 1) {
            System.err.println("Usage: java com.heyheylabs.curie.Parser <filename>");
            System.exit(1);
        }

        String filename = args[0];

        Store store = new Store();

        Parser parser = new Parser(store);
        
        Document doc = parser.parseMessage(filename);
        
        if (!store.isValid(doc)) {
            log.error("Created doc is not valid: " + doc.asJson());
            System.exit(1);
        }

        store.saveMessage(filename, doc);
    }
    
    public Parser(Store store) throws IOException {
        props = new Properties();
        session = Session.getInstance(props);

        this.store = store;

        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));   

    }


    public Document parseMessage(String fileName) throws MessagingException, IOException {
        return parseMessage(new File(fileName));
    }

    public Document parseMessage(File f) throws MessagingException, IOException {
        FileInputStream fis = new FileInputStream(f);
        try {
            return parseMessage(f.getName(), fis);
        } finally {
            fis.close();
        }
    }

    public Document parseMessage(String id, InputStream is) throws MessagingException, IOException {
        
        log.info("id=" + id + " starting parse process");
        long start = System.currentTimeMillis();

        MimeMessage email = new MimeMessage(session, is);

        Document doc = new Document(id);

        Enumeration<Header> headers = email.getAllHeaders();
        while (headers.hasMoreElements()) {
            Header h = (Header) headers.nextElement();
            
            String value = h.getValue().trim();
            if (!StringUtils.isEmpty(value)) {
                doc.addRaw(h.getName(), value);
            }
        }
        doc.addRaw("Body", IOUtils.toString(email.getInputStream(), "UTF-8"));

        doc.addField("from", email.getFrom());
        doc.addField("to", email.getRecipients(RecipientType.TO));
        doc.addField("cc", email.getRecipients(RecipientType.CC));
        doc.addField("bcc", email.getRecipients(RecipientType.BCC));
        doc.addField("subject", email.getSubject());
        
        doc.addLabel("inbox");
        
        List<HashMap<String, String>> attachments = new LinkedList<HashMap<String, String>>();
        List<HashMap<String, String>> bodyParts = new LinkedList<HashMap<String, String>>();
        handlePart(email, bodyParts, attachments);
        
        doc.addField("body", bodyParts);
        doc.addField("attachments", attachments);
        
        log.info("id=" + id + " parsed in " + (System.currentTimeMillis() - start) / (float) 1000 + " secs");
        
        return doc;
    }


    public void handlePart(Part part, List<HashMap<String, String>> bodyParts,
            List<HashMap<String, String>> attachments) throws IOException, MessagingException {

        String disposition = part.getDisposition();

        if (disposition == null) {
            if (part.isMimeType("multipart/*")) {
                Multipart multipart = (Multipart) part.getContent();

                for (int i = 0; i < multipart.getCount(); i++) {
                    BodyPart subpart = multipart.getBodyPart(i);
                    handlePart(subpart, bodyParts, attachments);
                }

            } else if (part.isMimeType("text/*")) {

                String type = part.isMimeType("text/html") ? "html" : "text";
                String value = (String) part.getContent();
                
                HashMap<String, String> dict = new HashMap<String, String>();
                dict.put("type", type);
                dict.put("value", value);

                bodyParts.add(dict);
            } else {
                log.error("Unknown mime type. Part: " + part.toString());
            }
        } else if (disposition.equalsIgnoreCase(Part.ATTACHMENT)) {
            saveAttachment(part, attachments);
        } else if (disposition.equalsIgnoreCase(Part.INLINE)) {
            HashMap<String, String> dict = new HashMap<String, String>();
            dict.put("type", "inline");
            dict.put("value", part.getFileName());

            saveAttachment(part, attachments);
        }
    }

    private void saveAttachment(Part part, List<HashMap<String, String>> attachments)
            throws MessagingException, IOException, FileNotFoundException {
        
        HashMap<String, String> attachment = new HashMap<String, String>();
        
        String attachmentName = part.getFileName();
        String savedAs = store.saveAttachment(attachmentName, part.getInputStream());
        
        attachment.put("filename", attachmentName);
        attachment.put("file", savedAs);
        
        attachments.add(attachment);
        
        log.debug("attachment \"" + attachmentName + "\" saved to with name \"" + savedAs + "\"");
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
