var PopupView = Backbone.View.extend({
    el : '#packView #popupView',
    events : {
        "click button.close" : "closeAndNavigateOut",
    },
    initialize : function(options) {
        stateModel.on("navigateToActivePack", this.hideAndClean, this);
        stateModel.on("escPressed", this.closeAndNavigateOut, this);
    },
    render : function(subview) {

        this.topOffset =  window.pageYOffset || 15;

        this.$el.css("top", this.topOffset);

        subview.render();

        $(".content", this.$el).html(subview.$el.html());

        this.$el.show();
    },
    hideAndClean : function() {
        this.$el.hide();
        $(".content", this.$el).empty();
    },
    closeAndNavigateOut : function() {
        stateModel.trigger("navigateToActivePack");
    }
});
