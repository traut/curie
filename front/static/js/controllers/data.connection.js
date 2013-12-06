Curie.Controllers.Data.Connection = function () {

    var RECONNECT_DELAY = 100;
    var RECONNECT_GIVE_UP_RETRIES = 10;

    var SYNC_ALLOWED = true;

    var self = this;


    //FIXME: implement periodic fetch

    var COOKIE = "curie.channel";

    var auth = function(login, password) {
        $.post("/auth", {
            login : login,
            password : password
        }, function(response) {
            if (response.status == 'error') {
                console.error("Can't authenthicate: " + response.message);
                curie.state.trigger("login:fail");
                return;
            }
            createDataConnection();
        });
    }


    var createDataConnection = function() {

        var channel = window.readCookie(COOKIE);
        if (!channel) {
            console.error("No channel specified");
            return;
        }

        console.info("Creating data connection to channel=" + channel);

        var socket = self.socket = io.connect('/stream/' + channel, {
            secure: true,
            port: 443,
            'force new connection': true,
            'reconnect': true,
            'reconnection delay': RECONNECT_DELAY,
            'max reconnection attempts': RECONNECT_GIVE_UP_RETRIES
        });


        socket.on('error', function(reason) {
            curie.state.trigger("connection:error", "Connection error", reason);
            curie.state.trigger("logout");
        });

        socket.on('connect', function() {
            console.info("Connection to " + channel + " created");
            curie.state.trigger("login:success");
            curie.state.trigger("connection:initial");
        });

        socket.on('reconnect', function() {
            curie.state.trigger("connection:established");

            console.info("Reconnected to " + channel);
        });

        socket.on('reconnecting', function(delay, attempt) {
            console.info("Reconnecting for " + attempt + " time, with delay " + delay);
            if (attempt == RECONNECT_GIVE_UP_RETRIES) {
                curie.state.trigger("logout");
            }
        });

        socket.on("no-session", function(reason) {
            curie.state.trigger("logout");
        });

        socket.on("disconnect", function(reason) {
            curie.state.trigger("connection:error", "Disconnect", reason);
        });
    }

    var reconnect = function() {
        var channel = window.readCookie(COOKIE);
        if (channel) {
            console.info("Stream exists! " + channel);
            createDataConnection();
        } else {
            curie.state.trigger("login:show");
        }
    }

    curie.state.on("login:success", function() {
        curie.state.account.fetch();
        SYNC_ALLOWED && curie.controllers.data.startSync();
    });


    curie.state.on("logout", function() {
        delCookie(COOKIE);
        window.location = "/logout";
    });

    _.extend(this, {
        auth : auth,
        reconnect : reconnect,
        getSocket : function() { return self.socket; }
    });
}

