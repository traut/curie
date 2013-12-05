Curie.Controllers.Layout.Contacts = function () {

    Mousetrap.bind("s c", function(e, combo) {
        curie.state.trigger("showContacts");
    });

    curie.state.on("showContacts", function() {
        var contacts = new Curie.Models.Contacts();
        contacts.fetch({
            success : function() {
                console.info("Contacts fetched", contacts);

                //$(".sidebarNav").parent().hide();

                //$(".contentView").html("<div class='row-fluid'><div class='span5 contacts'></div><div class='span7 contactMessages'></div>");

                $(".sidebarNav").html(Handlebars.templates.contacts({contacts : contacts.models.map(function(m) { return m.toJSON(); })}));
            }
        });
    }, this);


    curie.state.on("contact", function(value) {
        var history = new Curie.Models.ChatHistory({ query : "+(from.email:" + value + " OR to.email:" + value + ")" });
        history.fetch({
            update: true,
            success : function() {
                console.info(history.messages);

                history.messages.sort();

                var model = new Curie.Models.Thread().withMessages(history.messages.models);
                var view = new ThreadView({ model : model});

                view.render();
                $(".contentView").html("<span class='muted'>and " + (history.get("total") - history.messages.length) + " more");
                $(".contentView").append(view.$el);

                $(".threadView", ".contentView").css("padding-bottom", "100px");

                $(".draftView", ".contentView").addClass("span9");
                $(".draftView", ".contentView").css({
                    position: "fixed",
                    bottom: "0px",
                    "background-color": "white",
                    "border-top": "1px solid #ccc",
                    "padding" : "10px"
                });
                $(".draftBody", ".contentView").css({
                    padding : "0px",
                });
                $("div[name=readonly]", ".contentView").hide();
                $("textarea", ".contentView").attr("rows", "3");

                $('.contentView').scrollBottom(0);

            }
        });
    });

    _.extend(this, {
    });
}
