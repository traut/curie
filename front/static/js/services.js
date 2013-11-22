
Curie.Services.Cache = function() {

    var store = {};
    var _this = this;

    var getClassName = function(modelClass) {
        return new modelClass().constructor.typeName;
    };

    var get = function(key){
        store || reset();
        return store[key];
    };

    var set = function(key, object){
        store || reset();
        store[key] = object;
        object.on("destroy", deleteInstance, _this);
        return object;
    };

    var deleteInstance = function(instance) {
        var typeName = instance.constructor.typeName;
        var key = makeKey(typeName, instance.id);

        console.info("Deleting instance " + typeName + " id=" + instance.id);

        if (!(key in store)) {
            console.info("Deleting unsuccessful. key=" + key);
            return false;
        }
        store[key].off(null, null, _this);
        delete store[key];
        console.info("Deleting successful");
        return true;
    }

    var reset = function(){
        store = {};
    };

    var makeKey = function(typeName, id) {
        if (!id) {
            throw Error("Can't make a key with empty id. typeName=" + typeName);
        }
        return typeName + ":" + id;
    };

    var makeKeyForClass = function(modelClass, id) {
        return makeKey(getClassName(modelClass), id);
    };

    var filterByType = function(modelClass) {
        var type = getClassName(modelClass);
        return _.filter(store, function(value, key) {
            return key.indexOf(type + ":") > -1;
        });
    };

    var filterWhere = function(modelClass, prop, value) {
        return filterByType(modelClass).filter(function(instance) {
            return instance.get(prop) == value;
        });
    };


    return {

        getInstance : function(modelClass, objId) {
            return get(makeKeyForClass(modelClass, objId));
        },

        filterByType : filterByType,

        filterWhere : filterWhere,

        findWhere : function(modelClass, prop, value) {
            return filterWhere(modelClass, prop, value)[0] || null;
        },

        addInstance : function(m, withId) {
            var typeName = m.constructor.typeName;
            var id = withId || m.id;
            var key = makeKey(typeName, id);
            if (key in store) {
                return;
            }
            set(key, m);
            return m;
        },

        deleteInstance : deleteInstance,

        add : function(modelClass, attrs) {

            var typeName = getClassName(modelClass);

            if (!typeName) {
                console.error("Can't find class type name", modelClass, attrs);
                return;
            }

            var key = makeKey(typeName, attrs.id);

            var found = get(key);
            if (found) {
                // updating model
                found.set(attrs);
            } else {
                console.info("cache.add new key=" + key);
                found = set(key, new modelClass(attrs));
            }
            return found;
        },

        _peek : function() {
            return store;
        },
    }
}

