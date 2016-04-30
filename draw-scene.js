
var drawScene = (function() {
  var gl;

  function initGL(canvas) {
    try {
      gl = canvas.getContext("experimental-webgl");
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
      throw new Error("Could not initialise WebGL, sorry :-(");
    }
  }

  function getShader(gl, id) {
    var shaderScript = document.getElementById(id);

    if (!shaderScript) {
      return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
      if (k.nodeType == 3) {
        str += k.textContent;
      }
      k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
  }


  var shaderProgram;

  function initShaders() {
    var fillShader = getShader(gl, "fill-shader");
    var geometryShader = getShader(gl, "geometry-shader");

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

    shaderProgram.cameraMatrixUniform = gl.getUniformLocation(shaderProgram, "uniformCameraMatrix");
    shaderProgram.moveMatrixUniform = gl.getUniformLocation(shaderProgram, "uniformMoveMatrix");
  }


  var moveMatrix = mat4.create();
  var cameraMatrix = mat4.create();

  function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.cameraMatrixUniform, false, cameraMatrix);

    gl.uniformMatrix4fv(shaderProgram.moveMatrixUniform, false, moveMatrix);
  }



  function setBufferSize(buffer, size, count) {
    buffer.itemSize = size;
    buffer.numItems = count;
  }

  function bufferPosition(verticies, count) {
    vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.STATIC_DRAW);
    setBufferSize(vertexPositionBuffer, 3, count)
    return vertexPositionBuffer
  }

  function bufferColors(colors, count) {

    var vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    setBufferSize(vertexColorBuffer, 4, count)

    return vertexColorBuffer
  }




  function drawShape(shape) {
    var vertexPositionBuffer = bufferPosition(shape.verticies, shape.pointCount)

    var vertexColorBuffer = bufferColors(shape.colors, shape.pointCount)

    mat4.translate(moveMatrix, shape.position);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.vertexAttribPointer(
      shaderProgram.vertexPositionAttribute,
      vertexPositionBuffer.itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );


    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);

    gl.vertexAttribPointer(
      shaderProgram.vertexColorAttribute,
      vertexColorBuffer.itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, shape.pointCount);
  }

  function drawScene(shapes) {

    var canvas = document.querySelector("canvas");
    initGL(canvas);
    initShaders();

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, cameraMatrix);

    mat4.identity(moveMatrix);

    for(var i=0; i<shapes.length; i++) {
      drawShape(shapes[i])
    }

  }

  return drawScene
})()
