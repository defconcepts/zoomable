window.zoomable = zoomable = (element) ->
  return new zoomable(element)  unless this instanceof zoomable
  @element = element
  newZoom = this
  newZoom.scale = parseFloat newZoom.element.getAttribute('zoom-scale')
  newZoom._scale = 1.00
  zoom = (e) ->
    if e.touches and e.touches.length is 2
      e.preventDefault()
      oldDist = newZoom.dist
      newZoom.dist = Math.sqrt((e.touches[0].clientX - e.touches[1].clientX) * (e.touches[0].clientX - e.touches[1].clientX) + (e.touches[0].clientY - e.touches[1].clientY) * (e.touches[0].clientY - e.touches[1].clientY))
      diff = newZoom.dist - oldDist
      if newZoom.dist < oldDist
        newZoom._scale = newZoom._scale - newZoom.scale
      else if newZoom.dist > oldDist
        newZoom._scale = newZoom._scale + newZoom.scale
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
