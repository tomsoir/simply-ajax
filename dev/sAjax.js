
(function( global, factory ) {
    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = global.document ?
            factory( global, true ) :
            function( w ) {
                if ( !w.document ) {
                    throw new Error( "SA requires a window with a document" );
                }
                return factory( w );
            };
    } else {
        factory( global );
    }
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

var arr = [];

var slice = arr.slice;

var push = arr.push;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var document = window.document,
    version = "0.1.0",
    SA = function( selector, context ) {
        return new SA.fn.init( selector, context );
    },
    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
SA.fn = SA.prototype = {
    constructor: SA,

    selector: "",

    length: 0,

    // (returning the new matched element set)
    pushStack: function( elems ) {

        var ret = SA.merge( this.constructor(), elems );

        ret.prevObject = this;
        ret.context = this.context;

        return ret;
    },

    // (You can seed the arguments with an array of args, but this is

    each: function( callback, args ) {
        return SA.each( this, callback, args );
    },
};

SA.extend = SA.fn.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    if ( typeof target === "boolean" ) {
        deep = target;

        target = arguments[ i ] || {};
        i++;
    }

    if ( typeof target !== "object" && !SA.isFunction(target) ) {
        target = {};
    }

    if ( i === length ) {
        target = this;
        i--;
    }

    for ( ; i < length; i++ ) {

        if ( (options = arguments[ i ]) != null ) {

            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];

                if ( target === copy ) {
                    continue;
                }

                if ( deep && copy && ( SA.isPlainObject(copy) || (copyIsArray = SA.isArray(copy)) ) ) {
                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && SA.isArray(src) ? src : [];

                    } else {
                        clone = src && SA.isPlainObject(src) ? src : {};
                    }

                    target[ name ] = SA.extend( deep, clone, copy );

                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }

    return target;
};
SA.extend({

    expando: "SA" + ( version + Math.random() ).replace( /\D/g, "" ),

    isReady: true,
    error: function( msg ) {
        throw new Error( msg );
    },
    noop: function() {},

    isFunction: function( obj ) {
        return SA.type(obj) === "function";
    },
    isArray: Array.isArray,
    isWindow: function( obj ) {
        return obj != null && obj === obj.window;
    },
    isPlainObject: function( obj ) {

        // - Any object or value whose internal [[Class]] property is not "[object Object]"
        // - DOM nodes
        // - window
        if ( SA.type( obj ) !== "object" || obj.nodeType || SA.isWindow( obj ) ) {
            return false;
        }

        if ( obj.constructor &&
                !hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
            return false;
        }

        // |obj| is a plain object, created by {} or constructed with new Object
        return true;
    },
    isEmptyObject: function( obj ) {
        var name;
        for ( name in obj ) {
            return false;
        }
        return true;
    },
    type: function( obj ) {
        if ( obj == null ) {
            return obj + "";
        }

        return typeof obj === "object" || typeof obj === "function" ?
            class2type[ toString.call(obj) ] || "object" :
            typeof obj;
    },

    each: function( obj, callback, args ) {
        var value,
            i = 0,
            length = obj.length,
            isArray = isArraylike( obj );

        if ( args ) {
            if ( isArray ) {
                for ( ; i < length; i++ ) {
                    value = callback.apply( obj[ i ], args );

                    if ( value === false ) {
                        break;
                    }
                }
            } else {
                for ( i in obj ) {
                    value = callback.apply( obj[ i ], args );

                    if ( value === false ) {
                        break;
                    }
                }
            }

        } else {
            if ( isArray ) {
                for ( ; i < length; i++ ) {
                    value = callback.call( obj[ i ], i, obj[ i ] );

                    if ( value === false ) {
                        break;
                    }
                }
            } else {
                for ( i in obj ) {
                    value = callback.call( obj[ i ], i, obj[ i ] );

                    if ( value === false ) {
                        break;
                    }
                }
            }
        }
        return obj;
    },

    trim: function( text ) {
        return text == null ?
            "" :
            ( text + "" ).replace( rtrim, "" );
    },

    makeArray: function( arr, results ) {
        var ret = results || [];

        if ( arr != null ) {
            if ( isArraylike( Object(arr) ) ) {
                SA.merge( ret,
                    typeof arr === "string" ?
                    [ arr ] : arr
                );
            } else {
                push.call( ret, arr );
            }
        }

        return ret;
    },
    merge: function( first, second ) {
        var len = +second.length,
            j = 0,
            i = first.length;

        for ( ; j < len; j++ ) {
            first[ i++ ] = second[ j ];
        }

        first.length = i;

        return first;
    },
    now: Date.now
});

SA.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase();
});
function isArraylike( obj ) {
    var length = obj.length,
        type = SA.type( obj );

    if ( type === "function" || SA.isWindow( obj ) ) {
        return false;
    }

    if ( obj.nodeType === 1 && length ) {
        return true;
    }

    return type === "array" || length === 0 ||
        typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
(function( window ) {
var document,
    documentIsHTML,

    expando = "sizzle" + -(new Date()),
    rnative = /^[^{]+\{\s*\[native \w/,
    funescape = function( _, escaped, escapedWhitespace ) {
        var high = "0x" + escaped - 0x10000;

        return high !== high || escapedWhitespace ?
            escaped :
            high < 0 ?

                String.fromCharCode( high + 0x10000 ) :

                String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
    };
function Sizzle( selector, context, results, seed ) {
    var match, elem, m, nodeType,

        i, groups, old, nid, newContext, newSelector;

    if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
        setDocument( context );
    }

    context = context || document;
    results = results || [];

    if ( !selector || typeof selector !== "string" ) {
        return results;
    }

    if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
        return [];
    }

    if ( documentIsHTML && !seed ) {

        if ( (match = rquickExpr.exec( selector )) ) {

            if ( (m = match[1]) ) {
                if ( nodeType === 9 ) {
                    elem = context.getElementById( m );

                    if ( elem && elem.parentNode ) {

                        if ( elem.id === m ) {
                            results.push( elem );
                            return results;
                        }
                    } else {
                        return results;
                    }
                } else {

                    if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
                        contains( context, elem ) && elem.id === m ) {
                        results.push( elem );
                        return results;
                    }
                }

            } else if ( match[2] ) {
                push.apply( results, context.getElementsByTagName( selector ) );
                return results;

            } else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
                push.apply( results, context.getElementsByClassName( m ) );
                return results;
            }
        }

        if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
            nid = old = expando;
            newContext = context;
            newSelector = nodeType === 9 && selector;

            if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
                groups = tokenize( selector );

                if ( (old = context.getAttribute("id")) ) {
                    nid = old.replace( rescape, "\\$&" );
                } else {
                    context.setAttribute( "id", nid );
                }
                nid = "[id='" + nid + "'] ";

                i = groups.length;
                while ( i-- ) {
                    groups[i] = nid + toSelector( groups[i] );
                }
                newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
                newSelector = groups.join(",");
            }

            if ( newSelector ) {
                try {
                    push.apply( results,
                        newContext.querySelectorAll( newSelector )
                    );
                    return results;
                } catch(qsaError) {
                } finally {
                    if ( !old ) {
                        context.removeAttribute("id");
                    }
                }
            }
        }
    }

    return select( selector.replace( rtrim, "$1" ), context, results, seed );
}
function createCache() {
    var keys = [];

    function cache( key, value ) {

        if ( keys.push( key + " " ) > Expr.cacheLength ) {

            delete cache[ keys.shift() ];
        }
        return (cache[ key + " " ] = value);
    }
    return cache;
}
function assert( fn ) {
    var div = document.createElement("div");

    try {
        return !!fn( div );
    } catch (e) {
        return false;
    } finally {

        if ( div.parentNode ) {
            div.parentNode.removeChild( div );
        }

        div = null;
    }
}

