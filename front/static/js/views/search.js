
var some = [];

var GroupView = Backbone.View.extend({
    el : "#packView",

    template : Handlebars.templates.groupView,

    initialize : function() {

        this.model.messages.on("add", this.addMessage, this);
        this.model.messages.on("remove", this.removeMessage, this);

        this.messageRowViews = {};
        this.messageViews = {};

        this.$mainBlock = $(this.template({
            packUrl : window.curie.router.reverse("showPack", { pack : this.model.get("pack") }),
            pack : this.model.get("pack"),
            value : this.model.get("searchValue"),
            unread : this.model.get("unread"),
            size : this.model.get("size")
        }));

        this.$messageList = $(".messageList", this.$mainBlock);

        //this.model.messages.on("change:unread", this.showLoader, this);
        //this.model.messages.on("fetch:end", this.hideLoader, this);
        
    },
    prepareNewModel : function(model, collection) {
        collection = collection || this.model.messages;

        var modelsWithoutViews = _.filter(collection.models, function(model) {
            return !this.messageRowViews[model.id];
        }, this);
        _.each(modelsWithoutViews, function(model) {
            this.messageRowViews[model.id] = new MessageRowView({
                model : model,
                pack : this.model.get("name")
            });
            console.info("View added for " + model.id);
        }, this);
        return this.messageRowViews[model.id];
    },
    addMessage : function(model, collection) {
        console.info("Adding message", model);
        this.prepareNewModel(model);
        this.render();
    },
    removeMessage : function(model, collection, options) {
        console.info("deleting message " + model.id);
        var deletedView = this.messageRowViews[model.id];
        deletedView.$el.remove();
        delete deletedView;
    },
    render : function() {
        console.info("rendering GroupView pack=" + this.model.get('pack') + ", searchValue=" + this.model.get('searchValue'));

        if (!isElementInDOM(this.$mainBlock)) {

            // rerender to show previously unknown "unread" and "size"
            this.$mainBlock = $(this.template({
                packUrl : window.curie.router.reverse("showPack", { pack : this.model.get("pack") }),
                pack : this.model.get("pack"),
                value : this.model.get("searchValue"),
                unread : this.model.get("unread"),
                size : this.model.get("size")
            }));

            this.$messageList = $(".messageList", this.$mainBlock);
            this.$el.html(this.$mainBlock);
        }

        // hiding all the message views
        _.each(_.values(this.messageViews), function(mv) {
            mv.hide();
        });

        // rendering message row view where it belongs
        
        _.each(this.model.messages.models, function(model, index) {
            var view = this.messageRowViews[model.id];
            if (!view) {
                view = this.prepareNewModel(model);
            }
            if (!isElementInDOM(view.$el)) {
                console.info("showing " + model.id);
                var existingDOMel = $(".messageRow:nth-child(" + (index + 1) + ")", this.$messageList);
                if (existingDOMel.length == 0) {
                    this.$messageList.append(view.render().$el);
                } else {
                    existingDOMel.before(view.render().$el);
                }
            }
        }, this);
        return this;
    },
    showMessage : function(message) {
        console.info("GroupView: showing message " + message);
        this.messageViews[message] = this.messageViews[message] || new MessageView({
            model : new MessageFull({
                id: message
            })
        });
        console.info(this.messageViews);
        _.each(this.messageViews, function(mv, messageId) {
            if (messageId == message) {
                console.info("View for " + messageId + " found. show()");
                mv.show();
            } else {
                mv.hide();
            }
        }, this);
    },
});


