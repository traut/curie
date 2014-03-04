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
  buffer += "\n</div>\n<button class=\"btn\">Load more</button>\n\n";
  return buffer;
  });
templates['contacts'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div id=\"contact-";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"row packGroup asRow\" onClick=\"javascript:window.curie.state.trigger('contact', '";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "');\">\n        <div class=\"pull-right counters\"><span class=\"unread ";
  stack1 = helpers.unless.call(depth0, depth0.unread, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">";
  if (stack1 = helpers.unread) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.unread; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span> <span class=\"";
  stack1 = helpers.unless.call(depth0, depth0.unread, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\"></span></div>\n        <span class=\"lead\">";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n        ";
  stack1 = helpers.each.call(depth0, depth0.messages, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        ";
  stack1 = helpers['if'].call(depth0, depth0.thereIsMore, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "hide";
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        ";
  stack1 = self.invokePartial(partials.messageRow, 'messageRow', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  return buffer;
  }

function program6(depth0,data) {
  
  
  return "\n        <p class=\"text-center\">&hellip;</p>\n        ";
  }

  buffer += "<div class=\"packGroups\">\n    ";
  stack1 = helpers.each.call(depth0, depth0.contacts, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n";
  return buffer;
  });
templates['pack'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <h1 class=\"lead searchHeader\"><span class=\"muted\">Search:</span> ";
  if (stack1 = helpers.query) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.query; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "<span class=\"pull-right muted\">";
  if (stack1 = helpers.size) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.size; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " found</span></h1>\n    <div class=\"selectionActions\" name=\"selection-actions\">\n        <div class=\"btn-group controls pull-right\">\n            <button class=\"btn btn-small\" name=\"delete-selected\">Delete <span name=\"howManySelected\"></span> selected</button>\n            <button class=\"btn btn-small\" name=\"delete-all\">Delete all found</button>\n        </div>\n    </div>\n    ";
  return buffer;
  }

  buffer += "<div>\n    ";
  stack1 = helpers['if'].call(depth0, depth0.query, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n    <div class=\"content\"></div>\n    <div class=\"loadMore hide\">\n        <button class=\"btn btn-block\" type=\"button\">Load more</button>\n        <span class=\"muted pull-right\">Press \"/\" to search</span>\n    </div>\n</div>\n";
  return buffer;
  });
templates['emailAddress'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span title=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " &lt;";
  if (stack1 = helpers.email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.email; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "&gt;\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span><!--<span class=\"emailWithBraces\">";
  if (stack1 = helpers.email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.email; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>-->";
  return buffer;
  }

function program3(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.email; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

  stack1 = helpers['if'].call(depth0, depth0.name, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['emailAddressWithLink'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " &lt;";
  if (stack1 = helpers.email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.email; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "&gt;";
  return buffer;
  }

function program3(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.email; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

function program5(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

  buffer += "<a href=\"#p/draft/new/to/";
  if (stack1 = helpers.email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.email; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" title=\"";
  stack1 = helpers['if'].call(depth0, depth0.name, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" class=\"email\">";
  stack1 = helpers['if'].call(depth0, depth0.name, {hash:{},inverse:self.program(3, program3, data),fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a>\n";
  return buffer;
  });
templates['loginModal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"modal-body\">\n    <div class=\"header text-center\"><img src=\"/static/img/curie.gif\" class=\"logo\"/><h1>Curie</h1></div>\n    <br/>\n    <div class=\"alert alert-error hide\"></div>\n    <form class=\"form-horizontal\">\n        <div class=\"control-group\">\n            <div class=\"controls\">\n                <input type=\"text\" placeholder=\"Login\" name=\"login\" tabindex=\"2\">\n            </div>\n        </div>\n        <div class=\"control-group\">\n            <div class=\"controls\">\n                <input type=\"password\" placeholder=\"Password\" name=\"password\" tabindex=\"3\">\n            </div>\n        </div>\n        <div class=\"control-group\">\n            <div class=\"controls\">\n                <button type=\"submit\" class=\"btn\" tabindex=\"4\" onFocus=\"this.tabIndex=1;\" onBlur=\"this.tabIndex=4;\">Sign in</button>\n                <img src=\"/static/img/loader2.gif\" id=\"modalLoader\" class=\"hide loader\"/>\n            </div>\n        </div>\n    </form>\n</div>\n";
  });
templates['packList'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n<li ";
  stack1 = helpers['if'].call(depth0, depth0.active, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " data-pack=\"";
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.slugifySelector || depth0.slugifySelector),stack1 ? stack1.call(depth0, depth0.name, options) : helperMissing.call(depth0, "slugifySelector", depth0.name, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">\n    <a href=\"#";
  if (stack2 = helpers.hashUrl) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.hashUrl; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" class=\"pack \" style=\"background-color: transparent; border-right: 3px solid ";
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.colorForLabel || depth0.colorForLabel),stack1 ? stack1.call(depth0, depth0.name, options) : helperMissing.call(depth0, "colorForLabel", depth0.name, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">\n        <span class=\"badge labelBadge\" style=\"background-color: ";
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.colorForLabel || depth0.colorForLabel),stack1 ? stack1.call(depth0, depth0.name, options) : helperMissing.call(depth0, "colorForLabel", depth0.name, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">";
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.shortify || depth0.shortify),stack1 ? stack1.call(depth0, depth0.name, 23, options) : helperMissing.call(depth0, "shortify", depth0.name, 23, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span>\n        <span class=\"pull-right counters unread ";
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
templates['sidebar'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"packBlocks\">\n</div>\n<div class=\"packs\" style=\"padding:10px 0px;\">\n    <label class=\"nav-header\">predefined searches</label>\n    <ul class=\"nav nav-list\">\n        <li><a href=\"#search/K3JlY2VpdmVkOltOT1cvREFZIFRPIE5PVy9EQVkrMURBWV0%3D\">today</a></li>\n        <li><a href=\"#search/K3JlY2VpdmVkOltOT1cvREFZLTFEQVkgVE8gTk9XL0RBWV0%3D\">yesterday</a></li>\n        <li><a href=\"#search/K3VucmVhZDp0cnVl\">all unread</a></li>\n    </ul>\n</div>\n<ul class=\"nav nav-list packs\">\n    <li name=\"new-message\"><a href=\"#\">new message</a></li>\n    <li name=\"search\"><a href=\"#\">search</a></li>\n    <li><a href=\"#filters\">filters</a></li>\n</ul>\n\n<!--\n<div class=\"text-center\">\n    <br/>\n    <div class=\"btn-group\">\n        <button class=\"btn\" name=\"showAs\" data-value=\"LIST\"><i class=\"icon-align-justify\"></i></button>\n        <button class=\"btn\" name=\"showAs\" data-value=\"COMBINED\"><i class=\"icon-th-list\"></i></button>\n        <button class=\"btn\" name=\"showAs\" data-value=\"TILES\"><i class=\"icon-th-large\"></i></button>\n    </div>\n</div>\n-->\n<div class=\"muted text-center alert alert-error hide sidebarInfo\" id=\"errorAlert\"></div>\n<br/>\n<div class=\"muted text-center sidebarInfo\" id=\"accountInfo\"></div>\n<div class=\"muted text-center sidebarInfo\" id=\"lastFetchTime\"></div>\n<div class=\"text-center muted\">Hotkeys help: \"?\"</div>\n";
  });
templates['filters'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<h3 class=\"lead\">Filters</h3>\n    <table class=\"table table-striped\">\n        <tr>\n            <th>Label</th>\n            <th>Query</th>\n            <th>Skip inbox</th>\n            <th>&nbsp;</th>\n        </tr>\n        ";
  stack1 = helpers.each.call(depth0, depth0.filters, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </table>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n            <tr>\n                <td>\n                    <a href=\"#p/";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"><span class=\"badge labelBadge\" style=\"background-color: ";
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data};
  stack2 = ((stack1 = helpers.colorForLabel || depth0.colorForLabel),stack1 ? stack1.call(depth0, depth0.label, options) : helperMissing.call(depth0, "colorForLabel", depth0.label, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">";
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data};
  stack2 = ((stack1 = helpers.shortify || depth0.shortify),stack1 ? stack1.call(depth0, depth0.label, 23, options) : helperMissing.call(depth0, "shortify", depth0.label, 23, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span></a>\n                </td>\n                <td><a href=\"#search/";
  if (stack2 = helpers.encoded_query) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.encoded_query; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">";
  if (stack2 = helpers.query) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.query; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</a></td>\n                <td>";
  stack2 = helpers['if'].call(depth0, depth0.skip_inbox, {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</td>\n                <td class=\"span2\">\n                    ";
  stack2 = helpers['if'].call(depth0, depth0.rerun, {hash:{},inverse:self.program(11, program11, data),fn:self.program(9, program9, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                    <button name=\"delete\" data-filter=\"";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" class=\"btn btn-small\"><i class=\"icon-trash\"></i></button>\n                </td>\n            </tr>\n        ";
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = "";
  return buffer;
  }

function program5(depth0,data) {
  
  
  return "yes";
  }

function program7(depth0,data) {
  
  
  return "no";
  }

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                    <button name=\"rerun\" data-filter=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"btn btn-small\" disabled=\"disabled\">Sent</button>\n                    ";
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                    <button name=\"rerun\" data-filter=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"btn btn-small\">Rerun</button>\n                    ";
  return buffer;
  }

function program13(depth0,data) {
  
  
  return "\n<h3 class=\"muted\">No filters defined</h3>\n";
  }

  stack1 = helpers['if'].call(depth0, depth0.filters, {hash:{},inverse:self.program(13, program13, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<br/>\n<form name=\"newFilter\" class=\"well form-horizontal\">\n        <legend>Add a filter</legend>\n        <div class=\"control-group\">\n            <label class=\"control-label\" for=\"inputLabel\">Label name</label>\n            <div class=\"controls\">\n                <input type=\"text\" id=\"inputLabel\" placeholder=\"label\" name=\"label\">\n            </div>\n        </div>\n        <div class=\"control-group\">\n            <label class=\"control-label\" for=\"inputQuery\">Search query</label>\n            <div class=\"controls\">\n                <input type=\"text\" id=\"inputQuery\" placeholder=\"query\" name=\"query\" class=\"input-xlarge\">\n                <button class=\"btn\" name=\"tryQuery\">Try it</button>\n            </div>\n        </div>\n        <div class=\"control-group\">\n            <div class=\"controls\">\n                <label class=\"checkbox\"><input type=\"checkbox\" name=\"skip\"/> Skip inbox</label>\n            </div>\n        </div>\n        <div class=\"control-group\">\n            <div class=\"controls\">\n                <button type=\"submit\" class=\"btn\">Save</button>\n            </div>\n        </div>\n</form>\n<div id=\"testResults\"></div>\n";
  return buffer;
  });
templates['hotkeysModal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <div class=\"span4 actionTypeBlock\">\n            <h5>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h5>\n            ";
  stack1 = helpers.each.call(depth0, depth0.actions, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
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
  stack1 = helpers.each.call(depth0, depth0.actionGroups, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
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
  stack1 = self.invokePartial(partials.messageRow, 'messageRow', depth0.last, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n    ";
  stack1 = helpers['if'].call(depth0, depth0.url, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n";
  return buffer;
  });
templates['base'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"row-fluid mainBlock hide\">\n    <div class=\"span3\">\n        <div class=\"sidebar-nav sidebar-nav-fixed sidebarNav\" id=\"sidebarView\"></div>\n    </div>\n    <div class=\"span9\" id=\"packView\">\n        <div class=\"popupView\" id=\"popupView\">\n            <!-- <button type=\"button\" class=\"close\" aria-hidden=\"true\">&times;</button> -->\n            <div class=\"btn-group controls\">\n                <button class=\"btn btn-small\" name=\"back\">&#8592;</button>\n            </div>\n            <!--\n            <div class=\"btn-group controls\">\n                <button class=\"btn btn-small\" name=\"delete\"><i class=\"icon-trash\"></i></button>\n            </div>\n            -->\n            <div class=\"content\"></div>\n        </div>\n        <div id=\"contentView\" class=\"contentView\"></div>\n    </div>\n</div>\n\n<div class=\"modal hide\" id=\"hotkeysModal\" data-backdrop=\"true\" data-keyboard=\"true\" data-show=\"true\" tabindex=\"-1\"></div>\n\n<div class=\"searchPopup hide\" id=\"searchPopup\">\n    <form>\n        <div class=\"input-append\">\n          <input type=\"text\" name=\"search\"/>\n          <button class=\"btn\" type=\"submit\"><i class=\"icon-search\"></i></button>\n        </div>\n    </form>\n</div>\n\n\n<div class=\"labelsPopup hide\" id=\"labelsPopup\">\n    <form>\n        <div class=\"input-append\">\n          <input type=\"text\" name=\"labels\" value=\"\"/>\n          <button class=\"btn\" type=\"submit\">save</button>\n        </div>\n    </form>\n</div>\n";
  });
templates['messageRow'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "unread";
  }

function program3(depth0,data) {
  
  
  return "selected";
  }

function program5(depth0,data) {
  
  
  return "marked";
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <a href=\"#";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n        ";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <div class=\"span3 emailField\">To:\n            ";
  stack1 = helpers['if'].call(depth0, depth0.to, {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            </div>\n        ";
  return buffer;
  }
function program10(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n                ";
  options = {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data};
  stack2 = ((stack1 = helpers.commaJoined || depth0.commaJoined),stack1 ? stack1.call(depth0, depth0.to, options) : helperMissing.call(depth0, "commaJoined", depth0.to, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n            ";
  return buffer;
  }
function program11(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                    ";
  stack1 = self.invokePartial(partials.emailAddress, 'emailAddress', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                ";
  return buffer;
  }

function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <div class=\"span3 emailField\">";
  stack1 = self.invokePartial(partials.emailAddress, 'emailAddress', depth0.from, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\n        ";
  return buffer;
  }

function program15(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                <span class=\"pull-left\">\n                ";
  stack1 = helpers.each.call(depth0, depth0.visibleLabels, {hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                </span>&nbsp;\n            ";
  return buffer;
  }
function program16(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n                    <span class=\"badge labelBadge\" style=\"background-color: ";
  options = {hash:{},inverse:self.noop,fn:self.program(17, program17, data),data:data};
  stack2 = ((stack1 = helpers.colorForLabel || depth0.colorForLabel),stack1 ? stack1.call(depth0, depth0, options) : helperMissing.call(depth0, "colorForLabel", depth0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</span>\n                ";
  return buffer;
  }
function program17(depth0,data) {
  
  var buffer = "";
  return buffer;
  }

function program19(depth0,data) {
  
  
  return "\n            <span class=\"pull-right\" style=\"color: rgba(0, 0, 0, 0.4);\"><i class=\"fa fa-files-o\"></i></span>\n            ";
  }

function program21(depth0,data) {
  
  
  return "\n        </a>\n        ";
  }

  buffer += "    <div id=\"message-row-";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"row messageRow ";
  stack1 = helpers['if'].call(depth0, depth0.unread, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers['if'].call(depth0, depth0.selected, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers['if'].call(depth0, depth0.marked, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n        ";
  stack1 = helpers['if'].call(depth0, depth0.url, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        ";
  options = {hash:{},inverse:self.program(13, program13, data),fn:self.program(9, program9, data),data:data};
  stack2 = ((stack1 = helpers.isOutcoming || depth0.isOutcoming),stack1 ? stack1.call(depth0, depth0, options) : helperMissing.call(depth0, "isOutcoming", depth0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n        <div class=\"span7 subjectField\">\n            ";
  stack2 = helpers['if'].call(depth0, depth0.visibleLabels, {hash:{},inverse:self.noop,fn:self.program(15, program15, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n            ";
  if (stack2 = helpers.subject) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.subject; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "&nbsp;\n            ";
  stack2 = helpers['if'].call(depth0, depth0.has_attachments, {hash:{},inverse:self.noop,fn:self.program(19, program19, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        </div>\n        <div class=\"span2 dateField\">\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(17, program17, data),data:data};
  stack2 = ((stack1 = helpers.date_ago || depth0.date_ago),stack1 ? stack1.call(depth0, depth0.received, options) : helperMissing.call(depth0, "date_ago", depth0.received, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        </div>\n\n        ";
  stack2 = helpers['if'].call(depth0, depth0.url, {hash:{},inverse:self.noop,fn:self.program(21, program21, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </div>\n";
  return buffer;
  });
templates['message'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, stack2, options, self=this, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "<span class=\"headerRow\">to: ";
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.commaJoined || depth0.commaJoined),stack1 ? stack1.call(depth0, depth0.to, options) : helperMissing.call(depth0, "commaJoined", depth0.to, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span>";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = self.invokePartial(partials.emailAddressWithLink, 'emailAddressWithLink', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "<span class=\"headerRow\">cc: ";
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.commaJoined || depth0.commaJoined),stack1 ? stack1.call(depth0, depth0.cc, options) : helperMissing.call(depth0, "commaJoined", depth0.cc, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span>";
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "<span class=\"headerRow\">bcc: ";
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.commaJoined || depth0.commaJoined),stack1 ? stack1.call(depth0, depth0.bcc, options) : helperMissing.call(depth0, "commaJoined", depth0.bcc, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span>";
  return buffer;
  }

function program10(depth0,data) {
  
  
  return "folded";
  }

function program12(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += " <a class=\"badge labelBadge\" href=\"#p/"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\" style=\"background-color: ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.colorForLabel || depth0.colorForLabel),stack1 ? stack1.call(depth0, depth0, options) : helperMissing.call(depth0, "colorForLabel", depth0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</a>";
  return buffer;
  }

function program14(depth0,data) {
  
  
  return "\n                        <li class=\"divider\"></li>\n                        <li><a href=\"#\" name=\"showAsBodyType\" data-type=\"text\"><!--<i class=\"icon-ok\"></i>-->Show as text</a></li>\n                        <li><a href=\"#\" name=\"showAsBodyType\" data-type=\"html\">Show as HTML</a></li>\n                        ";
  }

function program16(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                ";
  stack1 = helpers['if'].call(depth0, depth0.isHtml, {hash:{},inverse:self.program(22, program22, data),fn:self.program(17, program17, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            ";
  return buffer;
  }
function program17(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                    <pre class=\"hide\" id=\"pre-";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</pre>\n                    <iframe data-type=\"";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" id=\"body-";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"body body-";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  stack1 = helpers['if'].call(depth0, depth0.hidden, {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\"></iframe>\n                    <script>\n                        ";
  stack1 = helpers.unless.call(depth0, depth0.hidden, {hash:{},inverse:self.noop,fn:self.program(20, program20, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                    </script>\n                ";
  return buffer;
  }
function program18(depth0,data) {
  
  
  return "hide";
  }

function program20(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                        loadAndShowHTML($(\"#body-";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"), $(\"pre#pre-";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"));\n                        ";
  return buffer;
  }

function program22(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                    <div class=\"body body-";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  stack1 = helpers['if'].call(depth0, depth0.hidden, {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" data-type=\"";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\n                ";
  return buffer;
  }

function program24(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <div class=\"row-fluid attachments\">\n                ";
  stack1 = helpers.each.call(depth0, depth0.attachments, {hash:{},inverse:self.noop,fn:self.programWithDepth(25, program25, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            </div>\n            ";
  return buffer;
  }
function program25(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n                <div class=\"attachmentPreview\" name=\"";
  if (stack1 = helpers.file) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.file; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n                    <a href=\"/attachment/"
    + escapeExpression(((stack1 = depth1.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/";
  if (stack2 = helpers.file) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.file; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" target=\"_blank\">";
  if (stack2 = helpers.filename) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.filename; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</a>\n                    <span class=\"muted\" name=\"filesize\"></span>\n                </div>\n                ";
  return buffer;
  }

  buffer += "    <div class=\"message\">\n        <div class=\"messageHeader\">\n            <span class=\"lead\">\n                <a href=\"#";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"><span class=\"muted pull-right date\">";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.dateformat || depth0.dateformat),stack1 ? stack1.call(depth0, depth0.received, "HH:mm, MMM Do", options) : helperMissing.call(depth0, "dateformat", depth0.received, "HH:mm, MMM Do", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span></a>\n                ";
  if (stack2 = helpers.subject) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.subject; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\n                <span class=\"headerRow\">from ";
  stack2 = self.invokePartial(partials.emailAddressWithLink, 'emailAddressWithLink', depth0.from, helpers, partials, data);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span>\n                <br/>\n            </span>\n            ";
  stack2 = helpers['if'].call(depth0, depth0.to, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n            ";
  stack2 = helpers['if'].call(depth0, depth0.cc, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n            ";
  stack2 = helpers['if'].call(depth0, depth0.bcc, {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        </div>\n        <!-- <div class=\"messageBody ";
  stack2 = helpers['if'].call(depth0, depth0.folded, {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">-->\n        <div class=\"messageBody\">\n            <div class=\"pull-right\">\n                ";
  stack2 = helpers.each.call(depth0, depth0.labels, {hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                <div class=\"btn-group\">\n                    <button class=\"btn btn-small dropdown-toggle\" data-toggle=\"dropdown\"><i class=\"fa fa-wrench\"></i></button>\n                    <ul class=\"dropdown-menu\" style=\"float:right;right:0;left:auto;\">\n                        <li><a href=\"#\" name=\"deleteMessageForever\" data-type=\"text\">Delete message forever</a></li>\n                        ";
  stack2 = helpers['if'].call(depth0, depth0._multipleTypes, {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                    </ul>\n                </div>\n            </div>\n\n\n            ";
  stack2 = helpers.each.call(depth0, depth0._body, {hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n            ";
  stack2 = helpers['if'].call(depth0, depth0.attachments, {hash:{},inverse:self.noop,fn:self.program(24, program24, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        </div>\n    </div>\n\n";
  return buffer;
  });
templates['draft'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "class=\"hide\"";
  }

function program3(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.email; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

function program5(depth0,data) {
  
  var buffer = "";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "<span class=\"headerRow\">to: ";
  options = {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data};
  stack2 = ((stack1 = helpers.commaJoined || depth0.commaJoined),stack1 ? stack1.call(depth0, depth0.to, options) : helperMissing.call(depth0, "commaJoined", depth0.to, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span>";
  return buffer;
  }
function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = self.invokePartial(partials.emailAddressWithLink, 'emailAddressWithLink', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "<span class=\"headerRow\">cc: ";
  options = {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data};
  stack2 = ((stack1 = helpers.commaJoined || depth0.commaJoined),stack1 ? stack1.call(depth0, depth0.cc, options) : helperMissing.call(depth0, "commaJoined", depth0.cc, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span>";
  return buffer;
  }

function program12(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "<span class=\"headerRow\">bcc: ";
  options = {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data};
  stack2 = ((stack1 = helpers.commaJoined || depth0.commaJoined),stack1 ? stack1.call(depth0, depth0.bcc, options) : helperMissing.call(depth0, "commaJoined", depth0.bcc, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span>";
  return buffer;
  }

function program14(depth0,data) {
  
  
  return "style=\"height:50px\"";
  }

function program16(depth0,data) {
  
  
  return "style=\"height:400px\"";
  }

function program18(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

function program20(depth0,data) {
  
  
  return "hide";
  }

function program22(depth0,data) {
  
  
  return "\n            <button class=\"btn btn-small\" aria-hidden=\"true\" name=\"cancel\">Cancel</button>\n            ";
  }

  buffer += "<div class=\"draftView\" >\n    <div class=\"draftBody\">\n        <form class=\"form-horizontal\">\n            <div name=\"editable\" ";
  stack1 = helpers['if'].call(depth0, depth0.embedded, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n                <div class=\"control-group\">\n                    <input name=\"to\" type=\"text\" data-provide=\"typeahead\" placeholder=\"To\" value=\"";
  stack1 = helpers.each.call(depth0, depth0.to, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\"/>\n                </div>\n                <div class=\"control-group\">\n                    <input name=\"subject\" type=\"text\" data-provide=\"typeahead\" placeholder=\"Subject\" value=\"";
  if (stack1 = helpers.subject) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.subject; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"/>\n                </div>\n            </div>\n            <div name=\"readonly\" ";
  stack1 = helpers.unless.call(depth0, depth0.embedded, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n                <p class=\"messageHeader\">\n                    <span class=\"muted pull-right date\">";
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data};
  stack2 = ((stack1 = helpers.dateformat || depth0.dateformat),stack1 ? stack1.call(depth0, depth0.received, "HH:mm, MMM Do", options) : helperMissing.call(depth0, "dateformat", depth0.received, "HH:mm, MMM Do", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span>\n                    ";
  if (stack2 = helpers.subject) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.subject; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\n                    <span class=\"headerRow\">from ";
  stack2 = self.invokePartial(partials.emailAddressWithLink, 'emailAddressWithLink', depth0.from, helpers, partials, data);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span>\n                    <br/>\n                    ";
  stack2 = helpers['if'].call(depth0, depth0.to, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                    ";
  stack2 = helpers['if'].call(depth0, depth0.cc, {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                    ";
  stack2 = helpers['if'].call(depth0, depth0.bcc, {hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                </p>\n            </div>\n            <div class=\"control-group\">\n                <textarea ";
  stack2 = helpers['if'].call(depth0, depth0.embedded, {hash:{},inverse:self.program(16, program16, data),fn:self.program(14, program14, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += " name=\"body\">";
  stack2 = helpers.each.call(depth0, depth0.body, {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</textarea>\n            </div>\n        </form>\n    </div>\n    <div class=\"draftFooter row-fluid ";
  stack2 = helpers.unless.call(depth0, depth0.received, {hash:{},inverse:self.noop,fn:self.program(20, program20, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">\n        <div class=\"modal-footer\">\n            <div class=\"pull-left saved\">\n                <span class=\"muted ";
  stack2 = helpers.unless.call(depth0, depth0.received, {hash:{},inverse:self.noop,fn:self.program(20, program20, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" name=\"title\">Saved: </span><span name=\"value\">";
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data};
  stack2 = ((stack1 = helpers.dateformat || depth0.dateformat),stack1 ? stack1.call(depth0, depth0.received, "HH:mm:SS, dddd, MMM Do", options) : helperMissing.call(depth0, "dateformat", depth0.received, "HH:mm:SS, dddd, MMM Do", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span>\n            </div>\n            <button class=\"btn btn-small\" aria-hidden=\"true\" name=\"discard\"><i class=\"icon-trash\"></i></button>\n            ";
  stack2 = helpers.unless.call(depth0, depth0.embedded, {hash:{},inverse:self.noop,fn:self.program(22, program22, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n            <button class=\"btn btn-small\" name=\"send\">Send</button>\n        </div>\n        <!--\n        <div class=\"span4 ";
  stack2 = helpers.unless.call(depth0, depth0.saved, {hash:{},inverse:self.noop,fn:self.program(20, program20, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += " saved muted\">Saved <span class=\"savedValue\">";
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data};
  stack2 = ((stack1 = helpers.date_ago || depth0.date_ago),stack1 ? stack1.call(depth0, depth0.saved, options) : helperMissing.call(depth0, "date_ago", depth0.saved, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span></div>\n        -->\n    </div>\n</div>\n";
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