support = Sizzle.support = {};
/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {

    // (such as loading iframes in IE - #4833)
    var documentElement = elem && (elem.ownerDocument || elem).documentElement;
    return documentElement ? documentElement.nodeName !== "HTML" : false;
};
/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
    var hasCompare,
        doc = node ? node.ownerDocument || node : preferredDoc,
        parent = doc.defaultView;

    if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
        return document;
    }

    document = doc;
    docElem = doc.documentElement;

    documentIsHTML = !isXML( doc );

    if ( parent && parent !== parent.top ) {

        if ( parent.addEventListener ) {
            parent.addEventListener( "unload", function() {
                setDocument();
            }, false );
        } else if ( parent.attachEvent ) {
            parent.attachEvent( "onunload", function() {
                setDocument();
            });
        }
    }

    /* Attributes
    ---------------------------------------------------------------------- */

    support.attributes = assert(function( div ) {
        div.className = "i";
        return !div.getAttribute("className");
    });

    /* getElement(s)By*
    ---------------------------------------------------------------------- */

    support.getElementsByTagName = assert(function( div ) {
        div.appendChild( doc.createComment("") );
        return !div.getElementsByTagName("*").length;
    });

    support.getElementsByClassName = rnative.test( doc.getElementsByClassName ) && assert(function( div ) {
        div.innerHTML = "<div class='a'></div><div class='a i'></div>";

        div.firstChild.className = "i";

        return div.getElementsByClassName("i").length === 2;
    });

    support.getById = assert(function( div ) {
        docElem.appendChild( div ).id = expando;
        return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
    });

    if ( support.getById ) {
        Expr.find["ID"] = function( id, context ) {
            if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
                var m = context.getElementById( id );

                return m && m.parentNode ? [ m ] : [];
            }
        };
        Expr.filter["ID"] = function( id ) {
            var attrId = id.replace( runescape, funescape );
            return function( elem ) {
                return elem.getAttribute("id") === attrId;
            };
        };
    } else {

        delete Expr.find["ID"];

        Expr.filter["ID"] =  function( id ) {
            var attrId = id.replace( runescape, funescape );
            return function( elem ) {
                var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                return node && node.value === attrId;
            };
        };
    }

    Expr.find["TAG"] = support.getElementsByTagName ?
        function( tag, context ) {
            if ( typeof context.getElementsByTagName !== strundefined ) {
                return context.getElementsByTagName( tag );
            }
        } :
        function( tag, context ) {
            var elem,
                tmp = [],
                i = 0,
                results = context.getElementsByTagName( tag );

            if ( tag === "*" ) {
                while ( (elem = results[i++]) ) {
                    if ( elem.nodeType === 1 ) {
                        tmp.push( elem );
                    }
                }

                return tmp;
            }
            return results;
        };

    Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
        if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
            return context.getElementsByClassName( className );
        }
    };

    /* QSA/matchesSelector
    ---------------------------------------------------------------------- */

    rbuggyMatches = [];

    rbuggyQSA = [];

    if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {

        assert(function( div ) {

            div.innerHTML = "<select msallowclip=''><option selected=''></option></select>";

            if ( div.querySelectorAll("[msallowclip^='']").length ) {
                rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
            }

            if ( !div.querySelectorAll("[selected]").length ) {
                rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
            }

            if ( !div.querySelectorAll(":checked").length ) {
                rbuggyQSA.push(":checked");
            }
        });

        assert(function( div ) {

            var input = doc.createElement("input");
            input.setAttribute( "type", "hidden" );
            div.appendChild( input ).setAttribute( "name", "D" );

            if ( div.querySelectorAll("[name=d]").length ) {
                rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
            }

            if ( !div.querySelectorAll(":enabled").length ) {
                rbuggyQSA.push( ":enabled", ":disabled" );
            }

            div.querySelectorAll("*,:x");
            rbuggyQSA.push(",.*:");
        });
    }

    if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
        docElem.webkitMatchesSelector ||
        docElem.mozMatchesSelector ||
        docElem.oMatchesSelector ||
        docElem.msMatchesSelector) )) ) {

        assert(function( div ) {

            support.disconnectedMatch = matches.call( div, "div" );

            matches.call( div, "[s!='']:x" );
            rbuggyMatches.push( "!=", pseudos );
        });
    }

    rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
    rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

    /* Contains
    ---------------------------------------------------------------------- */
    hasCompare = rnative.test( docElem.compareDocumentPosition );

    contains = hasCompare || rnative.test( docElem.contains ) ?
        function( a, b ) {
            var adown = a.nodeType === 9 ? a.documentElement : a,
                bup = b && b.parentNode;
            return a === bup || !!( bup && bup.nodeType === 1 && (
                adown.contains ?
                    adown.contains( bup ) :
                    a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
            ));
        } :
        function( a, b ) {
            if ( b ) {
                while ( (b = b.parentNode) ) {
                    if ( b === a ) {
                        return true;
                    }
                }
            }
            return false;
        };

    /* Sorting
    ---------------------------------------------------------------------- */

    sortOrder = hasCompare ?
    function( a, b ) {

        if ( a === b ) {
            hasDuplicate = true;
            return 0;
        }

        var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
        if ( compare ) {
            return compare;
        }

        compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
            a.compareDocumentPosition( b ) :

            1;

        if ( compare & 1 ||
            (!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

            if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
                return -1;
            }
            if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
                return 1;
            }

            return sortInput ?
                ( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
                0;
        }

        return compare & 4 ? -1 : 1;
    } :
    function( a, b ) {

        if ( a === b ) {
            hasDuplicate = true;
            return 0;
        }

        var cur,
            i = 0,
            aup = a.parentNode,
            bup = b.parentNode,
            ap = [ a ],
            bp = [ b ];

        if ( !aup || !bup ) {
            return a === doc ? -1 :
                b === doc ? 1 :
                aup ? -1 :
                bup ? 1 :
                sortInput ?
                ( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
                0;

        } else if ( aup === bup ) {
            return siblingCheck( a, b );
        }

        cur = a;
        while ( (cur = cur.parentNode) ) {
            ap.unshift( cur );
        }
        cur = b;
        while ( (cur = cur.parentNode) ) {
            bp.unshift( cur );
        }

        while ( ap[i] === bp[i] ) {
            i++;
        }

        return i ?

            siblingCheck( ap[i], bp[i] ) :

            ap[i] === preferredDoc ? -1 :
            bp[i] === preferredDoc ? 1 :
            0;
    };

    return doc;
};
Expr = Sizzle.selectors = {
    find: {},
    filter:{}
};
return Sizzle;
})( window );
SA.find = Sizzle;
SA.isXMLDoc = Sizzle.isXML;
var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);
SA.fn.extend({
    find: function( selector ) {
        var i,
            len = this.length,
            ret = [],
            self = this;

        if ( typeof selector !== "string" ) {
            return this.pushStack( SA( selector ).filter(function() {
                for ( i = 0; i < len; i++ ) {
                    if ( SA.contains( self[ i ], this ) ) {
                        return true;
                    }
                }
            }) );
        }

        for ( i = 0; i < len; i++ ) {
            SA.find( selector, self[ i ], ret );
        }

        ret = this.pushStack( len > 1 ? SA.unique( ret ) : ret );
        ret.selector = this.selector ? this.selector + " " + selector : selector;
        return ret;
    },
});

var rootSA,

    rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

    init = SA.fn.init = function( selector, context ) {
        var match, elem;

        if ( !selector ) {
            return this;
        }

        if ( typeof selector === "string" ) {
            if ( selector[0] === "<" && selector[ selector.length - 1 ] === ">" && selector.length >= 3 ) {

                match = [ null, selector, null ];

            } else {
                match = rquickExpr.exec( selector );
            }

            if ( match && (match[1] || !context) ) {

                if ( match[1] ) {
                    context = context instanceof SA ? context[0] : context;

                    SA.merge( this, SA.parseHTML(
                        match[1],
                        context && context.nodeType ? context.ownerDocument || context : document,
                        true
                    ) );

                    if ( rsingleTag.test( match[1] ) && SA.isPlainObject( context ) ) {
                        for ( match in context ) {

                            if ( SA.isFunction( this[ match ] ) ) {
                                this[ match ]( context[ match ] );

                            // ...and otherwise set as attributes
                            } else {
                                this.attr( match, context[ match ] );
                            }
                        }
                    }

                    return this;

                } else {
                    elem = document.getElementById( match[2] );

                    if ( elem && elem.parentNode ) {

                        this.length = 1;
                        this[0] = elem;
                    }

                    this.context = document;
                    this.selector = selector;
                    return this;
                }

            } else if ( !context || context.sa ) {
                return ( context || rootSA ).find( selector );

            } else {
                return this.constructor( context ).find( selector );
            }

        } else if ( selector.nodeType ) {
            this.context = this[0] = selector;
            this.length = 1;
            return this;

        } else if ( SA.isFunction( selector ) ) {
            return typeof rootSA.ready !== "undefined" ?
                rootSA.ready( selector ) :

                selector( SA );
        }

        if ( selector.selector !== undefined ) {
            this.selector = selector.selector;
            this.context = selector.context;
        }

        return SA.makeArray( selector, this );
    };

