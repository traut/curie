
var localStorage = window.localStorage;

Store = function(modelName) {
    var appPrefix = "curie";
    var store = this;


    // model

    // Generate four random hex digits.
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    
    // Generate a pseudo-GUID by concatenating random hexadecimal.
    function guid() {
       return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };

    function makeKey(model) {
        return appPrefix + ":" + modelName + ":" + model.id;
    }

    function valueWrapper(model) {
        return {
            id : model.id || guid(),
            value : model.toJSON(),
            timestamp : new Date().getTime()
        }
    }

    _.extend(this, {

        save : function(model) {
            if (!model.id) {
                return store.create(model);
            }
            localStorage.get
        },

        create : function(model) {
            localStorage.setItem(makeKey(model), valueWrapper(model));
            return model;
        },

        update : function(model) {
        }
    });

    
    return this;
}
