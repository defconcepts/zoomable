window.zoomable = zoomable = (element) ->
  return new zoomable(element)  unless this instanceof zoomable
  @element = element
  newZoom = this
  newZoom._ll = parseFloat newZoom.element.getAttribute('lower-limit') || 0.5
  newZoom._tl = parseFloat newZoom.element.getAttribute('top-limit') || 2.0
  newZoom.scale = parseFloat newZoom.element.getAttribute('zoom-rate')
  newZoom._scale = 1.00
  zoom = (e) ->
    if e.touches and e.touches.length is 2
      e.preventDefault()
      oldDist = newZoom.dist
      newZoom.dist = Math.sqrt((e.touches[0].clientX - e.touches[1].clientX) * (e.touches[0].clientX - e.touches[1].clientX) + (e.touches[0].clientY - e.touches[1].clientY) * (e.touches[0].clientY - e.touches[1].clientY))
      if newZoom.dist < oldDist
        newZoom._scale = newZoom._scale - newZoom.scale
      else if newZoom.dist > oldDist
        newZoom._scale = newZoom._scale + newZoom.scale
      if newZoom._scale > newZoom._ll and newZoom._scale < newZoom._tl
        newZoom.element.setAttribute 'style', '-webkit-transform: scale(' + newZoom._scale + '); transform: scale(' + newZoom._scale + ');'

  startZoom = (e) ->
    newZoom.element.addEventListener "touchmove", zoom, true

  endZoom = ->
    newZoom.element.removeEventListener "touchmove", zoom, true

  newZoom.element.addEventListener "touchstart", startZoom, false
  newZoom.element.addEventListener "touchend", endZoom, false
  @

[].forEach.call document.querySelectorAll('[zoomable]'), (zoomer) ->
  return new zoomable zoomer