init.prototype = SA.fn;

rootSA = SA( document );
var rnotwhite = (/\S+/g);

var optionsCache = {};

function createOptions( options ) {
    var object = optionsCache[ options ] = {};
    SA.each( options.match( rnotwhite ) || [], function( _, flag ) {
        object[ flag ] = true;
    });
    return object;
}
SA.Callbacks = function( options ) {

    // (we check in cache first)
    options = typeof options === "string" ?
        ( optionsCache[ options ] || createOptions( options ) ) :
        SA.extend( {}, options );

    var 
        memory,

        fired,

        firing,

        firingStart,

        firingLength,

        firingIndex,

        list = [],

        stack = !options.once && [],

        fire = function( data ) {
            memory = options.memory && data;
            fired = true;
            firingIndex = firingStart || 0;
            firingStart = 0;
            firingLength = list.length;
            firing = true;
            for ( ; list && firingIndex < firingLength; firingIndex++ ) {
                if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
                    memory = false; 
                    break;
                }
            }
            firing = false;
            if ( list ) {
                if ( stack ) {
                    if ( stack.length ) {
                        fire( stack.shift() );
                    }
                } else if ( memory ) {
                    list = [];
                } else {
                    self.disable();
                }
            }
        },

        self = {

            add: function() {
                if ( list ) {

                    var start = list.length;
                    (function add( args ) {
                        SA.each( args, function( _, arg ) {
                            var type = SA.type( arg );
                            if ( type === "function" ) {
                                if ( !options.unique || !self.has( arg ) ) {
                                    list.push( arg );
                                }
                            } else if ( arg && arg.length && type !== "string" ) {

                                add( arg );
                            }
                        });
                    })( arguments );

                    if ( firing ) {
                        firingLength = list.length;

                    } else if ( memory ) {
                        firingStart = start;
                        fire( memory );
                    }
                }
                return this;
            },

            remove: function() {
                if ( list ) {
                    SA.each( arguments, function( _, arg ) {
                        var index;
                        while ( ( index = SA.inArray( arg, list, index ) ) > -1 ) {
                            list.splice( index, 1 );

                            if ( firing ) {
                                if ( index <= firingLength ) {
                                    firingLength--;
                                }
                                if ( index <= firingIndex ) {
                                    firingIndex--;
                                }
                            }
                        }
                    });
                }
                return this;
            },

            has: function( fn ) {
                return fn ? SA.inArray( fn, list ) > -1 : !!( list && list.length );
            },

            empty: function() {
                list = [];
                firingLength = 0;
                return this;
            },

            disable: function() {
                list = stack = memory = undefined;
                return this;
            },

            disabled: function() {
                return !list;
            },

            lock: function() {
                stack = undefined;
                if ( !memory ) {
                    self.disable();
                }
                return this;
            },

            locked: function() {
                return !stack;
            },

            fireWith: function( context, args ) {
                if ( list && ( !fired || stack ) ) {
                    args = args || [];
                    args = [ context, args.slice ? args.slice() : args ];
                    if ( firing ) {
                        stack.push( args );
                    } else {
                        fire( args );
                    }
                }
                return this;
            },

            fire: function() {
                self.fireWith( this, arguments );
                return this;
            },

            fired: function() {
                return !!fired;
            }
        };

    return self;
};
SA.extend({
    Deferred: function( func ) {
        var tuples = [

                [ "resolve", "done", SA.Callbacks("once memory"), "resolved" ],
                [ "reject", "fail", SA.Callbacks("once memory"), "rejected" ],
                [ "notify", "progress", SA.Callbacks("memory") ]
            ],
            state = "pending",
            promise = {
                state: function() {
                    return state;
                },
                always: function() {
                    deferred.done( arguments ).fail( arguments );
                    return this;
                },
                then: function( /* fnDone, fnFail, fnProgress */ ) {
                    var fns = arguments;
                    return SA.Deferred(function( newDefer ) {
                        SA.each( tuples, function( i, tuple ) {
                            var fn = SA.isFunction( fns[ i ] ) && fns[ i ];

                            deferred[ tuple[1] ](function() {
                                var returned = fn && fn.apply( this, arguments );
                                if ( returned && SA.isFunction( returned.promise ) ) {
                                    returned.promise()
                                        .done( newDefer.resolve )
                                        .fail( newDefer.reject )
                                        .progress( newDefer.notify );
                                } else {
                                    newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
                                }
                            });
                        });
                        fns = null;
                    }).promise();
                },

                promise: function( obj ) {
                    return obj != null ? SA.extend( obj, promise ) : promise;
                }
            },
            deferred = {};

        promise.pipe = promise.then;

        SA.each( tuples, function( i, tuple ) {
            var list = tuple[ 2 ],
                stateString = tuple[ 3 ];

            promise[ tuple[1] ] = list.add;

            if ( stateString ) {
                list.add(function() {

                    state = stateString;

                // [ reject_list | resolve_list ].disable; progress_list.lock
                }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
            }

            deferred[ tuple[0] ] = function() {
                deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
                return this;
            };
            deferred[ tuple[0] + "With" ] = list.fireWith;
        });

        promise.promise( deferred );

        if ( func ) {
            func.call( deferred, deferred );
        }

        return deferred;
    },

    when: function( subordinate /* , ..., subordinateN */ ) {
        var i = 0,
            resolveValues = slice.call( arguments ),
            length = resolveValues.length,

            remaining = length !== 1 || ( subordinate && SA.isFunction( subordinate.promise ) ) ? length : 0,

            deferred = remaining === 1 ? subordinate : SA.Deferred(),

            updateFunc = function( i, contexts, values ) {
                return function( value ) {
                    contexts[ i ] = this;
                    values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
                    if ( values === progressValues ) {
                        deferred.notifyWith( contexts, values );
                    } else if ( !( --remaining ) ) {
                        deferred.resolveWith( contexts, values );
                    }
                };
            },

            progressValues, progressContexts, resolveContexts;

        if ( length > 1 ) {
            progressValues = new Array( length );
            progressContexts = new Array( length );
            resolveContexts = new Array( length );
            for ( ; i < length; i++ ) {
                if ( resolveValues[ i ] && SA.isFunction( resolveValues[ i ].promise ) ) {
                    resolveValues[ i ].promise()
                        .done( updateFunc( i, resolveContexts, resolveValues ) )
                        .fail( deferred.reject )
                        .progress( updateFunc( i, progressContexts, progressValues ) );
                } else {
                    --remaining;
                }
            }
        }

        if ( !remaining ) {
            deferred.resolveWith( resolveContexts, resolveValues );
        }

        return deferred.promise();
    }
});

var readyList;
SA.fn.ready = function( fn ) {

    SA.ready.promise().done( fn );

    return this;
};
SA.extend({

    isReady: false,

    readyWait: 1,

    holdReady: function( hold ) {
        if ( hold ) {
            SA.readyWait++;
        } else {
            SA.ready( true );
        }
    },

    ready: function( wait ) {

        if ( wait === true ? --SA.readyWait : SA.isReady ) {
            return;
        }

        SA.isReady = true;

        if ( wait !== true && --SA.readyWait > 0 ) {
            return;
        }

        readyList.resolveWith( document, [ SA ] );

        if ( SA.fn.triggerHandler ) {
            SA( document ).triggerHandler( "ready" );
            SA( document ).off( "ready" );
        }
    }
});
function completed() {
    document.removeEventListener( "DOMContentLoaded", completed, false );
    window.removeEventListener( "load", completed, false );
    SA.ready();
}
SA.ready.promise = function( obj ) {
    if ( !readyList ) {

        readyList = SA.Deferred();

        if ( document.readyState === "complete" ) {

            setTimeout( SA.ready );

        } else {

            document.addEventListener( "DOMContentLoaded", completed, false );

            window.addEventListener( "load", completed, false );
        }
    }
    return readyList.promise( obj );
};

SA.ready.promise();

var access = SA.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
    var i = 0,
        len = elems.length,
        bulk = key == null;

    if ( SA.type( key ) === "object" ) {
        chainable = true;
        for ( i in key ) {
            SA.access( elems, fn, i, key[i], true, emptyGet, raw );
        }

    } else if ( value !== undefined ) {
        chainable = true;

        if ( !SA.isFunction( value ) ) {
            raw = true;
        }

        if ( bulk ) {

            if ( raw ) {
                fn.call( elems, value );
                fn = null;

            // ...except when executing function values
            } else {
                bulk = fn;
                fn = function( elem, key, value ) {
                    return bulk.call( SA( elem ), value );
                };
            }
        }

        if ( fn ) {
            for ( ; i < len; i++ ) {
                fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
            }
        }
    }

    return chainable ?
        elems :

        bulk ?
            fn.call( elems ) :
            len ? fn( elems[0], key ) : emptyGet;
};
SA.acceptData = function( owner ) {
    return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};
