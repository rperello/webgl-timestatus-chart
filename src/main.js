/* global alert, requestAnimationFrame */
// import format from 'date-fns/format'
import fragmentShaderText from './shaders/webgl1/fragmentShader.frag'
import vertexShaderText from './shaders/webgl1/vertexShader.vert'
import fragmentShaderText2 from './shaders/webgl2/fragmentShader.frag'
import vertexShaderText2 from './shaders/webgl2/vertexShader.vert'
import modemStatus from './data/cellular_modem_status.json'
import processStatusData from './process_status_data'
import StatusDataToChart from './status_data_to_chart'
import Stats from 'stats.js'
import { normal } from 'color-blend/unit'
import PixelUnitCanvas from './pixelUnitCanvas'

let gl
let chartValues
const backgroundColorRGB = {
  r: 0,
  g: 0.05,
  b: 0.15,
  a: 1
}

const baseColor = [ 0.34, 0.77, 0.76 ]

// const generateX = function (index, numItems, deltaX) {
//   return 0.988 * (2 * ((index) / (numItems - 1)) - 1)
// }

// const generateColor = function (baseColor, topColor, y) {
//   const color = []
//   baseColor.forEach((bc, index) => {
//     const tc = topColor[index]
//     color[index] = (tc - bc) * (1 + y)
//   })

//   return color
// }

const coralColor = baseColor.map(c => c * 0.6)
const realToCSSPixels = window.devicePixelRatio

function resize (canvas) {
  // Lookup the size the browser is displaying the canvas.
  const displayWidth = Math.floor(gl.canvas.clientWidth * realToCSSPixels)
  const displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels)

  // Check if the canvas is not the same size.
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    // Make the canvas the same size
    canvas.width = displayWidth
    canvas.height = displayHeight
    pixelUnitCanvas.setPixelsDimensions(displayWidth, displayHeight)
  }
}

