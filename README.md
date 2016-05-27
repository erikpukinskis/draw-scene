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


drawScene(shapes, camera)
```

If you want to redraw without rebuffering:

```javascript
drawScene.again(camera)
```

Requires you have a canvas and some shaders in your document:

```html
<canvas width="300" height="300"></canvas>

<script id="fill-shader" type="x-shader/x-fragment">
    precision mediump float;

    varying vec4 vColor;

    void main(void) {
        gl_FragColor = vColor;
    }
</script>

<script id="geometry-shader" type="x-shader/x-vertex">
    attribute vec3 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uniformModelViewMatrix;
    uniform mat4 uniformProjectionMatrix;

    varying vec4 vColor;

    void main(void) {
        gl_Position = uniformProjectionMatrix * uniformModelViewMatrix * vec4(aVertexPosition, 1.0);
        vColor = aVertexColor;
    }
</script>

<script src="draw-scene.js"></script>
```

Check out [demo.html](demo.html).
