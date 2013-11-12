
Curie.Services.Cache = function() {

    var store = {};

    var getClassName = function(modelClass) {
        return new modelClass().constructor.typeName;
    }

    return {
        get: function(key){
            store || this.reset();
            return store[key];
        },

        set: function(key, object){
            store || this.reset();
            store[key] = object;
            return object
        },

        reset: function(){
            store = {};
        },

        peek : function() {
            return store;
        },

        getByProperty : function(modelClass, prop, value) {
            var type = getClassName(modelClass);
            var keys = _.keys(store)
                .filter(function(k) {
                    return k.indexOf(type) > -1;
                })
                .filter(function(k) {
                    return store[k].get(prop) == value;
                });
            if (keys.length == 0) {
                return null;
            }
            return store[keys[0]];
        },

        add : function(modelClass, attrs) {

            var typeName = getClassName(modelClass);

            if (!typeName) {
                console.error("Can't find class type name", modelClass, attrs);
                return;
            }

            var key = typeName + ":" + attrs.id;

            var found = this.get(key);
            if (found) {
                // updating model
                found.set(attrs);
            } else {
                found = this.set(key, new modelClass(attrs));
            }
            return found;
        }
    }
}

