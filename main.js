// Nodes wrapper

var prime = require("prime/prime"),
    array = require("prime/es5/array")

// Node

var instances = {}

var Node = prime({

    constructor: function(node){
        this.n = node;
    },
    
    node: function(i){
        return i ? null : this.n;
    },

    nodes: function(s, e){
        return [this.n].slice(s, e)
    },

    count: function(){
        return 1
    },

    handle: function(ƒ){
        var buffer = []
        var res = ƒ.call(this, this.n, 0, buffer)
        if (res != null && res !== false && res !== true) buffer.push(res)
        return buffer
    }

});

// Nodes

var Nodes = prime({

    inherits: Node,
    
    node: function(i){
        var node = this.n[i == null ? 0 : i]
        return node ? node : null
    },

    nodes: function(s, e){
        return array.slice(this.n, s, e)
    },

    count: function(){
        return this.n.length
    },

    handle: function(ƒ){
        var buffer = [], nodes = this.n
        for (var i = 0, l = nodes.length; i < l; i++){
            var node = nodes[i],
                res = ƒ.call(new Node(node), node, i, buffer)
            if (res === false || res === true) break
            if (res != null) buffer.push(res)
        }
        return buffer
    }

});

var $ = prime({constructor: function(nodes){
    if (nodes == null) return null
    if (nodes instanceof Nodes || nodes instanceof Node) return nodes

    if (typeof nodes === "string"){
        nodes = $.querySelectorAll(document, nodes)
        if (nodes == null) return null
    }

    var len = nodes.length

    if (len == null) return new Node(nodes)
    if (len === 1) return new Node(nodes[0])
    else if (len === 0) return null
    return new Nodes(nodes)
}})

Nodes.prototype = Node.prototype = $.prototype

$.querySelectorAll = function(context, selector){
    return context.querySelectorAll ? context.querySelectorAll(selector) : null
}

$.querySelector = function(context, selector){
    return context.querySelector ? context.querySelector(selector) : null
}

module.exports = $
