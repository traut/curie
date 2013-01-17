

@app.route("/keyserver", methods=['POST'])
def keyserver():

    email = request.form.get("email", None)

    if not email:
        abort(404)

    basic_url = "http://pool.sks-keyservers.net"

    url = basic_url + "/pks/lookup?exact=on&search=%s" % email

    response = urllib.urlopen(url)

    if response.code != 200:
        return jsonify(status='error', message='No public key found for %s' % email)

    key_path = BeautifulSoup(response).find('a').get('href')

    key_url = basic_url + key_path
    response = urllib.urlopen(key_url)
    key = BeautifulSoup(response).find('pre').text

    return jsonify(status='ok', public_key=key)
    


@app.route("/fb")
def fb():
    return render_template('fb.html')


@app.route("/get")
def messages():
    return jsonify(messages=[
        dict( 
            sender = "encrypted@guy.com",
            message = '''
                -----BEGIN PGP MESSAGE-----
                Charset: ISO-8859-1
                Version: GnuPG v1.4.11 (Darwin)
                Comment: Using GnuPG with Mozilla - http://enigmail.mozdev.org/

                hQIOA5/bzpXA0akHEAf9HfiQifn1K+rUbNQxQ2gprPYXQ4yIAy448rKEO/a5gx9i
                uIw+JYW4j998bKX17MqhBVdQaRbTEN7H0QPy3mJDjG26ATCpRwnt8hzWF0sDYZuj
                cvhSZemQb8JWY4WDVsWb0Fos6npBoefyhtqyxLqlIlTjgS0ofYbHG0OAiD6q7rMe
                kzXIXoEgT+nqRP88d/zr6tsxR3eXAyeKp4zKBIRyWZsR9LrWE+CQfE8YuRNsau2Q
                XojZGQyAysolkzlrNAtsQa68HjKVa0ykana5VZODKzAx8OVmBRpn7BS8jHLG18wY
                myoHPjfnvd6QR3qRUn6sb808CD9aUajdFH0i1+01sQf+IFsdBWjycjkQs6UEDO0w
                PvnzwEf71XmW5PToaoN+/K6QAwl0ZP02AUfV33D4NAVzJEbrP25NWey9Szk6Oore
                MdhsHGwQa2qHPfa5fk4A+uyvYuIsoDO/4bvgkFCDA8XG+F9lhCdqlOxoTIhopUOv
                oL/6Ouukb2AtCOgFP/FdB1KMNrj1Gtrr6W849erdqRBkXy433vPA9SF5MHSxG6eY
                59iXnglJL4lHf/XTfwFIP2HkGsecxYSpLeMki6HtVO316RbxTjgT92Sf8tIuVcY2
                PCSes9mqP+f3VaXJFAhKkzqgFj5Vm+3cIfpReN3BJ60M0y/X7zst5hyYtD+RH7Nb
                a4UBDAOD44Gm+AZTbwEIAKtKFWbRTLeNCrybRchyIyM2Lc4L71bODtDLmqNbrXpE
                05lRLNyC9eX8145B28ibKUc2fXPXp71vYxCfTOGABGQ7Dj8PEx7c4D3DUEKAq0L2
                ixrJn7SlkpxqbetOYT6xWzm3JzUL/pOOUUmmW23jisXxq7w55ryIcfr1IlMp++gc
                FsizJh/K5LdwhGoz8iJ5KKOoQpznUwinh+uadrKARnCnW1lu9FjivdVlE45T68rL
                v6qhthpdBdAbHw3OtQ9OipTPPNtOHGXVH2LDXYl3lMInsNaQ+KmYHRe3xR8IRW9u
                xgJF5D2LMqhZx9jmVoLvvauFOvdEwJ6j7xp8njQbvojSaQG2RTgSImMLpBLOyOab
                dGp6ucHbqC1auTDcEQKZWq7NunI7qyCpxlNGTsi7Cp1I7eS6149tQp3T2hpeWI+a
                ybLxCx8bnFUZRnjXUsR+/9tOTc+gSS/wvgttWBYR3YznrKM6XnLEuykgmw==
                =22BO
                -----END PGP MESSAGE-----
                '''
        ),
        dict( 
            sender = "some@guy.com",
            message = "Dear Sergey Polzunov,<p>Oh no! The following product(s) in your _Traut_ account are going to expire in September. In order to avoid seeing these products go the way of the dodo bird, renew now below.</p>"
        ),
        dict(
            sender = "another@guy.com",
            message = "<b>Dear SERGEY POLZUNOV</b>,<p>Thank you for your application form for the Vipassana Meditation Course to be held at Dilsen Stokkem, Belgium from 24-Oct-2012 to 4-Nov-2012. The course will be conducted by assistant teachers to S.N. Goenka. A place has been reserved for you on the course.</p><p>In order to secure your place on the course you need to RECONFIRM your attendance three weeks before the course start date. You will be sent an email request for reconfirmation at this time.</p>"
        )])

