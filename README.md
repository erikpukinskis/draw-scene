![screenshot of pink triangle and yellow square](http://i.imgur.com/Key14zv.png)

Paint polygons with colored verticies to a canvas. DrawScene is under 200 lines and is written for clarity and hackability. It works well as a library, but it is also a solid foundation for building on. It is based on Learning WebGL lessons, [particularly Lesson 2](http://learningwebgl.com/blog/?p=134).

```javascript
var shapes = [
  {
    name: "triangle",
    position: [-1.5, 0.0, -7.0],
    verticies: [
       0.0,  1.0,  0.0,
      -1.0, -1.0,  0.0,
       1.0, -1.0,  0.0
    ],
    pointCount: 3,
    colors: [
      1.0, 0.4, 0.6, 1.0,
      0.9, 0.4, 0.7, 1.0,
      0.8, 0.4, 0.9, 1.0
    ]
  },
  {
    name: "square",
    position: [1.5, 0.0, -7.0],
    verticies: [
       1.0,  1.0,  0.0,
      -1.0,  1.0,  0.0,
       1.0, -1.0,  0.0,
      -1.0, -1.0,  0.0
    ],
    pointCount: 4,
    colors: [
      1.0, 0.8, 0.2, 1.0,
      0.9, 0.7, 0.4 , 1.0,
      0.8, 0.7, 0.6, 1.0,
      0.7, 0.6, 0.8, 1.0
    ]
  }
]


drawScene(shapes)
```

If you want to redraw from a different angle without rebuffering:

```javascript
var camera = {
  fovy: 45,
  near: 0.1,
  far: 100.0,
  pitch: 0.0,
  yaw: 0.0,
  xPos: 0.0,
  yPos: 0.4,
  zPos: 0.0  
}

drawScene.again(camera)
```

When you want to buffer new data, just call drawScene again. You can provide a camera then too:

```javasscript
shapes.forEach(...)

drawScene(shapes, camera)
```

Requires you have a single canvas in your document:

```html
<canvas width="300" height="300"></canvas>

<script src="draw-scene.js"></script>

<script>
drawScene(...)
</script>
```

Check out [demo.html](demo.html).
