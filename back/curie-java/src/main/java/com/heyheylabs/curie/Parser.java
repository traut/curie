package com.heyheylabs.curie;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
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
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.google.common.base.Function;
import com.google.common.base.Predicate;
import com.google.common.collect.Collections2;
import com.google.common.collect.Lists;
import com.heyheylabs.curie.message.MessageParsed;
import com.heyheylabs.curie.message.MessageRaw;


/*
 * CurieMail parser
 */
public class Parser {

    private static final Log log = LogFactory.getLog(Parser.class);

    private Properties props;
    private Session session;
    private Store store;

    public Parser(Store store) throws IOException {
        props = new Properties();
        session = Session.getInstance(props);
        this.store = store;
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));   
    }


    public Pair<MessageParsed, MessageRaw> parseMessage(String fileName) throws MessagingException, IOException {
        return parseMessage(new File(fileName));
    }

    public Pair<MessageParsed, MessageRaw> parseMessage(File f) throws MessagingException, IOException {
        FileInputStream fis = new FileInputStream(f);
        try {
            return parseMessage(f.getName(), fis);
        } finally {
            fis.close();
        }
    }

    protected Pair<MessageParsed, MessageRaw> parseMessage(String id, InputStream is) throws MessagingException, IOException {

        log.info("parsing " + id);
        long start = System.currentTimeMillis();

        MimeMessage email = new MimeMessage(session, is);

        MessageParsed doc = new MessageParsed(id);
        MessageRaw raw = new MessageRaw(id);

        Enumeration<Header> headers = email.getAllHeaders();
        while (headers.hasMoreElements()) {
            Header h = (Header) headers.nextElement();

            String value = h.getValue().trim();
            if (!StringUtils.isEmpty(value)) {
                raw.addHeaderValue(h.getName(), value);
            }
        }

        //FIXME: somehow parse "Received:" header to get recepients address. Needed for bcc emails without To: and Cc: headers

        raw.addHeaderValue("Body", IOUtils.toString(email.getInputStream(), "UTF-8"));

        String messageId = email.getMessageID();
        if (messageId == null) {                          // NOTE: spam warning
            messageId = "";
        }

        doc.addField("message_id", messageId);
        doc.addField("from", email.getFrom());
        doc.addField("to", email.getRecipients(RecipientType.TO));
        doc.addField("cc", email.getRecipients(RecipientType.CC));
        doc.addField("bcc", email.getRecipients(RecipientType.BCC));
        doc.addField("subject", email.getSubject());

        doc.addField("in-reply-to", email.getHeader("In-Reply-To", null)); 

        String referencesStr = email.getHeader("References", null);
        List references = (referencesStr == null) ? Collections.EMPTY_LIST : cleanUp(Arrays.asList(referencesStr.split("\\s+")));
        doc.addField("references", references);

        List<HashMap<String, String>> attachments = new LinkedList<HashMap<String, String>>();
        List<HashMap<String, String>> bodyParts = new LinkedList<HashMap<String, String>>();
        handlePart(email, bodyParts, attachments);

        doc.addField("body", bodyParts);
        doc.addField("attachments", attachments);

        log.info(id + " parsed in " + (System.currentTimeMillis() - start) / (float) 1000 + " secs");

        return Pair.of(doc, raw);
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

            if (part.isMimeType("text/*")) {

                String type = part.isMimeType("text/html") ? "html" : "text";
                String value = (String) part.getContent();

                HashMap<String, String> dict = new HashMap<String, String>();
                dict.put("type", type);
                dict.put("value", value);

                bodyParts.add(dict);
            } else {

                HashMap<String, String> dict = new HashMap<String, String>();
                dict.put("type", "inline");
                dict.put("value", part.getFileName());

                saveAttachment(part, attachments);
            }
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

    private List<String> cleanUp(List<String> values) {
        Collection<String> unescaped = Collections2.transform(values, new Function<String, String>() {
            public String apply(String value) {
                return StringUtils.chop(StringEscapeUtils.unescapeJava(value));
            }
        });
        Collection<String> filtered = Collections2.filter(unescaped, new Predicate<String>() {
            public boolean apply(String el) {
                return StringUtils.isNotBlank(el);
            }
        });
        return Lists.newArrayList(filtered);
    }
}
