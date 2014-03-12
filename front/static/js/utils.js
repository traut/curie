
function dummy() {};

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

    function readCookie(name,c,C,i){
        c = document.cookie.split('; ');

        var cookies = {};
        for(i=c.length-1; i>=0; i--){
           C = c[i].split('=');
           cookies[C[0]] = C[1];
        }
        return cookies[name];
    }
    window.readCookie = readCookie; // or expose it however you want
}(jQuery));

function VolatileModel(properties) {
    var core = properties;
    _.extend(core, Backbone.Events);

    this.on = this.bind = core.on;
    this.trigger = core.trigger;

    this.set = function(key, value) {
        core[key] = value;
        core.trigger("change:" + key, value);
    }
}

var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

var tagOrComment = new RegExp(
    '<(?:'
    // Comment body.
    + '!--(?:(?:-*[^->])*--+|-?)'
    // Special "raw text" elements whose content should be elided.
    + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
    + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
    // Regular name
    + '|/?[a-z]'
    + tagBody
    + ')>',
    'gi');
function removeTags(html) {
  var oldHtml;
  do {
    oldHtml = html;
    html = html.replace(tagOrComment, '');
  } while (html !== oldHtml);
  return html.replace(/</g, '&lt;');
}

var QUOTE_LABEL = "&hellip;";

var QUOTE_BLOCK = function() {
    var random = Math.floor(Math.random() * 100000);
    return "<p><a onClick='javascript:$(\"#quote" + random + "\").toggle()' class='showQuote'>" + QUOTE_LABEL + "</a><br/><span id='quote" + random + "' class='hide'>$1</span></p>"
}

function prepareBodyBlocks(message, preferText) {

    var preferText = preferText && (message.body.length > 1);

    message._body = _.map(message.body, function(b) {

        var value = null;
        if (b.type == 'text') {
            value = removeTags(b.value)
                .replace(/(^\s*\>+\s*\>*[\s\S]*$)(?=(^[^\>]+$))/mgi, QUOTE_BLOCK());
            if (value.indexOf(QUOTE_LABEL) == -1) {
                value = value
                    .replace(/(^\s*\>+\s*\>*[\s\S]*$)/mgi, QUOTE_BLOCK())
            }
            value = value
                //.replace(/((\r\n|\n)\s*){3,}/mg, "<br/>")
                //.replace(/(\r\n|\n)\s*/g, "<br/>");
                .replace(/(\r\n|\n)/g, "<br/>");
        } else if (!preferText) {
            value = b.value;
        } else {
            value = b.value;
        }
        return {
            type : b.type,
            value : value,
            hidden : (preferText && b.type != 'text'),
            isHtml : (b.type == 'html')
        }
    });

    message._multipleTypes = message._body.length > 1;

    message._from = message.from[0];
    return message;
}

function setCookie(name, value) {
    document.cookie = name + "=" + value;
}
function delCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function isElementInDOM(element) {
    return jQuery.contains(document.documentElement, element[0]);
}

function isElementInParent(elementParent, element) {
    return jQuery.contains(elementParent[0], element[0]);
}

function updateElementClass(el, value, cls) {
    if (value == true) {
        if (el && !el.hasClass(cls)) {
            el.addClass(cls);
        }
    } else if (value == false) {
        el.removeClass(cls);
    }
}

function getUrl(object) {
    if (!(object && object.url)) return null;
    return _.isFunction(object.url) ? object.url() : object.url;
};

function escapeSelector(str) {
    if (str) {
        return str.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|\/@])/g,'\\$1');
    } else {
        return str;
    }
}

function utf8_to_b64(str) {
    return encodeURIComponent(window.btoa(unescape(encodeURIComponent(str))));
}
 
function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(decodeURIComponent(str))));
}

function getNextIndex(currentIndex, actionType, itemsLength) {
    var nextIndex = null;

    switch (actionType) {
        case "up": 
            nextIndex = currentIndex - 1;
            //nextIndex = (nextIndex < 0) ? (itemsLength - 1) : nextIndex;
            nextIndex = (nextIndex < 0) ? 0 : nextIndex;
            break;
        case "down":
            nextIndex = currentIndex + 1;
            //nextIndex = (nextIndex >= itemsLength) ? 0 : nextIndex;
            nextIndex = (nextIndex >= itemsLength) ? itemsLength - 1 : nextIndex;
            break;
        case "first":
            nextIndex = 0;
            break;
        case "last":
            nextIndex = itemsLength - 1;
            break;
        default:
            nextIndex = 0;
    }
    return nextIndex;
}

function loadAndShowHTML(frame, pre) {
    frame = frame[0];
    frame.contentWindow.document.write(pre.text());
    var newHeight = frame.contentWindow.document.body.scrollHeight;
    frame.height = newHeight + "px";
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function elementInViewport(el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while(el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
    }

    return (
        top >= window.pageYOffset &&
        left >= window.pageXOffset &&
        (top + height) <= (window.pageYOffset + window.innerHeight) &&
        (left + width) <= (window.pageXOffset + window.innerWidth)
    );
}

function scrollToElement(el, delay) {
    delay = delay || 300;
    if (!elementInViewport(el[0])) {
        $('html, body').animate({scrollTop : el.offset().top - 200}, delay);
    }
}

var stringToColour = function(_str) {
    var str = new jsSHA(_str + _str + _str, "TEXT").getHash("SHA-512", "HEX");
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}

Backbone.View.prototype.close = function (a, b) {
    if (this.beforeClose) {
        this.beforeClose();
    }
    //this.remove();
    this.$el && this.$el.hide();//this.$el.empty();
    this.unbind();
};

function readablizeBytes(bytes) {
    var s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
    var e = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, e)).toFixed(2) + " " + s[e];
}





var BACKGROUNDS = [
    "http://interfacelift.com/wallpaper/7yz4ma1/03464_mountainsofredbutteswilderness_2880x1800.jpg",
    "http://interfacelift.com/wallpaper/7yz4ma1/03460_capearagocravasse2_2880x1800.jpg",
    "http://interfacelift.com/wallpaper/7yz4ma1/03458_sepanggoldcoast_2880x1800.jpg",
    "http://interfacelift.com/wallpaper/7yz4ma1/03456_washingtonplains_2880x1800.jpg",
    "http://interfacelift.com/wallpaper/7yz4ma1/03437_jeffersoninthemorning_2880x1800.jpg",
    "http://interfacelift.com/wallpaper/7yz4ma1/03412_nightskyofsicily_2880x1800.jpg",
    "http://interfacelift.com/wallpaper/7yz4ma1/03395_gothamcity_2880x1800.jpg"
];

var CURRENT_BACKGROUND_I = -1;


