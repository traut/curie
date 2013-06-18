package com.heyheylabs.curie;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.TimeZone;
import java.util.UUID;
import java.util.logging.SimpleFormatter;

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

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonFactory.Feature;
import com.fasterxml.jackson.core.TreeNode;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jackson.JsonLoader;
import com.github.fge.jsonschema.exceptions.ProcessingException;
import com.github.fge.jsonschema.main.JsonSchemaFactory;
import com.github.fge.jsonschema.main.JsonValidator;
import com.github.fge.jsonschema.report.ProcessingReport;
import com.google.common.base.Joiner;
import com.google.gson.JsonNull;


/*
 * CurieMail parser
 */
public class Parser {

    

    private static final Log log = LogFactory.getLog(Parser.class);

    private static final Charset DEFAULT_CHARSET = Charset.forName("UTF-8");

    private static final String ATTACHMENT_STORAGE = "/tmp";//"/home/curie/storage/attachments";
    
    private static final String MESSAGE_SCHEMA_FILE = "/Users/traut/Work/curiemail/back/schemas/message.json";


    private Properties props;
    private Session session;

    private JsonValidator validator;
    private JsonNode schema;


    public Parser() throws IOException {
        props = new Properties();
        session = Session.getInstance(props);
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));   
        
        validator = JsonSchemaFactory.byDefault().getValidator();
        schema = JsonLoader.fromFile(new File(MESSAGE_SCHEMA_FILE));

    }

    public static void main(String[] args) throws IOException, MessagingException, ProcessingException {

        if (args.length != 1) {
            System.err.println("Usage: Parser <filename>");
            System.exit(1);
        }

        String filename = args[0];

        Parser parser = new Parser();
        Document doc = parser.parseMessage(new File(filename));
        
        if (!parser.validate(doc)) {
            log.error("Created doc is not valid (schema=" + MESSAGE_SCHEMA_FILE +") : " + doc.toJson());
            System.exit(1);
        }

        log.info("JSON blob: " + doc.toJson());

        String jsonFilename = filename + ".json";
        File file = new File(jsonFilename);
        if (file.exists()) {
            file.delete();
        }
        BufferedWriter writer = new BufferedWriter(new FileWriter(file));
        writer.write(doc.toJson());
        writer.flush();
        writer.close();

        log.info("JSON blob in " + jsonFilename);
    }

    public boolean validate(Document doc) throws IOException {
        
        ObjectMapper om = new ObjectMapper();
        om.setDateFormat(new SimpleDateFormat(Document.DEFAULT_DATE_FORMAT));
        
        JsonNode instance = om.readTree(doc.toJson());
        
        //JsonNode instance = om.getFactory().createParser(doc.toJson()).readValueAs(JsonNode.class);
        
        //JsonNode instance = om.valueToTree(doc.toJson());
        
        //JsonNode docJson = JsonLoader.fromString(doc.toJson());
        
        ProcessingReport report;
        try {
            report = validator.validate(schema, instance);
        } catch (ProcessingException e) {
            log.error("Exception while validating the doc:" + e.getProcessingMessage().getMessage(), e);
            return false;
        }
        
        if (!report.isSuccess()) {
            log.error(Joiner.on(";").join(report.iterator()));
            return false;
        }
        return true;
    }

    public Document parseMessage(File file) throws MessagingException, IOException {

        long start = System.currentTimeMillis();
        String id = file.getName();
        Document result = parseMessage(id, file);

        log.info(file.getAbsolutePath() + " parsed in " + (System.currentTimeMillis() - start) / (float) 1000 + " secs");

        return result;
    }

    public Document parseMessage(String id, File f) throws MessagingException, IOException {
        FileInputStream fis = new FileInputStream(f);
        try {
            return parseMessage(id, fis);
        } finally {
            fis.close();
        }
    }

    public Document parseMessage(String id, InputStream is) throws MessagingException, IOException {

        MimeMessage email = new MimeMessage(session, is);

        Document doc = new Document();
        
        doc.addAsOne("id", id);

        doc.addRaw("Subject", email.getSubject());
        doc.addRaw("Message-ID", email.getMessageID());
        doc.addRaw("Date", email.getSentDate());

        doc.addAddresses("from", email.getFrom());
        doc.addAddresses("to", email.getRecipients(RecipientType.TO));
        doc.addAddresses("cc", email.getRecipients(RecipientType.CC));
        doc.addAddresses("bcc", email.getRecipients(RecipientType.BCC));

        doc.addRaw("References", email.getHeader("References", ","));

        String[] inReplyTo = email.getHeader("In-Reply-To");
        if (inReplyTo != null && inReplyTo.length == 1) {
            doc.addRaw("In-Reply-To", inReplyTo[0]);
        }

        doc.addRaw("Body", handlePart(email));

        return doc;
    }


    public List<HashMap<String, String>> handlePart(Part part) throws IOException, MessagingException {

        /*
        if (p.isMimeType("text/plain") || p.isMimeType("text/html")) {
            add(parsed, "body", p.getContent().toString());
        } else if (p.isMimeType("multipart/*")) {
            Multipart mp = (Multipart) p.getContent();
            for (int i = 0; i < mp.getCount(); i++) {
                handlePart(mp.getBodyPart(i), parsed);
            }
        } else if (p.isMimeType("message/rfc822")) {
            handlePart((Part) p.getContent(), parsed);
        }
         */
        String disposition = part.getDisposition();
        String contentType = part.getContentType();

        List<HashMap<String, String>> result = new LinkedList<HashMap<String, String>>();

        if (disposition == null) {
            if (part.isMimeType("multipart/*")) {
                Multipart multipart = (Multipart) part.getContent();

                Map<String, Object> partData = new HashMap<String, Object>();
                for (int i = 0; i < multipart.getCount(); i++) {
                    for(HashMap<String, String> r : handlePart(multipart.getBodyPart(i))) {
                        result.add(r);
                    }
                }

            } else if (part.isMimeType("text/*")) {

                String key = part.isMimeType("text/html") ? "html" : "text";
                String value = (String) part.getContent();

                HashMap<String, String> dict = new HashMap<String, String>();
                dict.put(key, value);

                result.add(dict);
            } else {
                log.error("Unknown mime type");
            }
        } else if (disposition.equalsIgnoreCase(Part.ATTACHMENT)) {
            HashMap<String, String> dict = new HashMap<String, String>();
            dict.put("attachment", part.getFileName());

            String filename;
            if ((filename = saveAsAttachment(part)) != null) {
                dict.put("filename", filename);
                result.add(dict);
            }

        } else if (disposition.equalsIgnoreCase(Part.INLINE)) {
            HashMap<String, String> dict = new HashMap<String, String>();
            dict.put("inline", part.getFileName());

            String filename;
            if ((filename = saveAsAttachment(part)) != null) {
                dict.put("filename", filename);
                result.add(dict);
            }
        }

        return result;
    }

    private String saveAsAttachment(Part part) throws IOException, MessagingException, FileNotFoundException {
        
        String filename = UUID.randomUUID().toString();

        InputStream in = part.getInputStream();
        FileOutputStream out = new FileOutputStream(new File(ATTACHMENT_STORAGE, filename));

        try {
            IOUtils.copy(in, out);
            return filename;
        } catch (IOException e) {
            log.error("Cannot save attachment " + part.getFileName() + " to " + filename + ". Skipping");
            return null;
        } finally {
            IOUtils.closeQuietly(in);
            IOUtils.closeQuietly(out);
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
