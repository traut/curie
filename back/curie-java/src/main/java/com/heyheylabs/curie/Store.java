package com.heyheylabs.curie;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.UUID;

import javax.mail.MessagingException;
import javax.mail.Part;

import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jackson.JsonLoader;
import com.github.fge.jsonschema.exceptions.ProcessingException;
import com.github.fge.jsonschema.main.JsonSchemaFactory;
import com.github.fge.jsonschema.main.JsonValidator;
import com.github.fge.jsonschema.report.ProcessingReport;
import com.google.common.base.Joiner;

public class Store {
    
    private static final Log log = LogFactory.getLog(Store.class);
    
    private static final String DEFAULT_ATTACHMENT_STORAGE = "/home/curie/storage/attachments";    
    private static final URL MESSAGE_SCHEMA = ClassLoader.getSystemResource("message.json");

    private JsonValidator validator;
    private JsonNode schema;

    private String attachmentStorage = DEFAULT_ATTACHMENT_STORAGE;

    public Store() throws IOException {
        validator = JsonSchemaFactory.byDefault().getValidator();
        schema = JsonLoader.fromURL(MESSAGE_SCHEMA);
    }
    
    public Store(String attachmentStorageDir) throws IOException {
        this();
        this.attachmentStorage = attachmentStorageDir;
    }


    public boolean isValid(Document doc) throws IOException {
        
        ObjectMapper om = new ObjectMapper();
        String docAsJson = doc.asJson();
        JsonNode instance = om.readTree(docAsJson);
        
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
    
    public void saveMessage(String filename, Document doc) throws IOException {
        String jsonFilename = filename + ".json";
        File file = new File(jsonFilename);
        if (file.exists()) {
            file.delete();
        }
        try {
            BufferedWriter writer = new BufferedWriter(new FileWriter(file));
            writer.write(doc.asJson());
            writer.flush();
            writer.close();
            
            log.info("Parsed message saved to " + file.getAbsolutePath());
        } catch (IOException e) {
            log.error("Can't save a message to file=" + filename, e);
            throw e;
        }
    }
    
    public File getAttachment(String attachmentSavedAs) {
        
        String relativePath = attachmentSavedAs.substring(0, 2) + "/"
                + attachmentSavedAs.substring(2, 4) + "/"
                + attachmentSavedAs.substring(4, 6) + "/"
                + attachmentSavedAs;
        
        File file = new File(this.attachmentStorage, relativePath);
        
        File parent = file.getParentFile();
        if (!parent.exists()) {
            parent.mkdirs();
        }
        return file;
    }
    
    public String saveAttachment(String originalFilename, InputStream in) throws IOException, MessagingException, FileNotFoundException {
        
        String filename = UUID.randomUUID().toString() + ".attachment";
         
        FileOutputStream out = new FileOutputStream(getAttachment(filename));

        try {
            IOUtils.copy(in, out);
            return filename;
        } catch (IOException e) {
            log.error("Cannot save attachment " + originalFilename + " to " + filename + ". Skipping");
            return null;
        } finally {
            IOUtils.closeQuietly(in);
            IOUtils.closeQuietly(out);
        }
    }


}
