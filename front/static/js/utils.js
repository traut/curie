(function ($) {
    $.fn.shake = function (options) {
        // defaults
        var settings = {
            'shakes': 2,
            'distance': 10,
            'duration': 200
        };
        // merge options
        if (options) {
            $.extend(settings, options);
        }
        // make it so
        var pos;
        return this.each(function () {
            $this = $(this);
            // position if necessary
            pos = $this.css('position');
            if (!pos || pos === 'static') {
                $this.css('position', 'relative');
            }
            // shake it
            for (var x = 1; x <= settings.shakes; x++) {
                var initial = $this.position().left;
                $this.animate({ left: initial + settings.distance * -1 }, (settings.duration / settings.shakes) / 4)
                    .animate({ left: initial + settings.distance }, (settings.duration / settings.shakes) / 2)
                    .animate({ left: initial}, (settings.duration / settings.shakes) / 4);
            }
            $this.css("left", "");
        });
    };

    var cookies;
    function readCookie(name,c,C,i){
        if(cookies){ return cookies[name]; }

        c = document.cookie.split('; ');
        cookies = {};

        for(i=c.length-1; i>=0; i--){
           C = c[i].split('=');
           cookies[C[0]] = C[1];
        }
        return cookies[name];
    }
    window.readCookie = readCookie; // or expose it however you want
}(jQuery));

function setCookie(name, value) {
    document.cookie = "curie." + name + "=" + value;
}

function isElementInDOM(element) {
    return jQuery.contains(document.documentElement, element[0]);
}

Handlebars.registerHelper('dateformat', function(stamp, format) {
    return (stamp) ? moment(stamp).format(format) : "null";
});
Handlebars.registerPartial("messageRow", Handlebars.templates.messageRow);
Handlebars.registerPartial("messageList", Handlebars.templates.messageList);
