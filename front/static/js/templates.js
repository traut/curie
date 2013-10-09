(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['messageGroup'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "hide";
  }

  buffer += "<div id=\"message-group-";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"span5 packGroup asTile\" onClick=\"javascript:window.curie.router.navigate('";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "', {trigger : true})\">\n        <div class=\"span3\"><img src=\"https://secure.gravatar.com/avatar/";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "?s=80&d=mm\" width=\"80\" height=\"80\" /></div>\n        <div class=\"span9\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n        <div class=\"pull-right muted sumCount\"><span class=\"unread ";
  stack1 = helpers.unless.call(depth0, depth0.unread, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">";
  if (stack1 = helpers.unread) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.unread; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span> <span class=\"";
  stack1 = helpers.unless.call(depth0, depth0.unread, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">/</span> ";
  if (stack1 = helpers.size) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.size; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n</div>\n\n";
  return buffer;
  });
templates['groupView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "hide";
  }

  buffer += "<div class=\"groupView\">\n    <ul class=\"breadcrumb\">\n        <li><a href=\"#\">Home</a> <span class=\"divider\">/</span></li>\n        <li><a href=\"#";
  if (stack1 = helpers.packUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.packUrl; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.pack) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pack; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a> <span class=\"divider\">/</span></li>\n        <li class=\"active\">";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</li>\n        <li class=\"active pull-right counters\"><span class=\"unread ";
  stack1 = helpers.unless.call(depth0, depth0.unread, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">";
  if (stack1 = helpers.unread) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.unread; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span> <span class=\"";
  stack1 = helpers.unless.call(depth0, depth0.unread, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">/</span> ";
  if (stack1 = helpers.size) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.size; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</li>\n    </ul>\n    <div id=\"messages-list\" class=\"messageList\">\n</div>\n\n";
  return buffer;
  });
templates['messageList'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        ";
  if (stack1 = helpers.html) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.html; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;
  }

  buffer += "<div id=\"messages-list\" class=\"messageList\">\n    ";
  stack1 = helpers.each.call(depth0, depth0.rows, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n\n";
  return buffer;
  });
templates['loginModal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"modal-body\">\n    <div class=\"header text-center\">\n        <img src=\"/static/img/curie.gif\" class=\"logo\"/><h1>Curie</h1>\n    </div>\n    <br/>\n\n    <div class=\"alert alert-error hide\" id=\"errorNote\"></div>\n    <form class=\"form-horizontal\" id=\"loginForm\">\n        <div class=\"control-group\">\n            <div class=\"controls\">\n                <input type=\"text\" id=\"inputLogin\" placeholder=\"Login\" name=\"login\" tabindex=\"2\">\n            </div>\n        </div>\n        <div class=\"control-group\">\n            <div class=\"controls\">\n                <input type=\"password\" id=\"inputPassword\" placeholder=\"Password\" name=\"password\" tabindex=\"3\">\n            </div>\n        </div>\n        <div class=\"control-group\">\n            <div class=\"controls\">\n                <button type=\"submit\" class=\"btn\" tabindex=\"4\" onFocus=\"this.tabIndex=1;\" onBlur=\"this.tabIndex=4;\">Sign in</button>\n                <img src=\"/static/img/loader2.gif\" id=\"modalLoader\" style=\"margin-right:-16px;\" class=\"hide\"/>\n            </div>\n        </div>\n    </form>\n</div>\n";
  });
templates['thread'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        ";
  stack1 = self.invokePartial(partials.messageView, 'messageView', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;
  }

  buffer += "    <div class=\"threadView\">\n    ";
  stack1 = helpers.each.call(depth0, depth0.messages, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n";
  return buffer;
  });
