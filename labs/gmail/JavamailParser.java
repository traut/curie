import java.util.*;
import java.io.*;
import javax.mail.*;
import javax.mail.internet.*;
import javax.mail.search.*;
import javax.activation.*;


public class JavamailParser {
	public static void main(String[] args) throws IOException {

		Properties props = new Properties();
		Session session = Session.getInstance(props);

		File folder = new File("/Users/traut/Temp/emails/");

		System.out.println(folder.toString());

		int exceptions = 0;
		int parsed = 0;

		long start = System.currentTimeMillis();

		for (File tmpFile : folder.listFiles()) {
			MimeMessage email = null;
			try {
				FileInputStream fis = new FileInputStream(tmpFile);
				email = new MimeMessage(session, fis);
				parsePart(email);
				parsed++;
			} catch (MessagingException e) {
				exceptions++;
			} catch (FileNotFoundException e) {
				throw new IllegalStateException("file not found issue issue: " + tmpFile.getAbsolutePath() , e); 
			}
		}

		System.out.println("Exceptions: " + exceptions);
		System.out.println("Time spent: " + (System.currentTimeMillis() - start) / 1000 + " secs, " + parsed + " parsed");
	}

	public static void parsePart(Part p) throws IOException, MessagingException {
		if (p instanceof Message) {
			Message m = (Message) p;
			m.getFrom();
			m.getReplyTo();
			m.getRecipients(Message.RecipientType.TO);
		}
		p.getContentType();
		if (p.isMimeType("text/plain")) {
		} else if (p.isMimeType("multipart/*")) {
			Multipart mp = (Multipart) p.getContent();
			for (int i = 0; i < mp.getCount(); i++) {
				parsePart(mp.getBodyPart(i));
			}
		} else if (p.isMimeType("message/rfc822")) {
			parsePart((Part) p.getContent());
		}


	}
}
