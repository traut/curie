var DraftView = Backbone.View.extend({
    template : Handlebars.templates.draft,
    events : {
        "input form input,textarea" : "fieldChanged",
        "click button.close" : "closeAndNavigate",
        "click button[name=send]" : "sendMessage",
        "click button[name=cancel]" : "closeAndNavigate",
        "click button[name=discard]" : "deleteDraft",

        "click div[name=readonly]" : "showEditable"
    },
    initialize : function() {

        this.model.on("change:received", this.updateSaved, this);
        this.model.on("changed", this.saveDraft, this);

        this.changedTimeout = null;
        this.changedTimerDelay = 1000;

    },
    render : function() {
        var data = _.extend(this.model.toJSON(), {
            embedded : this.options.embedded || false
        });

        this.$el.html(this.template(data));
        this.$("input[name=to]").focus();

        return this;
    },
    closeAndNavigate : function() {
        if (!this.options.embedded) {
            Mousetrap.trigger("esc");
        }
    },
    closeAndRemove : function() {
        this.close();
        this.$el.remove();
        this.model.off(null, null, this);
    },
    saveDraft : function(sending) {
        //FIXME: race condition
        //http://stackoverflow.com/questions/5886748/backbone-js-problem-when-saving-a-model-before-previous-save-issues-postcreat
        this.model.save(null, {
            success : function(model) {
                //FIXME: update related pack
                if (sending) {
                    console.info("Triggering 'sent' event");
                    model.trigger("sent");
                }
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
        //savedBox.text(Handlebars.helpers.date_ago(value));
        this.$(".saved span[name=value]").text(Handlebars.helpers.dateformat(value, 'HH:mm:SS, dddd, MMM Do'));
        this.$(".saved span").show();

        if (!this.options.embedded) {
            var url = curie.router.reverse("showDraft", {draft : this.model.get("id")});
            curie.router.navigate(url, {trigger: false});
        }
        curie.cache.addInstance(this.model);
    },
    sendMessage : function() {
        this.model.set({ sent : true });
        this.saveDraft(true);
        this.closeAndNavigate();
    },
    deleteDraft : function() {
        if (confirm('Are you sure?')) {
            this.model.destroy({
                success : function() {
                    //FIXME: update related pack
                }
            });
            this.closeAndNavigate();
        }
    },
    updateMessage : function() {
    },
    showEditable : function() {
        this.$("div[name=editable]").show();
        this.$("div[name=editable] :input").first().focus();
        this.$("div[name=readonly]").hide();
    },
    beforeClose : function() {
        console.info("cleaning up " + this.model.get("id"));

        this.undelegateEvents();
        this.model.off(null, null, this);
    }
});


