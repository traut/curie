# -*- coding: utf-8 -*-

import time
import json
import urllib
import redis
import random

import logging
from logging.handlers import RotatingFileHandler, SMTPHandler
logging.basicConfig(
    level = logging.DEBUG,
    format = '%(levelname)s: %(message)s'
)

from flask import Flask, session, redirect, url_for, escape, request, render_template, jsonify, abort, flash, g, Response

from datetime import datetime, timedelta, date
from collections import defaultdict


app = Flask(__name__)
app.config.from_pyfile('settings.py')

if not app.debug:
    file_handler = RotatingFileHandler(app.config['LOG_FILE'])
    file_handler.setLevel(logging.DEBUG)
    app.logger.addHandler(file_handler)

    mail_handler = SMTPHandler('localhost', 'goldfinch', app.config['ADMIN_MAIL'], 'error in runner.py')
    mail_handler.setLevel(logging.ERROR)
    app.logger.addHandler(mail_handler)
else:
    app.config['CSS_VERSION'] += str(time.time())
    app.config['JS_VERSION'] += str(time.time())




@app.route("/")
def index():
    return render_template('index.html')


red = redis.StrictRedis()

def event_stream(user):
    pubsub = red.pubsub()
    pubsub.subscribe('messages-%s' % user)

    pack = 'inbox'

    for message in pubsub.listen():
        app.logger.debug(message)
        try:
            data = json.loads(message['data'])
        except TypeError:
            continue
        dataPacked = json.dumps(dict(pack='inbox', message=data))
        app.logger.info("Sending %s", dataPacked)
        yield 'id: %s\n\ndata: %s\n\n' % (int(1000 * time.time()), dataPacked)

@app.route("/stream")
def stream():
    testuser = "johnwatson"
    return Response(event_stream(testuser), mimetype="text/event-stream")

@app.route("/pack/<pack>/messages")
def pack_messages(pack):

    #time.sleep(10);

    messages = []
    for i in range(0, 10):
        t = (pack, i)
        messages.append({
            'id' : 'id-%s%d' % t,
            'from' : 'sender-%s%d' % t,
            'to' : 'receiver-%s%d' % t,
            'subject' : 'subject-%s%d' % t,
            'status' : 'read' if int(random.random() * 10) % 2 == 0 else 'unread'
        })

    print messages

    return Response(json.dumps(messages), mimetype='application/json')


# set the secret key. keep this really secret:
app.secret_key = 'VSzn^a5*z@RFY@;\Pl3!M~ul;-DL+H\&m9m^S!^9|fb\(0z)K4qr8A<i5_4Hx%\),IGoU$ES(v)n4"lE3w<tT72<a%Af+{T0}w7K'

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8011, debug=True)

