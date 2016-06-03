
var drawScene = (function() {
  var gl

  function init(cam) {
    if (cam) {
      camera = cam
    }

    var canvas = document.querySelector("canvas")

    if (!canvas) {
      throw new Error("Add a canvas element to your document before calling drawScene")
    }

    gl = canvas.getContext("experimental-webgl")
    gl.viewportWidth = canvas.width
    gl.viewportHeight = canvas.height

    gl.clearColor(1.0, 1.0, 1.0, 1.0)
    gl.enable(gl.DEPTH_TEST)

    if (!gl) {
      throw new Error("Could not initialize WebGL")
    }

    initShaders()
  }

  function compileFillShader(gl, lines) {
    var shader = gl.createShader(gl.FRAGMENT_SHADER)

    return compileShader(gl, shader, lines)
  }

  function compileVertexShader(gl, lines) {
    var shader = shader = gl.createShader(gl.VERTEX_SHADER)

    return compileShader(gl, shader, lines)
  }

  function compileShader(gl, shader, lines) {

    gl.shaderSource(shader, lines.join("\n"))
    gl.compileShader(shader)

    var isCompiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

    if (!isCompiled) {
      throw new Error(
        gl.getShaderInfoLog(shader))
      return null
    }

    return shader
  }


  var shaderProgram;

  function initShaders() {

    var fillShader = compileFillShader(gl, [
      "precision mediump float;",
      "varying vec4 vColor;",
      "void main(void) {",
      "    gl_FragColor = vColor;",
      "}",
    ])

    var geometryShader = compileVertexShader(gl, [
      "attribute vec3 aVertexPosition;",
      "attribute vec4 aVertexColor;",
      "uniform mat4 uniformModelViewMatrix;",
      "uniform mat4 uniformProjectionMatrix;",
      "varying vec4 vColor;",
      "void main(void) {",
      "    gl_Position = uniformProjectionMatrix * uniformModelViewMatrix * vec4(aVertexPosition, 1.0);",
      "    vColor = aVertexColor;",
      "}",
    ])

    shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, geometryShader);
    gl.attachShader(shaderProgram, fillShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      throw new Error("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, "uniformProjectionMatrix");
    shaderProgram.modelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "uniformModelViewMatrix");
  }


  var modelViewMatrix = mat4.create();
  var projectionMatrix = mat4.create();

  var vertexPositionBuffer
  var vertexColorBuffer

  function bufferScene(shapes) {

    if (!gl) { init() }

    var vertexCount = 0
    var positions = []
    var colors = []

    for(var i=0; i<shapes.length; i++) {
      var shape = shapes[i]

      vertexCount += shape.pointCount

      for(var j=0; j<shape.verticies.length; j++) {
        positions.push(shape.verticies[j])
      }

      for(var j=0; j<shape.colors.length; j++) {
        colors.push(shape.colors[j])
      }
    }

    vertexPositionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3;
    vertexPositionBuffer.numItems = vertexCount

    vertexColorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
    vertexColorBuffer.itemSize = 4
    vertexColorBuffer.numItems = vertexCount
  }

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

  function degToRad(degrees) {
    return degrees * Math.PI / 180;
  }

  function paint(shapes, cam) {
    if (cam) {
      camera = cam
    }

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    mat4.perspective(projectionMatrix, camera.fovy, gl.viewportWidth / gl.viewportHeight, camera.near, camera.far)

    var shapeStart = 0

    for(var i=0; i<shapes.length; i++) {
      var shape = shapes[i]

      mat4.identity(modelViewMatrix)
      mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(camera.pitch), [1, 0, 0])
      mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(camera.yaw), [0, 1, 0])
      mat4.translate(modelViewMatrix, modelViewMatrix, [camera.xPos, camera.yPos, camera.zPos])
      mat4.translate(modelViewMatrix, modelViewMatrix, shape.position);

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer)
      gl.vertexAttribPointer(
        shaderProgram.vertexColorAttribute, vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0)

      gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, projectionMatrix);

      gl.uniformMatrix4fv(shaderProgram.modelViewMatrixUniform, false, modelViewMatrix);

      gl.drawArrays(gl.TRIANGLE_STRIP, shapeStart, shape.pointCount)

      shapeStart += shape.pointCount

    }

  }

  var shapes

  function drawScene(newShapes, camera) {
    shapes = newShapes
    bufferScene(shapes)
    paint(shapes, camera)
  }

  drawScene.again = function(camera) {
    paint(shapes, camera)
  }

  drawScene.init = init

  return drawScene
})()

