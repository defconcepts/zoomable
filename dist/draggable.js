/*
draggable - http://jh3y.github.io/draggable
Licensed under the MIT license

jh3y (c) 2014.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function() {
  var draggable;

  window.draggable = draggable = function(element, options) {
    var extend, setProps;
    if (!(this instanceof draggable)) {
      return new draggable(element, options);
    }
    this.element = element;
    this._defaults = {
      contained: false,
      pens: false,
      vertical: true,
      horizontal: true,
      disabled: false,
      parent: undefined,
      boundsOverride: undefined,
      handle: undefined
    };
    extend = function(a, b) {
      var key;
      for (key in b) {
        if (b.hasOwnProperty(key)) {
          a[key] = b[key];
        }
      }
      return a;
    };
    setProps = function(obj, props) {
      var prop;
      for (prop in props) {
        if (prop !== void 0) {
          obj['_' + prop] = props[prop];
        }
      }
      return obj;
    };
    this._options = extend(this._defaults, options);
    setProps(this, this._options);

    /*
      NOTE: For contained draggables you can either set the container
      or an assumption is made that the direct parent is the container.
     */
    if (this._options.contained && this._options.container !== undefined) {
      this._parent = this._options.container;
    } else if (this._options.contained) {
      this._parent = this.element.parentNode;
    } else {
      this._parent = window;
    }
    if (this._options.handle !== undefined && typeof this._options.handle === 'string') {
      this._handle = this.element.querySelectorAll(this._options.handle)[0];
    }
    this._touch = 'ontouchstart' in window;
    this._create();
    return this;
  };

  draggable.prototype.setPens = function(pens) {
    if (pens) {
      return this._pens = pens;
    }
  };

  draggable.prototype.setDisabled = function(disabled) {
    if (disabled !== undefined) {
      return this._disabled = disabled;
    }
  };

  draggable.prototype.setContained = function(contained) {
    if (contained !== undefined) {
      return this._contained = contained;
    }
  };

  draggable.prototype.setRoam = function(roam) {
    if (roam !== undefined) {
      return this._roam = roam;
    }
  };

  draggable.prototype.setVertical = function(vertical) {
    if (vertical !== undefined) {
      return this._vertical = vertical;
    }
  };

  draggable.prototype.setHorizontal = function(horizontal) {
    if (horizontal !== undefined) {
      return this._horizontal = horizontal;
    }
  };

  draggable.prototype.setGhosting = function(ghosting) {
    if (ghosting !== undefined) {
      return this._ghosting = ghosting;
    }
  };

  draggable.prototype._create = function() {
    var drag, endDrag, ghost, newDraggable, startDrag;
    newDraggable = this;
    ghost = void 0;
    drag = function(event) {
      var override;
      if (newDraggable._touch) {
        event.preventDefault();
        document.body.style.overflow = 'hidden';
        event = event.touches[0];
      }

      /*
        NOTE: Cool little effect here if you want an almost online paint effect.
      
        ghost = newDraggable.element.cloneNode();
        ghost.style.opacity = 0.5;
        document.querySelector('body').appendChild(ghost);
       */
      newDraggable.element.style.position = "absolute";
      newDraggable._newY = event.clientY - newDraggable._offY;
      newDraggable._newX = event.clientX - newDraggable._offX;
      if (newDraggable._contained) {

        /*
          NOTE:
            It's hard to cater to everyones requirements in this particular piece
            of code when dealing with contained elements.
        
            For example; you could just have display; block elements within a
            container with static positioning.
        
            But what if you have other elements within your container that need
            to be absolutely positioned. This means using relative positioning
            on the container which can throw off bounds calculations.
         */
        override = 0;
        if (newDraggable._boundsOverride !== undefined) {
          if (typeof newDraggable._boundsOverride === 'string') {
            override = parseInt(newDraggable._boundsOverride, 10);
          } else {
            override = newDraggable._boundsOverride * Math.min(newDraggable.element.offsetHeight, newDraggable.element.offsetWidth);
          }
        }
        if ((newDraggable._newX + newDraggable._boundsXL) < (newDraggable._boundsXL - override)) {
          newDraggable._newX = 0 - override;
        }
        if ((newDraggable._newX + newDraggable._boundsXL) > (newDraggable._boundsXR + override)) {
          newDraggable._newX = newDraggable._parent.offsetWidth - newDraggable.element.offsetWidth + override;
        }
        if ((newDraggable._newY + newDraggable._boundsXT) > (newDraggable._boundsXB + override)) {
          newDraggable._newY = newDraggable._parent.offsetHeight - newDraggable.element.offsetHeight + override;
        }
        if ((newDraggable._newY + newDraggable._boundsXT) < (newDraggable._boundsXT - override)) {
          newDraggable._newY = 0 - override;
        }
      }
      if (newDraggable._horizontal) {
        newDraggable.element.style.left = newDraggable._newX + "px";
      }
      if (newDraggable._vertical) {
        newDraggable.element.style.top = newDraggable._newY + "px";
      }
      return newDraggable._parent.addEventListener("dblclick", endDrag);
    };
    endDrag = function() {
      var currentPen, i, isAPen, penned;
      if (newDraggable._touch) {
        document.body.style.overflow = '';
      }
      if (newDraggable._disabled) {
        return false;
      } else {
        if (ghost !== undefined) {
          [].forEach.call(document.querySelectorAll('[draggable-ghost]'), function(ghost) {
            return ghost.remove();
          });
        }
        if (newDraggable._touch) {
          if (newDraggable._handle !== undefined) {
            newDraggable._handle.removeEventListener("touchmove", drag, true);
          } else {
            newDraggable.element.removeEventListener("touchmove", drag, true);
          }
        } else {
          newDraggable._parent.removeEventListener("mousemove", drag, true);
        }
        if (newDraggable._pens && newDraggable._pens.length > 0) {
          penned = false;
          currentPen = newDraggable.element.parentNode;
          isAPen = function(element) {
            var i;
            i = 0;
            while (i <= newDraggable._pens.length - 1) {
              if (currentPen === newDraggable._pens[i]) {
                return true;
              }
              i++;
            }
          };
          i = 0;
          while (i < newDraggable._pens.length) {
            if (newDraggable._newX < (newDraggable._pens[i].offsetLeft + newDraggable._pens[i].offsetWidth) && newDraggable._newX > (newDraggable._pens[i].offsetLeft - newDraggable.element.offsetWidth) && newDraggable._newY > (newDraggable._pens[i].offsetTop - newDraggable.element.offsetHeight) && newDraggable._newY < (newDraggable._pens[i].offsetTop + newDraggable._pens[i].offsetHeight + newDraggable.element.offsetHeight)) {
              penned = true;
              newDraggable.element.style.position = "";
              newDraggable._pens[i].appendChild(newDraggable.element);
              break;
            }
            i++;
          }
          if (!penned) {
            if (newDraggable._roam) {
              return document.querySelector("body").appendChild(newDraggable.element);
            } else {
              if (isAPen(currentPen)) {
                currentPen.appendChild(newDraggable.element);
                return newDraggable.element.style.position = "";
              }
            }
          }
        }
      }
    };
    startDrag = function(event) {
      if (newDraggable._touch) {
        document.body.style.overflow = 'hidden';
        event.preventDefault();
        event = event.touches[0];
      }
      if (newDraggable._disabled) {
        return false;
      } else {
        newDraggable._offY = event.clientY - parseInt(newDraggable.element.offsetTop);
        newDraggable._offX = event.clientX - parseInt(newDraggable.element.offsetLeft);
        newDraggable._boundsXR = (newDraggable._parent.offsetLeft + newDraggable._parent.offsetWidth) - newDraggable.element.offsetWidth;
        newDraggable._boundsXL = newDraggable._parent.offsetLeft;
        newDraggable._boundsXT = newDraggable._parent.offsetTop;
        newDraggable._boundsXB = (newDraggable._parent.offsetTop + newDraggable._parent.offsetHeight) - newDraggable.element.offsetHeight;
        if (newDraggable._ghosting) {
          ghost = newDraggable.element.cloneNode();
          newDraggable.element.parentNode.appendChild(ghost);
          ghost.style.opacity = 0.2;
          ghost.style.position = "absolute";
          ghost.style.left = newDraggable.element.offsetLeft + "px";
          ghost.style.top = newDraggable.element.offsetTop + "px";
          ghost.setAttribute('draggable-ghost', 'true');
        }
        if (newDraggable._touch) {
          if (newDraggable._handle !== undefined) {
            return newDraggable._handle.addEventListener("touchmove", drag, true);
          } else {
            return newDraggable.element.addEventListener("touchmove", drag, true);
          }
        } else {
          return newDraggable._parent.addEventListener("mousemove", drag, true);
        }
      }
    };
    if (newDraggable._touch) {
      if (newDraggable._handle !== undefined) {
        newDraggable._handle.addEventListener("touchstart", startDrag, false);
        return newDraggable._handle.addEventListener("touchend", endDrag, false);
      } else {
        newDraggable.element.addEventListener("touchstart", startDrag, false);
        return newDraggable.element.addEventListener("touchend", endDrag, false);
      }
    } else {
      if (newDraggable._handle !== undefined) {
        newDraggable._handle.addEventListener("mousedown", startDrag, false);
        return newDraggable._handle.addEventListener("mouseup", endDrag, false);
      } else {
        newDraggable.element.addEventListener("mousedown", startDrag, false);
        return newDraggable.element.addEventListener("mouseup", endDrag, false);
      }
    }
  };

}).call(this);
