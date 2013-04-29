(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['messageGroup'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "hide";
  }

  buffer += "<div id=\"message-group-";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"span5 row packGroup\">\n    <a href=\"#";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n        <div class=\"span3\"><img src=\"http://www.gravatar.com/avatar/";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "?s=80&d=mm\" /></div>\n        <div class=\"span9\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n        <div class=\"rightBottom span3\"><span name=\"unread\" class=\"";
  stack1 = helpers.unless.call(depth0, depth0.unread, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " badge badge-inverse\">";
  if (stack1 = helpers.unread) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.unread; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span> <span class=\"badge\">";
  if (stack1 = helpers.size) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.size; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n    </a>\n</div>\n\n";
  return buffer;
  });
templates['messageList'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
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
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div class=\"modal-body\">\n    <div class=\"header text-center\">\n        <img src=\"/static/img/curie.gif\" class=\"logo\"/><h1>Curie</h1>\n    </div>\n    <br/>\n\n    <div class=\"alert alert-error hide\" id=\"errorNote\"></div>\n    <form class=\"form-horizontal\" id=\"loginForm\">\n        <div class=\"control-group\">\n            <div class=\"controls\">\n                <input type=\"email\" id=\"inputEmail\" placeholder=\"Email\" name=\"email\" tabindex=\"2\">\n            </div>\n        </div>\n        <div class=\"control-group\">\n            <div class=\"controls\">\n                <input type=\"password\" id=\"inputPassword\" placeholder=\"Password\" name=\"password\" tabindex=\"3\">\n            </div>\n        </div>\n        <div class=\"control-group\">\n            <div class=\"controls\">\n                <button type=\"submit\" class=\"btn\" tabindex=\"4\" onFocus=\"this.tabIndex=1;\" onBlur=\"this.tabIndex=4;\">Sign in</button>\n                <img src=\"/static/img/loader2.gif\" id=\"modalLoader\" style=\"margin-right:-16px;\" class=\"hide\"/>\n            </div>\n        </div>\n    </form>\n</div>\n";
  });
templates['packList'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<li ";
  stack1 = helpers['if'].call(depth0, depth0.active, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "><a href=\"#";
  if (stack1 = helpers.hashUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.hashUrl; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"pack\" name=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " <span class=\"badge badge-inverse\"></span><span class=\"loader\"></span></a></li>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "class=\"active\"";
  }

  stack1 = helpers.each.call(depth0, depth0.packs, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['hotkeysModal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
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
templates['messageRow'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "unread";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <div class=\"span4 emailField\">";
  if (stack1 = helpers.from_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.from_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " <span class=\"muted\">&lt;";
  if (stack1 = helpers.from_email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.from_email; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "&gt;</span></div>\n        ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <div class=\"span4 emailField\">";
  if (stack1 = helpers.from_email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.from_email; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n        ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "";
  return buffer;
  }

  buffer += "    <div id=\"message-row-";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"row messageRow ";
  stack1 = helpers['if'].call(depth0, depth0.unread, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n        <a href=\"#";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n        ";
  stack1 = helpers['if'].call(depth0, depth0.from_name, {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            <div class=\"span5 subjectField\">";
  if (stack1 = helpers.subject) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.subject; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n            <div class=\"span3 dateField\">";
  options = {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data};
  stack2 = ((stack1 = helpers.dateformat),stack1 ? stack1.call(depth0, depth0.received, "HH:mm, dddd, MMM Do", options) : helperMissing.call(depth0, "dateformat", depth0.received, "HH:mm, dddd, MMM Do", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div>\n        </a>\n    </div>\n";
  return buffer;
  });
templates['message'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += " <span class=\"badge\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</span>";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  if (stack1 = helpers.from_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.from_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " <span class=\"muted\">&lt;";
  if (stack1 = helpers.from_email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.from_email; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "&gt;</span> ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  if (stack1 = helpers.from_email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.from_email; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  if (stack1 = helpers.to_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.to_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " <span class=\"muted\">&lt;";
  if (stack1 = helpers.to_email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.to_email; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "&gt;</span> ";
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  if (stack1 = helpers.to_email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.to_email; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  return buffer;
  }

function program13(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n        <div class=\"body"
    + escapeExpression(((stack1 = data.index),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        ";
  stack2 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        </div>\n    ";
  return buffer;
  }

  buffer += "<div id=\"message-";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"row messageView\">\n    <div class=\"pull-right\">\n        ";
  stack1 = helpers.each.call(depth0, depth0.labels, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n    <p>\n        <strong>Received:</strong> ";
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data};
  stack2 = ((stack1 = helpers.dateformat),stack1 ? stack1.call(depth0, depth0.received, "HH:mm:ss, dddd, MMM Do, YYYY", options) : helperMissing.call(depth0, "dateformat", depth0.received, "HH:mm:ss, dddd, MMM Do, YYYY", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "<br/>\n        <strong>From:</strong> ";
  stack2 = helpers['if'].call(depth0, depth0.from_name, {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "<br/>\n        <strong>To:</strong> ";
  stack2 = helpers['if'].call(depth0, depth0.to_name, {hash:{},inverse:self.program(11, program11, data),fn:self.program(9, program9, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "<br/>\n        <strong>Subject:</strong> ";
  if (stack2 = helpers.subject) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.subject; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "<br/>\n    </p>\n    <div class=\"pull-right\">\n        <button data-message=\"";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" name=\"markUnread\" class=\"btn btn-mini\">Mark unread</button>\n    </div>\n    ";
  stack2 = helpers.each.call(depth0, depth0.body, {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</div>\n";
  return buffer;
  });
templates['messageGroupList'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
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

  buffer += "<div id=\"message-group-";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"row packGroup\">\n    <div class=\"pull-right counters\"><span name=\"unread\" class=\"";
  stack1 = helpers.unless.call(depth0, depth0.unread, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " badge badge-inverse\">";
  if (stack1 = helpers.unread) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.unread; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span> <span class=\"badge\">";
  if (stack1 = helpers.size) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.size; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n    <h4>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h4>\n    ";
  stack1 = helpers.each.call(depth0, depth0.messages, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n";
  return buffer;
  });
})();
