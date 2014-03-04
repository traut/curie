package com.heyheylabs.curie;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.UUID;

import javax.mail.MessagingException;

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
import com.heyheylabs.curie.message.MessageParsed;
import com.heyheylabs.curie.message.MessageRaw;
import com.heyheylabs.curie.message.IValidatable;

public class Store {

    private static final Log log = LogFactory.getLog(Store.class);

    private JsonValidator validator;

    private HashMap<String, JsonNode> schemas = new HashMap<String, JsonNode>();

    private final String schemasDir;
    private final String emailDir;

    public Store(String emailDir, String schemasDir) throws IOException {
        validator = JsonSchemaFactory.byDefault().getValidator();
        this.emailDir = emailDir;
        this.schemasDir = schemasDir;
    }

    private JsonNode loadSchema(String schemaFileName) throws IOException {
        if (!schemas.containsKey(schemaFileName)) {
            File schemaFullName = new File(schemasDir, schemaFileName);
            log.info("Loading schema " + schemaFullName.getAbsolutePath());
            JsonNode schema = JsonLoader.fromReader(new FileReader(schemaFullName));
            schemas.put(schemaFileName, schema);
        }
        return schemas.get(schemaFileName);
    }


    public boolean isValid(IValidatable doc) throws IOException {

        JsonNode schema = loadSchema(doc.getSchemaFileName());

        ObjectMapper om = new ObjectMapper();
        JsonNode instance = om.readTree(doc.asJson());

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

    public void saveToFile(String filename, String content) throws IOException {
        String tmpFilename = filename + ".tmp";
        File tmpFile = new File(tmpFilename);
        BufferedWriter writer = new BufferedWriter(new FileWriter(tmpFile));
        writer.write(content);
        writer.flush();
        writer.close();

        if (tmpFile.renameTo(new File(filename))) {
            log.info("Saved to " + filename);
            return;
        }
        throw new IOException("Can't move file " + tmpFilename + " to " + filename);

    }

    public void saveParsedMessage(String filename, MessageParsed doc) throws IOException {
        String jsonFilename = filename + ".parsed.json";
        saveToFile(jsonFilename, doc.asJson());
    }

    public void saveRawMessage(String filename, MessageRaw doc) throws IOException {
        String jsonFilename = filename + ".raw.json";
        saveToFile(jsonFilename, doc.asJson());
    }

    public File getAttachmentFile(String id) {

        String filename = id + ".attachment";
        File file = new File(this.emailDir, filename);

        File parent = file.getParentFile();
        if (!parent.exists()) {
            parent.mkdirs();
        }
        return file;
    }

    public String saveAttachment(String originalFilename, InputStream in) throws IOException, MessagingException, FileNotFoundException {

        String attachmentId = UUID.randomUUID().toString();
        FileOutputStream out = new FileOutputStream(getAttachmentFile(attachmentId));

        try {
            IOUtils.copy(in, out);      //NOTE: no streams larger than 2Gb
            return attachmentId;
        } catch (IOException e) {
            log.error("Cannot save attachment " + originalFilename + " to " + attachmentId + ". Skipping");
            return null;
        } finally {
            IOUtils.closeQuietly(in);
            IOUtils.closeQuietly(out);
            
            log.debug("Attachment \"" + originalFilename + "\" saved with name \"" + attachmentId + "\"");
        }
    }


}
