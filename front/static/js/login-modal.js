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
                createConnection({
                    email : email,
                    password : password
                }, function() {
                    // success
                    modal.hide();
                    $(":input", modalObj).removeAttr("disabled");
                    $(modalLoader, modalObj).hide();
                }, function() {
                    // fail
                    $(":input", modalObj).removeAttr("disabled");
                    $(modalLoader, modalObj).hide();
                    modal.show();
                    modal.shake();
                });
                return false;
            });
            modalObj.modal({show : false});
            return modal;
        },
        show : function () {
            modalObj.modal('show');
            $(emailInputId, formObjId).focus();

        },
        hide : function () {
            modalObj.modal('hide');
        },
        shake : function () {
            modalObj.shake();
            $(emailInputId, formObjId).focus();
        }
    }
    return modal;
}
