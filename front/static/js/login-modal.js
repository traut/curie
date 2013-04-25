LoginModal = function() {

    var modalObj = $("#loginModal");

    var formObjId = "#loginForm";
    var emailInputId = "#inputEmail";
    var passwordInputId = "#inputPassword";

    var modal = {
        create : function () {
            modalObj.html(Handlebars.templates.loginModal());
            $(formObjId).submit(function(e) {
                e.preventDefault();
                var email = $(emailInputId, formObjId).val();
                var password = $(passwordInputId, formObjId).val();
                if (!email || !password) {
                    return false;
                }
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