function Data() {

    Object.defineProperty( this.cache = {}, 0, {
        get: function() {
            return {};
        }
    });

    this.expando = SA.expando + Math.random();
}
Data.uid = 1;
Data.accepts = SA.acceptData;
Data.prototype = {
    key: function( owner ) {

        if ( !Data.accepts( owner ) ) {
            return 0;
        }

        var descriptor = {},

            unlock = owner[ this.expando ];

        if ( !unlock ) {
            unlock = Data.uid++;

            try {
                descriptor[ this.expando ] = { value: unlock };
                Object.defineProperties( owner, descriptor );

            } catch ( e ) {
                descriptor[ this.expando ] = unlock;
                SA.extend( owner, descriptor );
            }
        }

        if ( !this.cache[ unlock ] ) {
            this.cache[ unlock ] = {};
        }

        return unlock;
    },
    set: function( owner, data, value ) {
        var prop,

            unlock = this.key( owner ),
            cache = this.cache[ unlock ];

        if ( typeof data === "string" ) {
            cache[ data ] = value;

        } else {

            if ( SA.isEmptyObject( cache ) ) {
                SA.extend( this.cache[ unlock ], data );

            } else {
                for ( prop in data ) {
                    cache[ prop ] = data[ prop ];
                }
            }
        }
        return cache;
    },
    get: function( owner, key ) {

        var cache = this.cache[ this.key( owner ) ];

        return key === undefined ?
            cache : cache[ key ];
    },
    access: function( owner, key, value ) {
        var stored;

        //
        //   1. No key was specified
        //   2. A string key was specified, but no value provided
        //

        //
        //   1. The entire cache object
        //   2. The data stored at the key
        //
        if ( key === undefined ||
                ((key && typeof key === "string") && value === undefined) ) {

            stored = this.get( owner, key );

            return stored !== undefined ?
                stored : this.get( owner, SA.camelCase(key) );
        }

        // [*]When the key is not a string, or both a key and value

        //
        //   1. An object of properties
        //   2. A key and value
        //
        this.set( owner, key, value );

        return value !== undefined ? value : key;
    },
    remove: function( owner, key ) {
        var i, name, camel,
            unlock = this.key( owner ),
            cache = this.cache[ unlock ];

        if ( key === undefined ) {
            this.cache[ unlock ] = {};

        } else {

            if ( SA.isArray( key ) ) {

                name = key.concat( key.map( SA.camelCase ) );
            } else {
                camel = SA.camelCase( key );

                if ( key in cache ) {
                    name = [ key, camel ];
                } else {

                    name = camel;
                    name = name in cache ?
                        [ name ] : ( name.match( rnotwhite ) || [] );
                }
            }

            i = name.length;
            while ( i-- ) {
                delete cache[ name[ i ] ];
            }
        }
    },
    hasData: function( owner ) {
        return !SA.isEmptyObject(
            this.cache[ owner[ this.expando ] ] || {}
        );
    },
    discard: function( owner ) {
        if ( owner[ this.expando ] ) {
            delete this.cache[ owner[ this.expando ] ];
        }
    }
};
var data_priv = new Data();
var data_user = new Data();
var strundefined = typeof undefined;
var
    rkeyEvent = /^key/,
    rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
    rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
    rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
    return true;
}
function returnFalse() {
    return false;
}
function safeActiveElement() {
    try {
        return document.activeElement;
    } catch ( err ) { }
}
/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
SA.event = {
    global: {},
    add: function( elem, types, handler, data, selector ) {

        var handleObjIn, eventHandle, tmp,
            events, t, handleObj,
            special, handlers, type, namespaces, origType,
            elemData = data_priv.get( elem );

        if ( !elemData ) {
            return;
        }

        if ( handler.handler ) {
            handleObjIn = handler;
            handler = handleObjIn.handler;
            selector = handleObjIn.selector;
        }

        if ( !handler.guid ) {
            handler.guid = SA.guid++;
        }

        if ( !(events = elemData.events) ) {
            events = elemData.events = {};
        }
        if ( !(eventHandle = elemData.handle) ) {
            eventHandle = elemData.handle = function( e ) {

                return typeof SA !== strundefined && SA.event.triggered !== e.type ?
                    SA.event.dispatch.apply( elem, arguments ) : undefined;
            };
        }

        types = ( types || "" ).match( rnotwhite ) || [ "" ];
        t = types.length;
        while ( t-- ) {
            tmp = rtypenamespace.exec( types[t] ) || [];
            type = origType = tmp[1];
            namespaces = ( tmp[2] || "" ).split( "." ).sort();

            if ( !type ) {
                continue;
            }

            special = SA.event.special[ type ] || {};

            type = ( selector ? special.delegateType : special.bindType ) || type;

            special = SA.event.special[ type ] || {};

            handleObj = SA.extend({
                type: type,
                origType: origType,
                data: data,
                handler: handler,
                guid: handler.guid,
                selector: selector,
                needsContext: selector && SA.expr.match.needsContext.test( selector ),
                namespace: namespaces.join(".")
            }, handleObjIn );

            if ( !(handlers = events[ type ]) ) {
                handlers = events[ type ] = [];
                handlers.delegateCount = 0;

                if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
                    if ( elem.addEventListener ) {
                        elem.addEventListener( type, eventHandle, false );
                    }
                }
            }

            if ( special.add ) {
                special.add.call( elem, handleObj );

                if ( !handleObj.handler.guid ) {
                    handleObj.handler.guid = handler.guid;
                }
            }

            if ( selector ) {
                handlers.splice( handlers.delegateCount++, 0, handleObj );
            } else {
                handlers.push( handleObj );
            }

            SA.event.global[ type ] = true;
        }
    },

    remove: function( elem, types, handler, selector, mappedTypes ) {

        var j, origCount, tmp,
            events, t, handleObj,
            special, handlers, type, namespaces, origType,
            elemData = data_priv.hasData( elem ) && data_priv.get( elem );

        if ( !elemData || !(events = elemData.events) ) {
            return;
        }

        types = ( types || "" ).match( rnotwhite ) || [ "" ];
        t = types.length;
        while ( t-- ) {
            tmp = rtypenamespace.exec( types[t] ) || [];
            type = origType = tmp[1];
            namespaces = ( tmp[2] || "" ).split( "." ).sort();

            if ( !type ) {
                for ( type in events ) {
                    SA.event.remove( elem, type + types[ t ], handler, selector, true );
                }
                continue;
            }

            special = SA.event.special[ type ] || {};
            type = ( selector ? special.delegateType : special.bindType ) || type;
            handlers = events[ type ] || [];
            tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

            origCount = j = handlers.length;
            while ( j-- ) {
                handleObj = handlers[ j ];

                if ( ( mappedTypes || origType === handleObj.origType ) &&
                    ( !handler || handler.guid === handleObj.guid ) &&
                    ( !tmp || tmp.test( handleObj.namespace ) ) &&
                    ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
                    handlers.splice( j, 1 );

                    if ( handleObj.selector ) {
                        handlers.delegateCount--;
                    }
                    if ( special.remove ) {
                        special.remove.call( elem, handleObj );
                    }
                }
            }

            // (avoids potential for endless recursion during removal of special event handlers)
            if ( origCount && !handlers.length ) {
                if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
                    SA.removeEvent( elem, type, elemData.handle );
                }

                delete events[ type ];
            }
        }

        if ( SA.isEmptyObject( events ) ) {
            delete elemData.handle;
            data_priv.remove( elem, "events" );
        }
    },
    trigger: function( event, data, elem, onlyHandlers ) {

        var i, cur, tmp, bubbleType, ontype, handle, special,
            eventPath = [ elem || document ],
            type = hasOwn.call( event, "type" ) ? event.type : event,
            namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

        cur = tmp = elem = elem || document;

        if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
            return;
        }

        if ( rfocusMorph.test( type + SA.event.triggered ) ) {
            return;
        }

        if ( type.indexOf(".") >= 0 ) {

            namespaces = type.split(".");
            type = namespaces.shift();
            namespaces.sort();
        }
        ontype = type.indexOf(":") < 0 && "on" + type;

        event = event[ SA.expando ] ?
            event :
            new SA.Event( type, typeof event === "object" && event );

        event.isTrigger = onlyHandlers ? 2 : 3;
        event.namespace = namespaces.join(".");
        event.namespace_re = event.namespace ?
            new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
            null;

        event.result = undefined;
        if ( !event.target ) {
            event.target = elem;
        }

        data = data == null ?
            [ event ] :
            SA.makeArray( data, [ event ] );

        special = SA.event.special[ type ] || {};
        if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
            return;
        }

        if ( !onlyHandlers && !special.noBubble && !SA.isWindow( elem ) ) {

            bubbleType = special.delegateType || type;
            if ( !rfocusMorph.test( bubbleType + type ) ) {
                cur = cur.parentNode;
            }
            for ( ; cur; cur = cur.parentNode ) {
                eventPath.push( cur );
                tmp = cur;
            }

            if ( tmp === (elem.ownerDocument || document) ) {
                eventPath.push( tmp.defaultView || tmp.parentWindow || window );
            }
        }

        i = 0;
        while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

            event.type = i > 1 ?
                bubbleType :
                special.bindType || type;

            handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
            if ( handle ) {
                handle.apply( cur, data );
            }

            handle = ontype && cur[ ontype ];
            if ( handle && handle.apply && SA.acceptData( cur ) ) {
                event.result = handle.apply( cur, data );
                if ( event.result === false ) {
                    event.preventDefault();
                }
            }
        }
        event.type = type;

        if ( !onlyHandlers && !event.isDefaultPrevented() ) {

            if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
                SA.acceptData( elem ) ) {

                if ( ontype && SA.isFunction( elem[ type ] ) && !SA.isWindow( elem ) ) {

                    tmp = elem[ ontype ];

                    if ( tmp ) {
                        elem[ ontype ] = null;
                    }

                    SA.event.triggered = type;
                    elem[ type ]();
                    SA.event.triggered = undefined;

                    if ( tmp ) {
                        elem[ ontype ] = tmp;
                    }
                }
            }
        }

        return event.result;
    },
    dispatch: function( event ) {

        event = SA.event.fix( event );

        var i, j, ret, matched, handleObj,
            handlerQueue = [],
            args = slice.call( arguments ),
            handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
            special = SA.event.special[ event.type ] || {};

        args[0] = event;
        event.delegateTarget = this;

        if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
            return;
        }

        handlerQueue = SA.event.handlers.call( this, event, handlers );

        i = 0;
        while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
            event.currentTarget = matched.elem;

            j = 0;
            while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

                // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
                if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

                    event.handleObj = handleObj;
                    event.data = handleObj.data;

                    ret = ( (SA.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
                            .apply( matched.elem, args );

                    if ( ret !== undefined ) {
                        if ( (event.result = ret) === false ) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }
                }
            }
        }

        if ( special.postDispatch ) {
            special.postDispatch.call( this, event );
        }

        return event.result;
    },
    handlers: function( event, handlers ) {
        var i, matches, sel, handleObj,
            handlerQueue = [],
            delegateCount = handlers.delegateCount,
            cur = event.target;

        if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

            for ( ; cur !== this; cur = cur.parentNode || this ) {

                if ( cur.disabled !== true || event.type !== "click" ) {
                    matches = [];
                    for ( i = 0; i < delegateCount; i++ ) {
                        handleObj = handlers[ i ];

                        sel = handleObj.selector + " ";

                        if ( matches[ sel ] === undefined ) {
                            matches[ sel ] = handleObj.needsContext ?
                                SA( sel, this ).index( cur ) >= 0 :
                                SA.find( sel, this, null, [ cur ] ).length;
                        }
                        if ( matches[ sel ] ) {
                            matches.push( handleObj );
                        }
                    }
                    if ( matches.length ) {
                        handlerQueue.push({ elem: cur, handlers: matches });
                    }
                }
            }
        }

        if ( delegateCount < handlers.length ) {
            handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
        }

        return handlerQueue;
    },

    props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    fixHooks: {},
    fix: function( event ) {
        if ( event[ SA.expando ] ) {
            return event;
        }

        var i, prop, copy,
            type = event.type,
            originalEvent = event,
            fixHook = this.fixHooks[ type ];

        if ( !fixHook ) {
            this.fixHooks[ type ] = fixHook =
                rmouseEvent.test( type ) ? this.mouseHooks :
                rkeyEvent.test( type ) ? this.keyHooks :
                {};
        }
        copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

        event = new SA.Event( originalEvent );

        i = copy.length;
        while ( i-- ) {
            prop = copy[ i ];
            event[ prop ] = originalEvent[ prop ];
        }

        if ( !event.target ) {
            event.target = document;
        }

        if ( event.target.nodeType === 3 ) {
            event.target = event.target.parentNode;
        }

        return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
    },
    special: {
        load: {

            noBubble: true
        }
    }
};

