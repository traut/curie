var DraftView = Backbone.View.extend({
    template : Handlebars.templates.draft,
    el : '#packView #view', //$('<div id="message-' + this.model.id + '" class="row messageView"></div>');
    events : {
        "input form input,textarea" : "fieldChanged",
        "click button.close" : "closeAndNavigate",
        "click button[name=send]" : "sendMessage",
        "click button[name=cancel]" : "closeAndNavigate",
        "click button[name=discard]" : "deleteDraft",
    },
    initialize : function() {

        stateModel.on("escPressed", this.closeAndNavigate, this);
        stateModel.on("navigateToActivePack", this.cleanUp, this);

        this.model.on("change:received", this.updateSaved, this);
        this.model.on("changed", this.saveDraft, this);

        this.changedTimeout = null;
        this.changedTimerDelay = 200;

    },
    render : function() {

        var html = this.template(this.model.toJSON());
        $(".content", this.$el).html($(html));

        var topOffset = window.pageYOffset || 15;
        this.$el.css("top", topOffset + 40);

        //$("#packView").append(this.$el);
        $("input[name=to]", this.$el).focus();

        return this;
    },
    saveDraft : function() {
        this.model.save(null, {
            success : function() {
                stateModel.trigger("fetch:pack:draft");
            }
        });
    },
    fieldChanged : function(e) {
        var data = {};
        var field = e.currentTarget;

        var value = $(field).val();

        if (field.name == "to") {
            var text = field.value;
            if (isEmail(text)) {
                data["to"] =  [{email : value}];
            } else {
                return;
            }
        } else if (field.name == "subject") {
            data["subject"] = value;
        } else if (field.name == "body") {
            data["body"] = [
                { type : "text", value : value}
            ]
        }

        this.model.set(data);

        var model = this.model;

        clearTimeout(this.changedTimer);
        this.changedTimer = setTimeout(function() {
            model.trigger("changed");
        }, this.changedTimerDelay);
    },
    updateSaved : function(m, value) {
        var savedBox = $(".savedValue", this.$el);
        //savedBox.text(Handlebars.helpers.date_ago(value));
        savedBox.text(Handlebars.helpers.dateformat(value, 'HH:mm:SS, dddd, MMM Do'));
    },
    sendMessage : function() {
        this.model.set({ sent : true });
        this.saveDraft();
        this.closeAndNavigate();
    },
    deleteDraft : function() {
        if (confirm('Are you sure?')) {
            this.model.destroy({
                success : function() {
                    stateModel.trigger("fetch:pack:draft");
                }
            });
            this.closeAndNavigate();
        }
    },
    updateMessage : function() {
        stateModel.trigger("fetch:message:" + this.model.get("id"));
    },
    closeAndNavigate : function() {
        stateModel.trigger("navigateToActivePack");
    },
    cleanUp : function() {
        console.info("cleaning up " + this.model.get("id"));

        this.close();
        this.undelegateEvents();

        stateModel.off("escPressed", this.closeAndNavigate);
        stateModel.off("navigateToActivePack", this.cleanUp);
    }
});


