var traverseDomAndCollectElements = function (matchFunc, startEl) {
  var resultSet = [];

  if (typeof startEl === "undefined") {
    startEl = document.body;
  }
  // traverse the DOM tree and collect matching elements in resultSet
  // use matchFunc to identify matching elements
  if (matchFunc(startEl)) {
    resultSet.push(startEl)
  }

 if (startEl.children) {
   let childrenArr = Array.prototype.slice.call(startEl.children);

   childrenArr.forEach(child => {
     let subResultSet = traverseDomAndCollectElements(matchFunc, child);
     resultSet = resultSet.concat(subResultSet);
   })
 }

  return resultSet;
};


// detect and return the type of selector
// return one of these types: id, class, tag.class, tag
var selectorTypeMatcher = function (selector) {
  if (selector[0] === '#') {
    return 'id';
  } else if (selector[0] === '.') {
    return 'class';
  } else {
    if (selector.indexOf('.') > -1) {
      return 'tag.class';
    } else {
      return 'tag';
    }
  }
};

// NOTE ABOUT THE MATCH FUNCTION
// remember, the returned matchFunction takes an *element* as a
// parameter and returns true/false depending on if that element
// matches the selector.
var matchFunctionMaker = function (selector) {
  var selectorType = selectorTypeMatcher(selector);
  var matchFunction;

  if (selectorType === "id") {
    matchFunction = element => element.id === selector.slice(1);
  } else if (selectorType === "class") {
    matchFunction = element => {
      let classesArr = element.className.split(' ');
      return classesArr.indexOf(selector.slice(1)) > -1;
    }
  } else if (selectorType === "tag.class") {
    matchFunction = element => {
      let theTag = selector.split('.')[0];
      let theClass = selector.split('.')[1];
      let classesArr = element.className.split(' ');
      return classesArr.indexOf(theClass) > -1 &&
        element.tagName.toLowerCase() === theTag.toLowerCase();
    }
  } else if (selectorType === "tag") {
    matchFunction = element => element.tagName.toLowerCase() === selector.toLowerCase();
  }
  return matchFunction;
};

var $ = function (selector) {
  var elements;
  var selectorMatchFunc = matchFunctionMaker(selector);
  elements = traverseDomAndCollectElements(selectorMatchFunc);
  return elements;
};