SA.removeEvent = function( elem, type, handle ) {
    if ( elem.removeEventListener ) {
        elem.removeEventListener( type, handle, false );
    }
};
SA.Event = function( src, props ) {

    if ( !(this instanceof SA.Event) ) {
        return new SA.Event( src, props );
    }

    if ( src && src.type ) {
        this.originalEvent = src;
        this.type = src.type;

        this.isDefaultPrevented = src.defaultPrevented ||
                src.defaultPrevented === undefined &&

                src.returnValue === false ?
            returnTrue :
            returnFalse;

    } else {
        this.type = src;
    }

    if ( props ) {
        SA.extend( this, props );
    }

    this.timeStamp = src && src.timeStamp || SA.now();

    this[ SA.expando ] = true;
};
SA.Event.prototype = {
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,

    preventDefault: function() {
        var e = this.originalEvent;

        this.isDefaultPrevented = returnTrue;

        if ( e && e.preventDefault ) {
            e.preventDefault();
        }
    },
    stopPropagation: function() {
        var e = this.originalEvent;

        this.isPropagationStopped = returnTrue;

        if ( e && e.stopPropagation ) {
            e.stopPropagation();
        }
    },
    stopImmediatePropagation: function() {
        var e = this.originalEvent;

        this.isImmediatePropagationStopped = returnTrue;

        if ( e && e.stopImmediatePropagation ) {
            e.stopImmediatePropagation();
        }

        this.stopPropagation();
    }
};
SA.fn.extend({
    on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
        var origFn, type;

        if ( typeof types === "object" ) {
            // ( types-Object, selector, data )
            if ( typeof selector !== "string" ) {
                // ( types-Object, data )
                data = data || selector;
                selector = undefined;
            }
            for ( type in types ) {
                this.on( type, selector, data, types[ type ], one );
            }
            return this;
        }

        if ( data == null && fn == null ) {
            // ( types, fn )
            fn = selector;
            data = selector = undefined;
        } else if ( fn == null ) {
            if ( typeof selector === "string" ) {
                // ( types, selector, fn )
                fn = data;
                data = undefined;
            } else {
                // ( types, data, fn )
                fn = data;
                data = selector;
                selector = undefined;
            }
        }
        if ( fn === false ) {
            fn = returnFalse;
        } else if ( !fn ) {
            return this;
        }

        if ( one === 1 ) {
            origFn = fn;
            fn = function( event ) {

                SA().off( event );
                return origFn.apply( this, arguments );
            };

            fn.guid = origFn.guid || ( origFn.guid = SA.guid++ );
        }
        return this.each( function() {
            SA.event.add( this, types, fn, data, selector );
        });
    },
    one: function( types, selector, data, fn ) {
        return this.on( types, selector, data, fn, 1 );
    },
    off: function( types, selector, fn ) {
        var handleObj, type;
        if ( types && types.preventDefault && types.handleObj ) {
            // ( event )  dispatched SA.Event
            handleObj = types.handleObj;
            SA( types.delegateTarget ).off(
                handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
                handleObj.selector,
                handleObj.handler
            );
            return this;
        }
        if ( typeof types === "object" ) {
            // ( types-object [, selector] )
            for ( type in types ) {
                this.off( type, selector, types[ type ] );
            }
            return this;
        }
        if ( selector === false || typeof selector === "function" ) {
            // ( types [, fn] )
            fn = selector;
            selector = undefined;
        }
        if ( fn === false ) {
            fn = returnFalse;
        }
        return this.each(function() {
            SA.event.remove( this, types, fn, selector );
        });
    },
    trigger: function( type, data ) {
        return this.each(function() {
            SA.event.trigger( type, data, this );
        });
    },
    triggerHandler: function( type, data ) {
        var elem = this[0];
        if ( elem ) {
            return SA.event.trigger( type, data, elem, true );
        }
    }
});
function getAll( context, tag ) {
    var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
            context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
            [];

    return tag === undefined || tag && SA.nodeName( context, tag ) ?
        SA.merge( [ context ], ret ) :
        ret;
}
SA.extend({
    cleanData: function( elems ) {
        var data, elem, type, key,
            special = SA.event.special,
            i = 0;

        for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
            if ( SA.acceptData( elem ) ) {
                key = elem[ data_priv.expando ];

                if ( key && (data = data_priv.cache[ key ]) ) {
                    if ( data.events ) {
                        for ( type in data.events ) {
                            if ( special[ type ] ) {
                                SA.event.remove( elem, type );

                            } else {
                                SA.removeEvent( elem, type, data.handle );
                            }
                        }
                    }
                    if ( data_priv.cache[ key ] ) {

                        delete data_priv.cache[ key ];
                    }
                }
            }

            delete data_user.cache[ elem[ data_user.expando ] ];
        }
    }
});
SA.fn.extend({
    remove: function( selector, keepData /* Internal Use Only */ ) {
        var elem,
            elems = selector ? SA.filter( selector, this ) : this,
            i = 0;

        for ( ; (elem = elems[i]) != null; i++ ) {
            if ( !keepData && elem.nodeType === 1 ) {
                SA.cleanData( getAll( elem ) );
            }

            if ( elem.parentNode ) {
                if ( keepData && SA.contains( elem.ownerDocument, elem ) ) {
                    setGlobalEval( getAll( elem, "script" ) );
                }
                elem.parentNode.removeChild( elem );
            }
        }
        return this;
    },
});
SA.fn.extend({
    prop: function( name, value ) {
        return access( this, SA.prop, name, value, arguments.length > 1 );
    },

    removeProp: function( name ) {
        return this.each(function() {
            delete this[ SA.propFix[ name ] || name ];
        });
    }
});
SA.extend({
    propFix: {
        "for": "htmlFor",
        "class": "className"
    },

    prop: function( elem, name, value ) {
        var ret, hooks, notxml,
            nType = elem.nodeType;

        if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
            return;
        }

        notxml = nType !== 1 || !SA.isXMLDoc( elem );

        if ( notxml ) {

            name = SA.propFix[ name ] || name;
            hooks = SA.propHooks[ name ];
        }

        if ( value !== undefined ) {
            return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
                ret :
                ( elem[ name ] = value );

        } else {
            return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
                ret :
                elem[ name ];
        }
    },

    propHooks: {
        tabIndex: {
            get: function( elem ) {
                return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
                    elem.tabIndex :
                    -1;
            }
        }
    }
});
var nonce = SA.now();
var rquery = (/\?/);