function drawScene () {
  stats.begin()
  resize(gl.canvas)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  if (chartValues.hasNewData()) {
    const data = chartValues.getChartData()
    const numItems = data.length

    const dimensions = {
      xAxis: {
        x: pixelUnitCanvas.pixels2CanvasUnitPositionX(0),
        y: pixelUnitCanvas.pixels2CanvasUnitPositionY(0),
        width: pixelUnitCanvas.pixels2CanvasUnitWidth(gl.canvas.width - 149 * realToCSSPixels),
        height: pixelUnitCanvas.pixels2CanvasUnitWidth(40 * realToCSSPixels)
      },
      yAxis: {
        x: pixelUnitCanvas.pixels2CanvasUnitPositionX(gl.canvas.width - 148 * realToCSSPixels),
        y: pixelUnitCanvas.pixels2CanvasUnitPositionY(41 * realToCSSPixels),
        width: pixelUnitCanvas.pixels2CanvasUnitWidth(148 * realToCSSPixels),
        height: pixelUnitCanvas.pixels2CanvasUnitWidth(gl.canvas.height - 40 * realToCSSPixels)
      },
      chart: {
        x0: pixelUnitCanvas.pixels2CanvasUnitPositionX(0),
        y0: pixelUnitCanvas.pixels2CanvasUnitPositionY(41 * realToCSSPixels),
        x1: pixelUnitCanvas.pixels2CanvasUnitPositionX(gl.canvas.width - 149 * realToCSSPixels),
        y1: pixelUnitCanvas.pixels2CanvasUnitPositionY(gl.canvas.height),
        width: pixelUnitCanvas.pixels2CanvasUnitWidth(gl.canvas.width - 149 * realToCSSPixels),
        height: pixelUnitCanvas.pixels2CanvasUnitHeight(gl.canvas.height - 41 * realToCSSPixels)
      }
    }

    gl.clearColor(0, 0.05, 0.15, 1)
    gl.enable(gl.DEPTH_TEST)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    //
    // Create buffer
    //

    // const topColor = [ 0.2, 1.0, 1.0 ]

    const triangleVertices = data.reduce((acc, [ts, y], index) => {
      // const x = generateX(index, numItems)
      // let x = dimensions.chart.width * (index + 1) / (numItems) + dimensions.chart.x0
      const x0 = dimensions.chart.width * (index + 0.50) / (numItems) + dimensions.chart.x0 + pixelUnitCanvas.pixels2CanvasUnitWidth(1)
      const x1 = dimensions.chart.width * (index + 1.50) / (numItems) + dimensions.chart.x0 - pixelUnitCanvas.pixels2CanvasUnitWidth(1)
      const y0 = dimensions.chart.y0
      const y1 = y * dimensions.chart.height + dimensions.chart.y0

      // console.log({ y, y0, y1 }, dimensions.chart.height, y * dimensions.chart.height)
      let color

      // const interpolatedColor = generateColor(baseColor, topColor, y)
      if (index < 15) {
        const alphaColor = { r: baseColor[0], g: baseColor[1], b: baseColor[2], a: (index / 15) }
        const { r, g, b } = normal(backgroundColorRGB, { ...alphaColor, a: index / 15 })
        color = [ r, g, b ]
      } else {
        color = baseColor
      }

      // const bc = index < 15 ? [0, 1 - 0.95 * (1 - (index + 1) / 15), 1 - 0.85 * (1 - (index + 1) / 15)] : baseColor
      // const ic = index < 15 ? [0, 1 - 0.95 * (1 - (index + 1) / 15), 1 - 0.85 * (1 - (index + 1) / 15)] : baseColor

      acc = acc.concat([
        x0, y0, ...color,
        x1, y1, ...color,
        x0, y1, ...color,
        x0, y0, ...color,
        x1, y0, ...color,
        x1, y1, ...color
      ])
      return acc
    }, [
      // -1, -0.75, 0, 0.05, 0.15,
      // 1, -0.75, 0, 0.05, 0.15,
      // 1, -0.76, 0, 0.05, 0.15,
      // -1, -0.75, 0, 0.05, 0.15,
      // 1, -0.76, 0, 0.05, 0.15,
      // -1, -0.76, 0, 0.05, 0.15,
      // -1, -0.5, 0, 0.05, 0.15,
      // 1, -0.5, 0, 0.05, 0.15,
      // 1, -0.51, 0, 0.05, 0.15,
      // -1, -0.5, 0, 0.05, 0.15,
      // 1, -0.51, 0, 0.05, 0.15,
      // -1, -0.51, 0, 0.05, 0.15,
      // -1, -0.25, 0, 0.05, 0.15,
      // 1, -0.25, 0, 0.05, 0.15,
      // 1, -0.26, 0, 0.05, 0.15,
      // -1, -0.25, 0, 0.05, 0.15,
      // 1, -0.26, 0, 0.05, 0.15,
      // -1, -0.26, 0, 0.05, 0.15,
      // -1, -0.91, ...coralColor,
      // 1, -0.91, ...coralColor,
      // 1, -0.92, ...coralColor,
      // -1, -0.91, ...coralColor,
      // 1, -0.92, ...coralColor,
      // -1, -0.92, ...coralColor,
      // 0.998, -0.91, ...coralColor,
      // 1, -0.91, ...coralColor,
      // 1, 0.91, ...coralColor,
      // 0.998, -0.91, ...coralColor,
      // 1, 0.91, ...coralColor,
      // 0.998, 0.92, ...coralColor
    ])

    // Pass data to Graphics Card
    const triangleVertexBufferObject = gl.createBuffer()

    /* ======= Associating shaders to buffer objects ====== */
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW)

    const positionAttribLocation = gl.getAttribLocation(shaderProgram, 'vertPosition')
    const colorAttribLocation = gl.getAttribLocation(shaderProgram, 'vertColor')

    gl.vertexAttribPointer(
      positionAttribLocation,
      2, // Number of elements per attribute
      gl.FLOAT, // Type of elements
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
      0
    )
    gl.vertexAttribPointer(
      colorAttribLocation,
      3, // Number of elements per attribute
      gl.FLOAT, // Type of elements
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
      2 * Float32Array.BYTES_PER_ELEMENT
    )

    gl.enableVertexAttribArray(positionAttribLocation)
    gl.enableVertexAttribArray(colorAttribLocation)

    gl.useProgram(shaderProgram)

    gl.drawArrays(gl.TRIANGLES, 0, triangleVertices.length / 5)

    // const lastTs = data[numItems - 1][0] * 1000
    // document.getElementById('last-update').textContent = format(lastTs, 'h:mm:ssa')
  }
  stats.end()

  //
  // Main render loop
  //
  requestAnimationFrame(drawScene)
}

let vertexShader
let fragmentShader
let shaderProgram
let pixelUnitCanvas

function init (statusData) {
  const canvas = document.getElementById('my-webgl-canvas')
  gl = canvas.getContext('webgl2', {
    antialias: false,
    premultipliedAlpha: false
  })

  if (!gl) {
    gl = canvas.getContext('experimental-webgl')
  }

  if (!gl) {
    alert('Your browser does not support WebGL')
  } else {
    pixelUnitCanvas = new PixelUnitCanvas()

    //
    // Create shaders
    //
    vertexShader = gl.createShader(gl.VERTEX_SHADER)
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    //
    // Associate shader texts to shaders
    //
    gl.shaderSource(vertexShader, vertexShaderText2)
    gl.shaderSource(fragmentShader, fragmentShaderText2)

    //
    // Compile shaders
    //
    gl.compileShader(vertexShader)
    // if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    //   console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader))
    //   return
    // }
    gl.compileShader(fragmentShader)
    // if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    //   console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader))
    //   return
    // }

    // Create program
    shaderProgram = gl.createProgram()
    // Attach shaders
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    // Send program to GPU
    gl.linkProgram(shaderProgram)
    // if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    //   console.error('ERROR linking shaderProgram!', gl.getProgramInfoLog(shaderProgram))
    //   return
    // }
    gl.validateProgram(shaderProgram)
    // if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)) {
    //   console.error('ERROR validating shaderProgram!', gl.getProgramInfoLog(shaderProgram))
    //   return
    // }

    chartValues = new StatusDataToChart(statusData, 50)

    // Init render
    requestAnimationFrame(drawScene)
  }
}

const statusData = processStatusData(modemStatus, 'cpu_load', 'timestamp')

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

init(statusData)
