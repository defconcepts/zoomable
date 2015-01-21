# zoomable

Super simple pinch zooming for DOM elements on devices!

Zoomable enables you to pinch zoom DOM elements on devices by just adding some attributes to your elements.


## usage

1. Drop `zoomable.min.js` into your scripts.
2. Add the attribute `zoomable` to your zoomable elements.
3. Add the attribute `zoom-rate` to your elements defining the rate at which element which scale upon pinch. For example; a zoom rate of 0.1 means that as you pinch, the element will go from 1.0 to 1.1 to 1.2 etc.
4. Optionally define a top and lower limit for element scale using `lower-limit` and `upper-limit`. For example; to stop your element from becoming smaller than half it's size set the `lower-limit` to `0.5`.
For example,

```html
  <div zoomable zoom-rate="0.1"> My zoomable element </div>
```

## uses

Zoomable mainly becomes useful for when you are trying to manipulate images within applications. For example, when you are cropping an image for say a profile picture.

## license

  MIT

Copyright 2015 [@jh3y](http://jh3y.github.io)