SA.parseJSON = function( data ) {
    return JSON.parse( data + "" );
};

SA.parseXML = function( data ) {
    var xml, tmp;
    if ( !data || typeof data !== "string" ) {
        return null;
    }

    try {
        tmp = new DOMParser();
        xml = tmp.parseFromString( data, "text/xml" );
    } catch ( e ) {
        xml = undefined;
    }

    if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
        SA.error( "Invalid XML: " + data );
    }
    return xml;
};
var

    ajaxLocParts,
    ajaxLocation,

    rhash = /#.*$/,
    rts = /([?&])_=[^&]*/,
    rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
    // #7653, #8125, #8152: local protocol detection
    rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    rnoContent = /^(?:GET|HEAD)$/,
    rprotocol = /^\/\//,
    rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

    /* Prefilters
     * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
     * 2) These are called:
     *    - BEFORE asking for a transport
     *    - AFTER param serialization (s.data is a string if s.processData is true)
     * 3) key is the dataType
     * 4) the catchall symbol "*" can be used
     * 5) execution will start with transport dataType and THEN continue down to "*" if needed
     */
    prefilters = {},

    /* Transports bindings
     * 1) key is the dataType
     * 2) the catchall symbol "*" can be used
     * 3) selection will start with transport dataType and THEN go to "*" if needed
     */
    transports = {},

    allTypes = "*/".concat("*");
// #8138, IE may throw an exception when accessing

try {
    ajaxLocation = location.href;
} catch( e ) {

    ajaxLocation = document.createElement( "a" );
    ajaxLocation.href = "";
    ajaxLocation = ajaxLocation.href;
}

ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

function addToPrefiltersOrTransports( structure ) {

    return function( dataTypeExpression, func ) {

        if ( typeof dataTypeExpression !== "string" ) {
            func = dataTypeExpression;
            dataTypeExpression = "*";
        }

        var dataType,
            i = 0,
            dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

        if ( SA.isFunction( func ) ) {

            while ( (dataType = dataTypes[i++]) ) {

                if ( dataType[0] === "+" ) {
                    dataType = dataType.slice( 1 ) || "*";
                    (structure[ dataType ] = structure[ dataType ] || []).unshift( func );

                } else {
                    (structure[ dataType ] = structure[ dataType ] || []).push( func );
                }
            }
        }
    };
}

function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

    var inspected = {},
        seekingTransport = ( structure === transports );

    function inspect( dataType ) {
        var selected;
        inspected[ dataType ] = true;
        SA.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
            var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
            if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
                options.dataTypes.unshift( dataTypeOrTransport );
                inspect( dataTypeOrTransport );
                return false;
            } else if ( seekingTransport ) {
                return !( selected = dataTypeOrTransport );
            }
        });
        return selected;
    }

    return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

