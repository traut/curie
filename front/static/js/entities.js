CacheStore = {
    get: function(key){
        this._store || this.reset();
        return this._store[key];
    },

    set: function(key, object){
        this._store || this.reset();
        this._store[key] = object;
        return object
    },

    reset: function(){
        this._store = {};
    }
}


initEntity = function(name, modelClass, attrs) {
    var key = name + ":" + attrs.id;
    var found = CacheStore.get(key);
    if (found) {
        found.set(attrs);
    } else {
        found = CacheStore.set(key, new modelClass(attrs));
    }
    return found;
}
