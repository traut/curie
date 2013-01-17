import xmpp


#username = "polzunov@gmail.com"
username = "polzunov@chat.facebook.com"

#password = "emailINS1D3"
password = "facebookINSIDE"

#server = "chat.gmail.com"
server = "chat.facebook.com"

recepient = "100002277504123@chat.facebook.com"
#recepient = "polzunov@chat.facebook.com"
#recepient = "traut.box@gmail.com"

message = "Hello, Yana! bot test. one, two"


jid = xmpp.protocol.JID(username)
client = xmpp.Client(jid.getDomain(), debug=['always'], port=5222)
#client = xmpp.Client(jid.getDomain(), debug=[], port=5222)
connection = client.connect()

if not connection:
    print "Unable to connect to server %s!" % server
    sys.exit(1)

if connection != 'tls':
    print "Warning: unable to estabilish secure connection - TLS failed!"
    sys.exit(1)

auth = client.auth(jid.getNode(), password)

if not auth:
    print "Unable to authorize on %s - check login/password." % server
    sys.exit(1)

if auth != 'sasl':
    print "Warning: unable to perform SASL auth os %s. Old authentication method used!" % server


def repeater(conn):
    try:
        conn.Process(1)
        return 1
    except KeyboardInterrupt:
        return 0

def message_handler(client, message):
    error = message.getError()
    if error:
        print "ERROR:", error
        return

    if message.getTag('composing'):
        print "User %s composing you a message" % message.getFrom()
        return

    print "==============="
    print "From:", message.getFrom()
    print "To:", message.getTo()
    print "Body:", message.getBody()

    print message

    reply = "You said '%s'" % message.getBody()

    client.send(xmpp.Message(message.getFrom(), reply))

client.RegisterHandler('message', message_handler)
client.sendInitPresence()

print "Sending message"
client.send(xmpp.protocol.Message(recepient, message))

while repeater(client):
    pass


