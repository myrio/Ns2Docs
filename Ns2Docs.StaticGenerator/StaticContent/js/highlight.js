// Minimal framing needed to use CodeMirror-style parsers to highlight
// code. Load this along with tokenize.js, stringstream.js, and your
// parser. Then call highlightText, passing a string as the first
// argument, and as the second argument either a callback function
// that will be called with an array of SPAN nodes for every line in
// the code, or a DOM node to which to append these spans, and
// optionally (not needed if you only loaded one parser) a parser
// object.

// Stuff from util.js that the parsers are using.
var StopIteration = {toString: function() {return "StopIteration"}};

var Editor = {};
var indentUnit = 4;

(function(){
  function normaliseString(string) {
    var tab = "";
    for (var i = 0; i < indentUnit; i++) tab += " ";

    string = string.replace(/\t/g, tab).replace(/\u00a0/g, " ").replace(/\r\n?/g, "\n");
    
    var pos = 0, parts = [], lines = string.split("\n");
    for (var line = 0; line < lines.length; line++) {
      
      if (line != 0)
      {
        parts.push("\n");
      }
      parts.push(lines[line]);
    }

    return {
      next: function() {
        if (pos < parts.length) return parts[pos++];
        else throw StopIteration;
      }
    };
  }

  window.highlightText = function(string, callback, n, parser) {
    parser = (parser || Editor.Parser).make(stringStream(normaliseString(string)));
    var line = [];
    
    if (callback.nodeType == 1) {
      var node = callback;  
      callback = function(line) {
        for (var i = 0; i < line.length; i++)
          node.appendChild(line[i]);
        node.appendChild(document.createElement("BR"));
      };
    }

    
        var f = function()
        {
            try {
                for(var i=0; i<100; i++)
                {
                    var token = parser.next();
                    if (token.value == "\n") {

                      callback(line);
                      line = [];
                    }
                    else {
                      var span = document.createElement("SPAN");
                      span.className = token.style;
                      
                        span.appendChild(document.createTextNode(token.value));
                      
                      line.push(span);
                    }
                }
            setTimeout(f, 1)
                }
            catch (e) {
              if (e != StopIteration) throw e;
              if (line.length) callback(line);
              n()
              return
            }
        }
        setTimeout(f, 50)
    
    
  }
})();