templates['packList'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n<li ";
  stack1 = helpers['if'].call(depth0, depth0.active, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n    <a href=\"#";
  if (stack1 = helpers.hashUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.hashUrl; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"pack\" name=\"";
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.slugifySelector || depth0.slugifySelector),stack1 ? stack1.call(depth0, depth0.name, options) : helperMissing.call(depth0, "slugifySelector", depth0.name, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">";
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.shortify || depth0.shortify),stack1 ? stack1.call(depth0, depth0.name, 23, options) : helperMissing.call(depth0, "shortify", depth0.name, 23, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    \n    <span class=\"pull-right counters unread ";
  stack2 = helpers.unless.call(depth0, depth0.unread, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">";
  if (stack2 = helpers.unread) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.unread; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span>\n    </a>\n    </li>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "class=\"active\"";
  }

function program4(depth0,data) {
  
  var buffer = "";
  return buffer;
  }

function program6(depth0,data) {
  
  
  return "hide";
  }

  stack1 = helpers.each.call(depth0, depth0.packs, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['draftRow'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "unread";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <a href=\"#";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n        ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <div class=\"span4 emailField\">To: "
    + escapeExpression(((stack1 = ((stack1 = depth0.to),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " <span class=\"muted\">&lt;"
    + escapeExpression(((stack1 = ((stack1 = depth0.to),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "&gt;</span></div>\n        ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <div class=\"span4 emailField\">To: "
    + escapeExpression(((stack1 = ((stack1 = depth0.from),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n        ";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "";
  return buffer;
  }

function program11(depth0,data) {
  
  
  return "\n        </a>\n        ";
  }

  buffer += "    <div id=\"message-row-";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"row messageRow ";
  stack1 = helpers['if'].call(depth0, depth0.unread, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n        ";
  stack1 = helpers['if'].call(depth0, depth0.url, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.from),stack1 == null || stack1 === false ? stack1 : stack1.name), {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n            <div class=\"span5 subjectField\">";
  if (stack2 = helpers.subject) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.subject; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</div>\n            <div class=\"span3 dateField\">";
  options = {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data};
  stack2 = ((stack1 = helpers.dateformat || depth0.dateformat),stack1 ? stack1.call(depth0, depth0.received, "HH:mm, dddd, MMM Do", options) : helperMissing.call(depth0, "dateformat", depth0.received, "HH:mm, dddd, MMM Do", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div>\n        ";
  stack2 = helpers['if'].call(depth0, depth0.url, {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </div>\n\n";
  return buffer;
  });
templates['hotkeysModal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <div class=\"span6 actionTypeBlock\">\n            ";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </div>\n        ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <div class=\"row-fluid\">\n                <div class=\"span2 keyVal\">";
  if (stack1 = helpers.hotkey) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.hotkey; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n                <div class=\"span10 keyDoc\">";
  if (stack1 = helpers.doc) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.doc; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n            </div>\n            ";
  return buffer;
  }

  buffer += "<div class=\"modal-header\">\n    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&#215</button>\n    <h3>Hotkeys</h3>\n</div>\n<div class=\"modal-body hotkeysHelp\">\n    <div class=\"row-fluid\">\n        ";
  stack1 = helpers.each.call(depth0, depth0.actionTypes, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n    \n\n</div>\n";
  return buffer;
  });
templates['threadRow'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "unread";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <a href=\"#";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    ";
  return buffer;
  }

function program5(depth0,data) {
  
  
  return "\n    </a>\n    ";
  }

  buffer += "<div id=\"message-row-";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"row messageRow ";
  stack1 = helpers['if'].call(depth0, depth0.unreadCount, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " threadRow\">\n    ";
  stack1 = helpers['if'].call(depth0, depth0.url, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n    ";
  stack1 = self.invokePartial(partials.messageRow, 'messageRow', depth0.latest, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n\n    ";
  stack1 = helpers['if'].call(depth0, depth0.url, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n";
  return buffer;
  });
templates['messageRow'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "unread";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <a href=\"#";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n        ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <div class=\"span4 emailField\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.from),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " <span class=\"muted\">&lt;"
    + escapeExpression(((stack1 = ((stack1 = depth0.from),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "&gt;</span></div>\n        ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <div class=\"span4 emailField\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.from),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n        ";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "";
  return buffer;
  }

function program11(depth0,data) {
  
  
  return "\n        </a>\n        ";
  }

  buffer += "    <div id=\"message-row-";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"row messageRow ";
  stack1 = helpers['if'].call(depth0, depth0.unread, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n        ";
  stack1 = helpers['if'].call(depth0, depth0.url, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.from),stack1 == null || stack1 === false ? stack1 : stack1.name), {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n            <div class=\"span5 subjectField\">";
  if (stack2 = helpers.subject) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.subject; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</div>\n            <div class=\"span3 dateField\">";
  options = {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data};
  stack2 = ((stack1 = helpers.dateformat || depth0.dateformat),stack1 ? stack1.call(depth0, depth0.received, "HH:mm, dddd, MMM Do", options) : helperMissing.call(depth0, "dateformat", depth0.received, "HH:mm, dddd, MMM Do", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div>\n        ";
  stack2 = helpers['if'].call(depth0, depth0.url, {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </div>\n";
  return buffer;
  });
templates['message'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                <a href=\"#new/"
    + escapeExpression(((stack1 = ((stack1 = depth0._from),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" title=\""
    + escapeExpression(((stack1 = ((stack1 = depth0._from),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " <"
    + escapeExpression(((stack1 = ((stack1 = depth0._from),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ">\" class=\"from\">"
    + escapeExpression(((stack1 = ((stack1 = depth0._from),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\n                ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                "
    + escapeExpression(((stack1 = ((stack1 = depth0._from),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n                ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "";
  buffer += " <span class=\"badge\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</span>";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n            <div class=\"body"
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n            ";
  stack2 = ((stack1 = depth0.value),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n            </div>\n        ";
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <p>\n            <ul class=\"inline\">\n            ";
  stack1 = helpers.each.call(depth0, depth0.attachments, {hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            </ul>\n        </p>\n        ";
  return buffer;
  }
function program12(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                <li><a href=\"/attachment/";
  if (stack1 = helpers.file) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.file; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.filename) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.filename; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></li>\n            ";
  return buffer;
  }

  buffer += "    <div class=\"message\">\n        <p class=\"messageHeader lead\">\n            <span class=\"muted pull-right\">";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.dateformat || depth0.dateformat),stack1 ? stack1.call(depth0, depth0.received, "HH:mm, MMM Do", options) : helperMissing.call(depth0, "dateformat", depth0.received, "HH:mm, MMM Do", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span>\n            ";
  if (stack2 = helpers.subject) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.subject; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\n            <span class=\"muted\">by\n                ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0._from),stack1 == null || stack1 === false ? stack1 : stack1.name), {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n            </span>\n        </p>\n        <div class=\"pull-right\">\n            ";
  stack2 = helpers.each.call(depth0, depth0.labels, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        </div>\n        ";
  stack2 = helpers.each.call(depth0, depth0._body, {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n        ";
  if (stack2 = helpers.attachment) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.attachment; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\n\n        ";
  stack2 = helpers['if'].call(depth0, depth0.attachments, {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </div>\n\n";
  return buffer;
  });
templates['draft'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  if (stack1 = helpers.email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.email; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  return buffer;
  }

function program3(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

function program5(depth0,data) {
  
  var buffer = "";
  return buffer;
  }

function program7(depth0,data) {
  
  
  return "hide";
  }

  buffer += "<div class=\"draftView\" >\n    <div class=\"draftBody\">\n        <form class=\"form-horizontal\">\n            <div class=\"control-group\">\n                <input name=\"to\" type=\"text\" data-provide=\"typeahead\" placeholder=\"To\" value=\"";
  stack1 = helpers.each.call(depth0, depth0.to, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\"/>\n            </div>\n            <div class=\"control-group\">\n                <input name=\"subject\" type=\"text\" data-provide=\"typeahead\" placeholder=\"Subject\" value=\"";
  if (stack1 = helpers.subject) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.subject; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"/>\n            </div>\n            <div class=\"control-group\">\n                <textarea rows=\"6\" name=\"body\">";
  stack1 = helpers.each.call(depth0, depth0.body, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</textarea>\n            </div>\n        </form>\n    </div>\n    <div class=\"draftFooter row-fluid\">\n        <div class=\"span8 modal-footer\">\n            <div class=\"pull-left created\">\n                <span class=\"muted\">Created:</span> ";
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data};
  stack2 = ((stack1 = helpers.dateformat || depth0.dateformat),stack1 ? stack1.call(depth0, depth0.created, "HH:mm, dddd, MMM Do", options) : helperMissing.call(depth0, "dateformat", depth0.created, "HH:mm, dddd, MMM Do", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n            </div>\n            <button type=\"button\" class=\"btn\" aria-hidden=\"true\" name=\"discard\">Discard</button>\n            <button onClick=\"javascript:console.info('Sending the message');alert('Ta-da!');\" class=\"btn btn-primary\">Send</button>\n        </div>\n        <div class=\"span4 ";
  stack2 = helpers.unless.call(depth0, depth0.saved, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += " saved muted\">Saved <span class=\"savedValue\">";
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data};
  stack2 = ((stack1 = helpers.date_ago || depth0.date_ago),stack1 ? stack1.call(depth0, depth0.saved, options) : helperMissing.call(depth0, "date_ago", depth0.saved, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span></div>\n    </div>\n</div>\n";
  return buffer;
  });
templates['messageGroupList'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "hide";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = self.invokePartial(partials.messageRow, 'messageRow', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;
  }

function program5(depth0,data) {
  
  
  return "\n    <p class=\"text-center\">&hellip;</p>\n    ";
  }

  buffer += "<div id=\"message-group-";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"row packGroup asRow\" onClick=\"javascript:window.curie.router.navigate('";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "', {trigger : true})\">\n    <div class=\"pull-right counters muted\"><span class=\"unread ";
  stack1 = helpers.unless.call(depth0, depth0.unread, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">";
  if (stack1 = helpers.unread) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.unread; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span> <span class=\"";
  stack1 = helpers.unless.call(depth0, depth0.unread, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">/</span> ";
  if (stack1 = helpers.size) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.size; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n    <span class=\"lead\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n    ";
  stack1 = helpers.each.call(depth0, depth0.messages, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n    ";
  stack1 = helpers['if'].call(depth0, depth0.thereIsMore, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n";
  return buffer;
  });
})();
