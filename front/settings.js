var settings = {

    DOMAIN : 'curie.heyheylabs.com',

    STORAGE : {
        MESSAGES : "/home/curie/storage/emails/",
        DRAFTS : "/home/curie/storage/drafts/",
        ATTACHMENTS : "/home/curie/storage/attachments/"
    },


    NUM_ROWS : 30,
    NUM_GROUPS : 30,
    NUM_ROWS_IN_GROUP : 0,

    INFINITY : 100,

    LOG_FILE : '/home/curie/curie/front/curie.log',


    SECRET : 'j30bEHtFectqbprA6HTe1FpVRlSx/6UOg9JHmOrt7Pa2Bf4que6nTpFrM+uYNHw8',

    COOKIE_NAME_SESSION : 'curie.sid',
    COOKIE_EXIPE_IN : 60 * 60 * 1000, // 60min
}

module.exports = settings;
