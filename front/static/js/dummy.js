A = Backbone.View.extend({
    initialize : function() {
        this.prop = "it's A";
    },
    sayHello : function() {
        console.info("(A.sayHello)prop=" + this.prop);
    },
    say : function() {
        console.info("saying");
        this.sayHello();
    }
});

B = A.extend({
    initialize : function() {
        A.prototype.initialize.apply(this, arguments);
        this.prop = "it's B";
    },
    sayHello : function() {
        console.info("(B.sayHello)prop=" + this.prop);
    }
});

C = B.extend({
    initialize : function() {
        //this.constructor.__super__.initialize.apply(this, arguments);
        B.prototype.initialize.apply(this, arguments);
        this.prop = "it's C";
    }
});
