var settings = {

    DOMAIN : 'curie.heyheylabs.com',

    MAIL_ACCESS_MAP : {
        "t@curie.heyheylabs.com" : ["t@curie.heyheylabs.com", "dev@arrr.tv", "webmaster@arrr.tv"],
        "some@curie.heyheylabs.com" : ["some@curie.heyheylabs.com"]
    },

    STORAGE_PATH : "/home/curie/storage/",
    DRAFTS_PATH : "/home/curie/drafts/",

    NUM_ROWS : 30,
    NUM_GROUPS : 10,
    NUM_ROWS_IN_GROUP : 5,

    LOG_FILE : '/home/curie/curie/front/curie.log',


    SECRET : 'j30bEHtFectqbprA6HTe1FpVRlSx/6UOg9JHmOrt7Pa2Bf4que6nTpFrM+uYNHw8',

    COOKIE_NAME_SESSION : 'curie.sid',
    COOKIE_EXIPE_IN : 15 * 60 * 1000, // 15 min

    // FIXME: soon to be removed
    ACCOUNTS : {
        "t@curie.heyheylabs.com": "p",
        "some@curie.heyheylabs.com": "p",
    }
}

module.exports = settings;
