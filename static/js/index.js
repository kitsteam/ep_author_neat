var $sidedivinner, fadeColor, getAuthorClassName, init, authorNameAndColorFromAuthorId, authorLines, isStyleFuncSupported, out$ = typeof exports != 'undefined' && exports || this;
function allClasses($node){
  var ref$;
  return ((ref$ = $node.attr('class')) != null ? ref$ : '').split(' ');
}
function derivePrimaryAuthor($node){
  var byAuthor, mPA, authorClass, author, value;
  byAuthor = {};
  $node.children('span').each(function(){
    var $this, i$, ref$, len$, spanclass, length, results$ = [];
    $this = $(this);
    for (i$ = 0, len$ = (ref$ = allClasses($this)).length; i$ < len$; ++i$) {
      spanclass = ref$[i$];
      if (/^author/.exec(spanclass)) {
        length = $this.text().length;
        byAuthor[spanclass] == null && (byAuthor[spanclass] = 0);
        results$.push(byAuthor[spanclass] += length);
      }
    }
    return results$;
  });
  mPA = 0;
  authorClass = null;
  for (author in byAuthor) {
    value = byAuthor[author];
    if (value > mPA) {
      mPA = value;
      authorClass = author;
    }
  }
  return authorClass;
}
function toggleAuthor($node, prefix, authorClass){
  var hasClass, myClass, i$, ref$, len$, c;
  hasClass = false;
  myClass = prefix + "-" + authorClass;
  for (i$ = 0, len$ = (ref$ = allClasses($node)).length; i$ < len$; ++i$) {
    c = ref$[i$];
    if (c.indexOf(prefix) === 0) {
      if (c === myClass) {
        hasClass = true;
      } else {
        $node.removeClass(c);
      }
    }
  }
  if (hasClass) {
    return false;
  }
  $node.addClass(myClass);
  return true;
}
function updateDomline($node){
  var lineNumber, authorClass;
  lineNumber = $node.index() + 1;
  if (!lineNumber) {
    return false;
  }
  authorClass = $node.text().length > 0 ? derivePrimaryAuthor($node) : "none";
  toggleAuthor($node, "primary", authorClass);
  return authorViewUpdate($node, lineNumber, null, authorClass);
}
function extractAuthor($node){
  var ref$, a, ref1$;
  return (ref$ = (function(){
    var i$, ref$, len$, results$ = [];
    for (i$ = 0, len$ = (ref$ = allClasses($node)).length; i$ < len$; ++i$) {
      a = ref$[i$];
      if (/^primary-/.exec(a)) {
        results$.push(a);
      }
    }
    return results$;
  }())) != null ? (ref1$ = ref$[0]) != null ? ref1$.replace(/^primary-/, '') : void 8 : void 8;
}
function authorViewUpdate($node, lineNumber, prevAuthor, authorClass){
  var $authorContainer, prevId, ref$, authorChanged, next;
  $sidedivinner == null && ($sidedivinner = $('iframe[name="ace_outer"]').contents().find('#sidedivinner'));
  $authorContainer = $sidedivinner.find("div:nth-child(" + lineNumber + ")");
  authorClass == null && (authorClass = extractAuthor($node));
  prevAuthor == null && (prevAuthor = extractAuthor($authorContainer.prev()));
  prevId = (ref$ = $authorContainer.attr('id')) != null ? ref$.replace(/^ref-/, '') : void 8;
  if (prevAuthor === authorClass) {
    $authorContainer.addClass('concise');
  } else {
    $authorContainer.removeClass('concise');
  }
  if (prevId === $node.attr('id')) {
    authorChanged = toggleAuthor($authorContainer, "primary", authorClass);
    if (!authorChanged) {
      return;
    }
  } else {
    $authorContainer.attr('id', 'ref-' + $node.attr('id'));
    toggleAuthor($authorContainer, "primary", authorClass);
  }
  next = $node.next();
  if (next.length) {
    console.log('go', lineNumber + 1);
    return authorViewUpdate(next, lineNumber + 1, authorClass);
  }
}
fadeColor = function(colorCSS, fadeFrac){
  var color;
  color = colorutils.css2triple(colorCSS);
  return colorutils.triple2css(colorutils.blend(color, [1, 1, 1], fadeFrac));
};
getAuthorClassName = function(author){
  return 'author-' + author.replace(/[^a-y0-9]/g, function(c){
    if (c === '.') {
      return '-';
    } else {
      return 'z' + c.charCodeAt(0) + 'z';
    }
  });
};
function outerInit(outerDynamicCSS){
  var x$, y$, z$, z1$;
  x$ = outerDynamicCSS.selectorStyle('#sidedivinner > div.primary-author-none');
  x$.borderRight = 'solid 0px ';
  x$.paddingRight = '5px';
  y$ = outerDynamicCSS.selectorStyle('#sidedivinner > div.concise::before');
  y$.content = "' '";
  z$ = outerDynamicCSS.selectorStyle('#sidedivinner > div');
  z$.fontSize = '0px';
  z1$ = outerDynamicCSS.selectorStyle('#sidedivinner > div::before');
  z1$.fontSize = 'initial';
  z1$.textOverflow = 'ellipsis';
  z1$.overflow = 'hidden';
  return init = true;
}
out$.aceSetAuthorStyle = aceSetAuthorStyle;
function aceSetAuthorStyle(name, context){
  var dynamicCSS, outerDynamicCSS, parentDynamicCSS, info, author, authorSelector, color, authorClass, authorName, x$, y$, z$, z1$, z2$;
  dynamicCSS = context.dynamicCSS, outerDynamicCSS = context.outerDynamicCSS, parentDynamicCSS = context.parentDynamicCSS, info = context.info, author = context.author, authorSelector = context.authorSelector;
  if (!init) {
    outerInit(outerDynamicCSS);
  }
  if (info) {
    if (!(color = info.bgcolor)) {
      return 1;
    }
    authorClass = getAuthorClassName(author);
    authorName = authorNameAndColorFromAuthorId(author).name;
    authorSelector = ".authorColors span." + authorClass;
    x$ = dynamicCSS.selectorStyle(authorSelector);
    x$.borderBottom = "2px solid " + color;
    y$ = parentDynamicCSS.selectorStyle(authorSelector);
    y$.borderBottom = "2px solid " + color;
    z$ = dynamicCSS.selectorStyle(".authorColors .primary-" + authorClass + " ." + authorClass);
    z$.borderBottom = '0px';
    z1$ = outerDynamicCSS.selectorStyle("#sidedivinner > div.primary-" + authorClass);
    z1$.borderRight = "solid 5px " + color;
    z1$.paddingRight = '5px';
    z2$ = outerDynamicCSS.selectorStyle("#sidedivinner > div.primary-" + authorClass + "::before");
    z2$.content = "'" + authorNameAndColorFromAuthorId(author).name + "'";
  } else {
    dynamicCSS.removeSelectorStyle(authorSelector);
    parentDynamicCSS.removeSelectorStyle(authorSelector);
  }
  return 1;
}
authorNameAndColorFromAuthorId = function(authorId){
  var myAuthorId, authorObj;
  myAuthorId = pad.myUserInfo.userId;
  if (myAuthorId === authorId) {
    return {
      name: 'Me',
      color: pad.myUserInfo.colorId
    };
  }
  authorObj = {};
  $('#otheruserstable > tbody > tr').each(function(){
    var x$;
    if (authorId === $(this).data('authorid')) {
      x$ = $(this);
      x$.find('.usertdname').each(function(){
        return authorObj.name = $(this).text() || 'Unknown Author';
      });
      x$.find('.usertdswatch > div').each(function(){
        return authorObj.color = $(this).css('background-color');
      });
      return authorObj;
    }
  });
  if (!authorObj || !authorObj.name) {
    authorObj = clientVars.collab_client_vars.historicalAuthorData[authorId];
  }
  return authorObj || {
    name: 'Unknown Author',
    color: '#fff'
  };
};
authorLines = {};
out$.acePostWriteDomLineHTML = acePostWriteDomLineHTML;
function acePostWriteDomLineHTML(hook_name, args, cb){
  return setTimeout(function(){
    return updateDomline($(args.node));
  }, 200);
}
out$.aceEditEvent = aceEditEvent;
function aceEditEvent(hook_name, context, cb){
  var callstack, x$;
  callstack = context.callstack;
  if (callstack.type !== 'setWraps') {
    return;
  }
  x$ = $('iframe[name="ace_outer"]').contents();
  x$.find('#sidediv').css({
    'padding-right': '0px'
  });
  x$.find('#sidedivinner').css({
    'max-width': '180px',
    overflow: 'hidden'
  });
  return x$;
}
isStyleFuncSupported = CSSStyleDeclaration.prototype.getPropertyValue != null;
if (!isStyleFuncSupported) {
  CSSStyleDeclaration.prototype.getPropertyValue = function(a){
    return this.getAttribute(a);
  };
  CSSStyleDeclaration.prototype.setProperty = function(styleName, value, priority){
    var rule;
    this.setAttribute(styleName, value);
    priority = typeof priority !== 'undefined' ? priority : '';
    if (!(priority === '')) {
      rule = new RegExp(RegExp.escape(styleName) + '\\s*:\\s*' + RegExp.escape(value + '(\\s*;)?', 'gmi'));
      return this.cssText = this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
    }
  };
  CSSStyleDeclaration.prototype.removeProperty = function(a){
    return this.removeAttribute(a);
  };
  CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName){
    var rule;
    rule = new RegExp(RegExp.escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?', 'gmi');
    if (rule.test(this.cssText)) {
      return 'important';
    } else {
      return '';
    }
  };
}
RegExp.escape = function(text){
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};