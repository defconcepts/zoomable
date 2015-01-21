/*
zoomable - http://jh3y.github.io/zoomable
Licensed under the MIT license

jh3y (c) 2014.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function() {
  var zoomable;

  window.zoomable = zoomable = function(element) {
    var endZoom, newZoom, startZoom, zoom;
    if (!(this instanceof zoomable)) {
      return new zoomable(element);
    }
    this.element = element;
    newZoom = this;
    newZoom._ll = parseFloat(newZoom.element.getAttribute('lower-limit') || 0.5);
    newZoom._tl = parseFloat(newZoom.element.getAttribute('top-limit') || 2.0);
    newZoom.scale = parseFloat(newZoom.element.getAttribute('zoom-rate'));
    newZoom._scale = 1.00;
    zoom = function(e) {
      var oldDist;
      if (e.touches && e.touches.length === 2) {
        e.preventDefault();
        oldDist = newZoom.dist;
        newZoom.dist = Math.sqrt((e.touches[0].clientX - e.touches[1].clientX) * (e.touches[0].clientX - e.touches[1].clientX) + (e.touches[0].clientY - e.touches[1].clientY) * (e.touches[0].clientY - e.touches[1].clientY));
        if (newZoom.dist < oldDist) {
          newZoom._scale = newZoom._scale - newZoom.scale;
        } else if (newZoom.dist > oldDist) {
          newZoom._scale = newZoom._scale + newZoom.scale;
        }
        if (newZoom._scale > newZoom._ll && newZoom._scale < newZoom._tl) {
          return newZoom.element.setAttribute('style', '-webkit-transform: scale(' + newZoom._scale + '); transform: scale(' + newZoom._scale + ');');
        }
      }
    };
    startZoom = function(e) {
      return newZoom.element.addEventListener("touchmove", zoom, true);
    };
    endZoom = function() {
      return newZoom.element.removeEventListener("touchmove", zoom, true);
    };
    newZoom.element.addEventListener("touchstart", startZoom, false);
    newZoom.element.addEventListener("touchend", endZoom, false);
    return this;
  };

  [].forEach.call(document.querySelectorAll('[zoomable]'), function(zoomer) {
    return new zoomable(zoomer);
  });

}).call(this);
