
import email, getpass, imaplib, os

import random


detach_dir = '/Users/traut/Temp/emails/' 
user = raw_input("Enter your GMail username:")
pwd = getpass.getpass("Enter your password: ")

# connecting to the gmail imap server
m = imaplib.IMAP4_SSL("imap.gmail.com")
m.login(user, pwd)
print m.list()
m.select("[Gmail]/All Mail") # here you a can choose a mail box like INBOX instead
# use m.list() to get all the mailboxes

resp, items = m.search(None, "ALL") # you could filter using the IMAP rules here (check http://www.example-code.com/csharp/imap-search-critera.asp)
items = items[0].split() # getting the mails id

for emailid in items:
    resp, data = m.fetch(emailid, "(RFC822)") # fetching the mail, "`(RFC822)`" means "get the whole stuff", but you can ask for headers only, etc
    email_body = data[0][1] # getting the mail content

    filename = "%032x" % random.getrandbits(128)

    full_filename = os.path.join(detach_dir, filename)

    f = open(full_filename, 'w')
    f.write(email_body)
    f.close()

    print full_filename
