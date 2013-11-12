$(function() {
    window.curie = {};

    window.curie.state = new Curie.Models.State();
    window.curie.cache = new Curie.Services.Cache();

    _.extend(window.curie, {
        router : new Curie.Router(),
        controllers : {
            layout : new Curie.Controllers.Layout(),
            data : new Curie.Controllers.Data()
        },
    });

    curie.controllers.data.reconnect();


});


