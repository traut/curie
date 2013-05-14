LoginModal = function() {

    var modalObj = $("#loginModal");

    var formObjId = "#loginForm";
    var emailInputId = "#inputEmail";
    var passwordInputId = "#inputPassword";

    var modalLoader = "#modalLoader";

    var modal = {
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

                stateModel.once("disconnected", function() {
                    modal.shake();
                });

                createConnection({
                    email : email,
                    password : password
                });
                return false;
            });
            modalObj.modal({show : false});
            return modal;
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
            modal.show();
            modalObj.shake();
        }
    }
    return modal;
}
