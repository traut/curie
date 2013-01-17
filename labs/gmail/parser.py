
import email, getpass, imaplib, os
import time


detach_dir = '/Users/traut/Temp/emails/'


counter = 0
start = time.time()
for fname in os.listdir(detach_dir):


    filename = os.path.join(detach_dir, fname)
    counter += 1

    with open(filename, 'r') as f:
        email_body = f.read()

    mail = email.message_from_string(email_body) # parsing the mail content to get a mail object

    #print '\t'.join(map(str, [counter, mail.get('from'), mail.get('subject'), "%d parts" % len(list(mail.walk())), mail.get_content_type()]))

print "%d mails in %f secs" % (counter, time.time() - start)
