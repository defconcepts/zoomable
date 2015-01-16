# draggable

A customisable vanilla js implementation for making DOM element "draggable"

At 3Kb draggable isn't too big considering it can handle various UI interaction and has touch support.

## demo

 A simple demo of making a draggable div can be seen [here](http://jsfiddle.net/PvDLp/8/).


##usage
Use with or without [component package manager](https://github.com/component/component).
Examples of all behaviours can be seen in the [demo](http://jsfiddle.net/PvDLp/6/) or in the [example](https://github.com/jh3y/draggable/blob/master/example.html) page.
###use with [component package manager](https://github.com/component/component)
####installation
Install with [component(1)](http://component.io):

	$ component install jh3y/draggable

###use
simply create an element and then make it a draggable

	var draggable = require('draggable');//ONLY REQUIRED IF USING COMPONENT PACKAGE MANAGER
	var element = document.querySelector('.myDraggable');
	element.style.height = '50px';
	element.style.width = '50px';
	element.style.background = 'red';
	var myDrag = new draggable(element);

an example of passing in options for pens:

	var myPennedDrag = new draggable(element, {
		pens: document.querySelector('.pen')
	});

###use without component package manager
simply include the standalone version of [draggable](https://github.com/jh3y/tab/blob/master/jh3y-draggable.js) and create a new draggable from an element

	var element = document.querySelector('.myDraggable');
	element.style.height = '50px';
	element.style.width = '50px';
	element.style.background = 'red';
	var myDrag = new draggable(element);

an example of passing in options for pens:

	var myPennedDrag = new draggable(element, {
		pens: document.querySelector('.pen')
	});


## api
draggable is really simple to use and the following methods and options are available
###options

####pens: NodeList/array of elements
define elements that a draggable will snap into.
####roam: true/false [default: true]
defines whether a draggable can be dragged out of pens or whether it must always be contained within one of its defined pens.
####contained: true/false [default: false]
defines whether a draggable can be dragged outside of its parent or not.
####vertical: true/false [default: true]
defines whether a draggable can be dragged vertically.
####horizontal: true/false [default: true]
defines whether a draggable can be dragged horizontally.
####ghosting: true/false [default: false]
define whether draggable has ghosting effect (see demo).

###methods
There are also some methods you can use on your draggable:
####setPens(NodeList - array of elements)
set pen elements for draggable to snap to.
####setContained(bool)
set whether a draggable is contained.
####setRoam(bool)
set whether a draggable can roam outside of pens.
####setVertical(bool)
set whether a draggable can be dragged vertically.
####setHorizontal(bool)
set whether a draggable can be dragged horizontally.
####setGhosting(bool)
set whether a draggable has the ghosting effect.



## License

  MIT
