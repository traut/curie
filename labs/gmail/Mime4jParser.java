import java.util.*;
import java.io.*;
import java.util.ArrayList;  
import org.apache.james.mime4j.message.*;
import org.apache.james.mime4j.parser.*;
import org.apache.james.mime4j.dom.*;


public class Mime4jParser {
	public static void main(String[] args) throws IOException {

		File folder = new File("/Users/spolzuno/Temp/mails/");

		System.out.println(folder.toString());

		int exceptions = 0;
		int parsed = 0;

		long start = System.currentTimeMillis();

		for (File tmpFile : folder.listFiles()) {
			FileInputStream fis = null;  

			try {  
				fis = new FileInputStream(tmpFile);  
				Message mimeMsg = new Message(fis);  

				Field priorityFld = mimeMsg.getHeader().getField("X-Priority");  

				if (mimeMsg.isMultipart()) {  
					Multipart multipart = (Multipart) mimeMsg.getBody();  
					parseBodyParts(multipart);  
				} else {  
					//If it's single part message, just get text body  
					getTxtPart(mimeMsg);  
				}  

				for (BodyPart attach : attachments) {}  

			} catch (IOException ex) {  
				ex.fillInStackTrace();  
                exceptions++;
			} finally {  
				if (fis != null) {  
					try {  
						fis.close();  
					} catch (IOException ex) {  
						ex.printStackTrace();  
					}  
				}  
			}  

		}

		System.out.println("Exceptions: " + exceptions);
		System.out.println("Time spent: " + (System.currentTimeMillis() - start) / 1000 + " secs, " + parsed + " parsed");

	}
	private static void parseBodyParts(Multipart multipart) throws IOException {  
		for (BodyPart part : multipart.getBodyParts()) {  
			if (part.isMimeType("text/plain")) {  
				getTxtPart(part);  
			} else if (part.isMimeType("text/html")) {  
				getTxtPart(part);  
			} else if (part.getDispositionType() != null && !part.getDispositionType().equals("")) {  
			}  

			if (part.isMultipart()) {  
				parseBodyParts((Multipart) part.getBody());  
			}  
		}  
	}  
}