function ajaxExtend( target, src ) {
    var key, deep,
        flatOptions = SA.ajaxSettings.flatOptions || {};

    for ( key in src ) {
        if ( src[ key ] !== undefined ) {
            ( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
        }
    }
    if ( deep ) {
        SA.extend( true, target, deep );
    }

    return target;
}
/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

    var ct, type, finalDataType, firstDataType,
        contents = s.contents,
        dataTypes = s.dataTypes;

    while ( dataTypes[ 0 ] === "*" ) {
        dataTypes.shift();
        if ( ct === undefined ) {
            ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
        }
    }

    if ( ct ) {
        for ( type in contents ) {
            if ( contents[ type ] && contents[ type ].test( ct ) ) {
                dataTypes.unshift( type );
                break;
            }
        }
    }

    if ( dataTypes[ 0 ] in responses ) {
        finalDataType = dataTypes[ 0 ];
    } else {

        for ( type in responses ) {
            if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
                finalDataType = type;
                break;
            }
            if ( !firstDataType ) {
                firstDataType = type;
            }
        }

        finalDataType = finalDataType || firstDataType;
    }

    if ( finalDataType ) {
        if ( finalDataType !== dataTypes[ 0 ] ) {
            dataTypes.unshift( finalDataType );
        }
        return responses[ finalDataType ];
    }
}
/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
    var conv2, current, conv, tmp, prev,
        converters = {},

        dataTypes = s.dataTypes.slice();

    if ( dataTypes[ 1 ] ) {
        for ( conv in s.converters ) {
            converters[ conv.toLowerCase() ] = s.converters[ conv ];
        }
    }

    current = dataTypes.shift();

    while ( current ) {

        if ( s.responseFields[ current ] ) {
            jqXHR[ s.responseFields[ current ] ] = response;
        }

        if ( !prev && isSuccess && s.dataFilter ) {
            response = s.dataFilter( response, s.dataType );
        }

        prev = current;
        current = dataTypes.shift();

        if ( current ) {

            if ( current === "*" ) {

                current = prev;

            } else if ( prev !== "*" && prev !== current ) {

                conv = converters[ prev + " " + current ] || converters[ "* " + current ];

                if ( !conv ) {
                    for ( conv2 in converters ) {

                        tmp = conv2.split( " " );
                        if ( tmp[ 1 ] === current ) {

                            conv = converters[ prev + " " + tmp[ 0 ] ] ||
                                converters[ "* " + tmp[ 0 ] ];
                            if ( conv ) {

                                if ( conv === true ) {
                                    conv = converters[ conv2 ];

                                } else if ( converters[ conv2 ] !== true ) {
                                    current = tmp[ 0 ];
                                    dataTypes.unshift( tmp[ 1 ] );
                                }
                                break;
                            }
                        }
                    }
                }

                if ( conv !== true ) {

                    if ( conv && s[ "throws" ] ) {
                        response = conv( response );
                    } else {
                        try {
                            response = conv( response );
                        } catch ( e ) {
                            return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
                        }
                    }
                }
            }
        }
    }

    return { state: "success", data: response };
}
SA.extend({

    active: 0,

    lastModified: {},
    etag: {},

    ajaxSettings: {
        url: ajaxLocation,
        type: "GET",
        isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
        global: true,
        processData: true,
        async: true,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        /*
        timeout: 0,
        data: null,
        dataType: null,
        username: null,
        password: null,
        cache: null,
        throws: false,
        traditional: false,
        headers: {},
        */

        accepts: {
            "*": allTypes,
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript"
        },

        contents: {
            xml: /xml/,
            html: /html/,
            json: /json/
        },

        responseFields: {
            xml: "responseXML",
            text: "responseText",
            json: "responseJSON"
        },

        converters: {

            "* text": String,

            "text html": true,

            "text json": SA.parseJSON,

            "text xml": SA.parseXML
        },

        flatOptions: {
            url: true,
            context: true
        }
    },

    ajaxSetup: function( target, settings ) {
        return settings ?

            ajaxExtend( ajaxExtend( target, SA.ajaxSettings ), settings ) :

            ajaxExtend( SA.ajaxSettings, target );
    },

    ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
    ajaxTransport: addToPrefiltersOrTransports( transports ),

    ajax: function( url, options ) {

        if ( typeof url === "object" ) {
            options = url;
            url = undefined;
        }

        options = options || {};

        var transport,

            cacheURL,

            responseHeadersString,
            responseHeaders,

            timeoutTimer,

            parts,

            fireGlobals,

            i,

            s = SA.ajaxSetup( {}, options ),

            callbackContext = s.context || s,

            globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.sa ) ?
                SA( callbackContext ) :
                SA.event,

            deferred = SA.Deferred(),
            completeDeferred = SA.Callbacks("once memory"),

            statusCode = s.statusCode || {},

            requestHeaders = {},
            requestHeadersNames = {},

            state = 0,

            strAbort = "canceled",

            jqXHR = {
                readyState: 0,

                getResponseHeader: function( key ) {
                    var match;
                    if ( state === 2 ) {
                        if ( !responseHeaders ) {
                            responseHeaders = {};
                            while ( (match = rheaders.exec( responseHeadersString )) ) {
                                responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
                            }
                        }
                        match = responseHeaders[ key.toLowerCase() ];
                    }
                    return match == null ? null : match;
                },

                getAllResponseHeaders: function() {
                    return state === 2 ? responseHeadersString : null;
                },

                setRequestHeader: function( name, value ) {
                    var lname = name.toLowerCase();
                    if ( !state ) {
                        name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
                        requestHeaders[ name ] = value;
                    }
                    return this;
                },

                overrideMimeType: function( type ) {
                    if ( !state ) {
                        s.mimeType = type;
                    }
                    return this;
                },

                statusCode: function( map ) {
                    var code;
                    if ( map ) {
                        if ( state < 2 ) {
                            for ( code in map ) {

                                statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
                            }
                        } else {

                            jqXHR.always( map[ jqXHR.status ] );
                        }
                    }
                    return this;
                },

                abort: function( statusText ) {
                    var finalText = statusText || strAbort;
                    if ( transport ) {
                        transport.abort( finalText );
                    }
                    done( 0, finalText );
                    return this;
                }
            };

        deferred.promise( jqXHR ).complete = completeDeferred.add;
        jqXHR.success = jqXHR.done;
        jqXHR.error = jqXHR.fail;

        s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
            .replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

        s.type = options.method || options.type || s.method || s.type;

        s.dataTypes = SA.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

        if ( s.crossDomain == null ) {
            parts = rurl.exec( s.url.toLowerCase() );
            s.crossDomain = !!( parts &&
                ( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
                    ( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
                        ( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
            );
        }

        if ( s.data && s.processData && typeof s.data !== "string" ) {
            s.data = SA.param( s.data, s.traditional );
        }

        inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

        if ( state === 2 ) {
            return jqXHR;
        }

        fireGlobals = s.global;

        if ( fireGlobals && SA.active++ === 0 ) {
            SA.event.trigger("ajaxStart");
        }

        s.type = s.type.toUpperCase();

        s.hasContent = !rnoContent.test( s.type );

        cacheURL = s.url;

        if ( !s.hasContent ) {

            if ( s.data ) {
                cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
                // #9682: remove data so that it's not used in an eventual retry
                delete s.data;
            }

            if ( s.cache === false ) {
                s.url = rts.test( cacheURL ) ?

                    cacheURL.replace( rts, "$1_=" + nonce++ ) :

                    cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
            }
        }

        if ( s.ifModified ) {
            if ( SA.lastModified[ cacheURL ] ) {
                jqXHR.setRequestHeader( "If-Modified-Since", SA.lastModified[ cacheURL ] );
            }
            if ( SA.etag[ cacheURL ] ) {
                jqXHR.setRequestHeader( "If-None-Match", SA.etag[ cacheURL ] );
            }
        }

        if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
            jqXHR.setRequestHeader( "Content-Type", s.contentType );
        }

        jqXHR.setRequestHeader(
            "Accept",
            s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
                s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
                s.accepts[ "*" ]
        );

        for ( i in s.headers ) {
            jqXHR.setRequestHeader( i, s.headers[ i ] );
        }

        if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

            return jqXHR.abort();
        }

        strAbort = "abort";

        for ( i in { success: 1, error: 1, complete: 1 } ) {
            jqXHR[ i ]( s[ i ] );
        }

        transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

        if ( !transport ) {
            done( -1, "No Transport" );
        } else {
            jqXHR.readyState = 1;

            if ( fireGlobals ) {
                globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
            }

            if ( s.async && s.timeout > 0 ) {
                timeoutTimer = setTimeout(function() {
                    jqXHR.abort("timeout");
                }, s.timeout );
            }

            try {
                state = 1;
                transport.send( requestHeaders, done );
            } catch ( e ) {

                if ( state < 2 ) {
                    done( -1, e );

                } else {
                    throw e;
                }
            }
        }

        function done( status, nativeStatusText, responses, headers ) {
            var isSuccess, success, error, response, modified,
                statusText = nativeStatusText;

            if ( state === 2 ) {
                return;
            }

            state = 2;

            if ( timeoutTimer ) {
                clearTimeout( timeoutTimer );
            }

            // (no matter how long the jqXHR object will be used)
            transport = undefined;

            responseHeadersString = headers || "";

            jqXHR.readyState = status > 0 ? 4 : 0;

            isSuccess = status >= 200 && status < 300 || status === 304;

            if ( responses ) {
                response = ajaxHandleResponses( s, jqXHR, responses );
            }

            response = ajaxConvert( s, response, jqXHR, isSuccess );

            if ( isSuccess ) {

                if ( s.ifModified ) {
                    modified = jqXHR.getResponseHeader("Last-Modified");
                    if ( modified ) {
                        SA.lastModified[ cacheURL ] = modified;
                    }
                    modified = jqXHR.getResponseHeader("etag");
                    if ( modified ) {
                        SA.etag[ cacheURL ] = modified;
                    }
                }

                if ( status === 204 || s.type === "HEAD" ) {
                    statusText = "nocontent";

                } else if ( status === 304 ) {
                    statusText = "notmodified";

                } else {
                    statusText = response.state;
                    success = response.data;
                    error = response.error;
                    isSuccess = !error;
                }
            } else {

                error = statusText;
                if ( status || !statusText ) {
                    statusText = "error";
                    if ( status < 0 ) {
                        status = 0;
                    }
                }
            }

            jqXHR.status = status;
            jqXHR.statusText = ( nativeStatusText || statusText ) + "";

            if ( isSuccess ) {
                deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
            } else {
                deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
            }

            jqXHR.statusCode( statusCode );
            statusCode = undefined;

            if ( fireGlobals ) {
                globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
                    [ jqXHR, s, isSuccess ? success : error ] );
            }

            completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

            if ( fireGlobals ) {
                globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

                if ( !( --SA.active ) ) {
                    SA.event.trigger("ajaxStop");
                }
            }
        }

        return jqXHR;
    },

    getJSON: function( url, data, callback ) {
        return SA.get( url, data, callback, "json" );
    },

    getScript: function( url, callback ) {
        return SA.get( url, undefined, callback, "script" );
    }
});
SA.each( [ "get", "post" ], function( i, method ) {
    SA[ method ] = function( url, data, callback, type ) {

        if ( SA.isFunction( data ) ) {
            type = type || callback;
            callback = data;
            data = undefined;
        }

        return SA.ajax({
            url: url,
            type: method,
            dataType: type,
            data: data,
            success: callback
        });
    };
});

