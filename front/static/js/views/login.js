var LoginModalView = Backbone.View.extend({
    el : "#loginModal",
    template : Handlebars.templates.loginModal,

    events : {
        "submit form" : "submit",
    },

    initialize : function() {
        _.bindAll(this);
        this.$el.html(this.template());
    },

    submit : function(e) {
        e.preventDefault();

        var allInputs = this.$(":input");
        var loader = this.$(".loader");

        allInputs.attr("disabled", true);
        loader.show();

        var login = this.$("input[name=login]").val();
        var password = this.$("input[name=password]").val();

        if (!login || !password) {
            allInputs.removeAttr("disabled");
            loader.hide();
        }

        curie.controllers.data.auth(login, password);
    },
    hide : function () {
        this.$el.modal({show : false});
        return controller;
    },
    show : function () {

        this.$(".loader").hide();
        this.$(":input").removeAttr("disabled");

        this.$("input[name=login]").val('');
        this.$("input[name=password]").val('');

        this.$el.modal('show');

        this.$("input[name=login]").focus();
    },
    hide : function () {
        this.$el.modal('hide');
        this.$(":input").removeAttr("disabled");
        this.$(".loader").hide();
    },
    shake : function () {
        this.show();
        this.$el.shake();
    }
});


