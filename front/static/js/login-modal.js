
function auth(email, password) {
    $.post("/auth", {
        login : email,
        password : password
    }, function(response) {
        console.info(response);
        if (response.status == 'error') {
            console.error("Can't authenthicate: " + response.message);
            stateModel.trigger("login-fail");
            return;
        }
        createDataConnection();
    });
}

LoginModal = function() {

    var modalObj = $("#loginModal");

    var formObjId = "#loginForm";
    var emailInputId = "#inputEmail";
    var passwordInputId = "#inputPassword";

    var modalLoader = "#modalLoader";


    var controller = {};

    stateModel.on("login-fail", function() {
        controller.shake();
    });

    stateModel.on("login-success", function() {
        console.info("LOGIN SUCCESS");
        $(".mainBlock", ".app").show();
        controller.hide();
    });

    stateModel.on("login-show-popup", function() {
        controller.show();
    });


    $.extend(controller, {
        create : function () {
            modalObj.html(Handlebars.templates.loginModal());

            $(formObjId).submit(function(e) {
                e.preventDefault();

                $(":input", modalObj).attr("disabled", true);
                $(modalLoader, modalObj).show();

                var email = $(emailInputId, formObjId).val();
                var password = $(passwordInputId, formObjId).val();

                if (!email || !password) {
                    $(":input", modalObj).removeAttr("disabled");
                    $(modalLoader, modalObj).hide();
                    return false;
                }

                auth(email, password);

                return false;
            });
            modalObj.modal({show : false});
            return controller;
        },
        show : function () {

            $(modalLoader, modalObj).hide();
            $(":input", modalObj).removeAttr("disabled");
            $(emailInputId, formObjId).val('');
            $(passwordInputId, formObjId).val('');

            modalObj.modal('show');
            $(emailInputId, formObjId).focus();
        },
        hide : function () {
            modalObj.modal('hide');
            $(":input", modalObj).removeAttr("disabled");
            $(modalLoader, modalObj).hide();
        },
        shake : function () {
            controller.show();
            modalObj.shake();
        }
    });
    return controller;
}