SA.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
    SA.fn[ type ] = function( fn ) {
        return this.on( type, fn );
    };
});
SA._evalUrl = function( url ) {
    return SA.ajax({
        url: url,
        type: "GET",
        dataType: "script",
        async: false,
        global: false,
        "throws": true
    });
};
SA.fn.extend({
    wrapAll: function( html ) {
        var wrap;

        if ( SA.isFunction( html ) ) {
            return this.each(function( i ) {
                SA( this ).wrapAll( html.call(this, i) );
            });
        }

        if ( this[ 0 ] ) {

            wrap = SA( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

            if ( this[ 0 ].parentNode ) {
                wrap.insertBefore( this[ 0 ] );
            }

            wrap.map(function() {
                var elem = this;

                while ( elem.firstElementChild ) {
                    elem = elem.firstElementChild;
                }

                return elem;
            }).append( this );
        }

        return this;
    },

    wrapInner: function( html ) {
        if ( SA.isFunction( html ) ) {
            return this.each(function( i ) {
                SA( this ).wrapInner( html.call(this, i) );
            });
        }

        return this.each(function() {
            var self = SA( this ),
                contents = self.contents();

            if ( contents.length ) {
                contents.wrapAll( html );

            } else {
                self.append( html );
            }
        });
    },

    wrap: function( html ) {
        var isFunction = SA.isFunction( html );

        return this.each(function( i ) {
            SA( this ).wrapAll( isFunction ? html.call(this, i) : html );
        });
    },

    unwrap: function() {
        return this.parent().each(function() {
            if ( !SA.nodeName( this, "body" ) ) {
                SA( this ).replaceWith( this.childNodes );
            }
        }).end();
    }
});
SA.ajaxSettings.xhr = function() {
    try {
        return new XMLHttpRequest();
    } catch( e ) {}
};
var xhrId = 0,
    xhrCallbacks = {},
    xhrSuccessStatus = {

        0: 200,

        // #1450: sometimes IE returns 1223 when it should be 204
        1223: 204
    },
    xhrSupported = SA.ajaxSettings.xhr();

if ( window.ActiveXObject ) {
    SA( window ).on( "unload", function() {
        for ( var key in xhrCallbacks ) {
            xhrCallbacks[ key ]();
        }
    });
}
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;
SA.ajaxTransport(function( options ) {
    var callback;

    if ( support.cors || xhrSupported && !options.crossDomain ) {
        return {
            send: function( headers, complete ) {
                var i,
                    xhr = options.xhr(),
                    id = ++xhrId;

                xhr.open( options.type, options.url, options.async, options.username, options.password );

                if ( options.xhrFields ) {
                    for ( i in options.xhrFields ) {
                        xhr[ i ] = options.xhrFields[ i ];
                    }
                }

                if ( options.mimeType && xhr.overrideMimeType ) {
                    xhr.overrideMimeType( options.mimeType );
                }

                // (it can always be set on a per-request basis or even using ajaxSetup)

                if ( !options.crossDomain && !headers["X-Requested-With"] ) {
                    headers["X-Requested-With"] = "XMLHttpRequest";
                }

                for ( i in headers ) {
                    xhr.setRequestHeader( i, headers[ i ] );
                }

                callback = function( type ) {
                    return function() {
                        if ( callback ) {
                            delete xhrCallbacks[ id ];
                            callback = xhr.onload = xhr.onerror = null;

                            if ( type === "abort" ) {
                                xhr.abort();
                            } else if ( type === "error" ) {
                                complete(

                                    xhr.status,
                                    xhr.statusText
                                );
                            } else {
                                complete(
                                    xhrSuccessStatus[ xhr.status ] || xhr.status,
                                    xhr.statusText,

                                    // (#11426)
                                    typeof xhr.responseText === "string" ? {
                                        text: xhr.responseText
                                    } : undefined,
                                    xhr.getAllResponseHeaders()
                                );
                            }
                        }
                    };
                };

                xhr.onload = callback();
                xhr.onerror = callback("error");

                callback = xhrCallbacks[ id ] = callback("abort");

                try {

                    xhr.send( options.hasContent && options.data || null );
                } catch ( e ) {
                    // #14683: Only rethrow if this hasn't been notified as an error yet
                    if ( callback ) {
                        throw e;
                    }
                }
            },

            abort: function() {
                if ( callback ) {
                    callback();
                }
            }
        };
    }
});

SA.ajaxSetup({
    accepts: {
        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
        script: /(?:java|ecma)script/
    },
    converters: {
        "text script": function( text ) {
            SA.globalEval( text );
            return text;
        }
    }
});

SA.ajaxPrefilter( "script", function( s ) {
    if ( s.cache === undefined ) {
        s.cache = false;
    }
    if ( s.crossDomain ) {
        s.type = "GET";
    }
});

SA.ajaxTransport( "script", function( s ) {

    if ( s.crossDomain ) {
        var script, callback;
        return {
            send: function( _, complete ) {
                script = SA("<script>").prop({
                    async: true,
                    charset: s.scriptCharset,
                    src: s.url
                }).on(
                    "load error",
                    callback = function( evt ) {
                        script.remove();
                        callback = null;
                        if ( evt ) {
                            complete( evt.type === "error" ? 404 : 200, evt.type );
                        }
                    }
                );
                document.head.appendChild( script[ 0 ] );
            },
            abort: function() {
                if ( callback ) {
                    callback();
                }
            }
        };
    }
});
var oldCallbacks = [],
    rjsonp = /(=)\?(?=&|$)|\?\?/;

SA.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
        var callback = oldCallbacks.pop() || ( SA.expando + "_" + ( nonce++ ) );
        this[ callback ] = true;
        return callback;
    }
});

SA.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

    var callbackName, overwritten, responseContainer,
        jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
            "url" :
            typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
        );

    if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

        callbackName = s.jsonpCallback = SA.isFunction( s.jsonpCallback ) ?
            s.jsonpCallback() :
            s.jsonpCallback;

        if ( jsonProp ) {
            s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
        } else if ( s.jsonp !== false ) {
            s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
        }

        s.converters["script json"] = function() {
            if ( !responseContainer ) {
                SA.error( callbackName + " was not called" );
            }
            return responseContainer[ 0 ];
        };

        s.dataTypes[ 0 ] = "json";

        overwritten = window[ callbackName ];
        window[ callbackName ] = function() {
            responseContainer = arguments;
        };

        jqXHR.always(function() {

            window[ callbackName ] = overwritten;

            if ( s[ callbackName ] ) {

                s.jsonpCallback = originalSettings.jsonpCallback;

                oldCallbacks.push( callbackName );
            }

            if ( responseContainer && SA.isFunction( overwritten ) ) {
                overwritten( responseContainer[ 0 ] );
            }

            responseContainer = overwritten = undefined;
        });

        return "script";
    }
});
SA.parseHTML = function( data, context, keepScripts ) {
    if ( !data || typeof data !== "string" ) {
        return null;
    }
    if ( typeof context === "boolean" ) {
        keepScripts = context;
        context = false;
    }
    context = context || document;

    var parsed = rsingleTag.exec( data ),
        scripts = !keepScripts && [];
    if ( parsed ) {
        return [ context.createElement( parsed[1] ) ];
    }
    parsed = SA.buildFragment( [ data ], context, scripts );
    if ( scripts && scripts.length ) {
        SA( scripts ).remove();
    }
    return SA.merge( [], parsed.childNodes );
};
var _SA = window.SA,
    _sAjax = window.sAjax;
SA.noConflict = function( deep ) {
    if ( window.sAjax === SA ) { window.sAjax = _sAjax; }
    if ( deep && window.SA === SA ) { window.SA = _SA; }
    return SA;
};
if ( typeof noGlobal === strundefined ) {
    window.SA = window.sAjax = SA;
}
return SA;
}));
