package com.heyheylabs.curie;

import java.io.File;
import java.io.IOException;

import javax.mail.MessagingException;

import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.github.fge.jsonschema.exceptions.ProcessingException;
import com.heyheylabs.curie.message.MessageParsed;
import com.heyheylabs.curie.message.MessageRaw;

public class Runner {

    static {
        System.setProperty("java.awt.headless", "true");
    }

    private static final Log log = LogFactory.getLog(Runner.class);

    public static void main(String[] args) throws IOException, MessagingException, ProcessingException {

        if (args.length != 2) {
            System.err.println("Usage: java com.heyheylabs.curie.Parser <schemasDir> <messageFilePath>");
            System.exit(1);
        }
        
        String schemasDir = args[0];
        String filename = args[1];

        String emailDir = new File(filename).getParent();
        
        Store store = new Store(emailDir, schemasDir);
        Parser parser = new Parser(store);

        Pair<MessageParsed, MessageRaw> parsedPair = parser.parseMessage(filename);

        MessageParsed parsed = parsedPair.getLeft();
        MessageRaw raw = parsedPair.getRight();

        if (!store.isValid(parsed)) {
            log.error("Created ParsedMessage is not valid: " + parsed.asJson());
            System.exit(1);
        }

        if (!store.isValid(raw)) {
            log.error("Created RawMessage is not valid: " + raw.asJson());
            System.exit(1);
        }

        store.saveParsedMessage(filename, parsed);
        store.saveRawMessage(filename, raw);
    }

}
