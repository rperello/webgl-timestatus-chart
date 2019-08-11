class PixelUnitCanvas {
  setPixelsDimensions (width, height) {
    this.pw = width
    this.ph = height
  }

  pixels2CanvasUnitWidth (pixels) {
    return 2 * (pixels / this.pw)
  }

  pixels2CanvasUnitHeight (pixels) {
    return 2 * (pixels / this.ph)
  }

  pixels2CanvasUnitPositionX (pixels) {
    return this.pixels2CanvasUnitWidth(pixels) - 1
  }

  pixels2CanvasUnitPositionY (pixels) {
    return this.pixels2CanvasUnitHeight(pixels) - 1
  }

  pixels2CanvasUnit ([x, y]) {
    return [this.pixels2CanvasUnitWidth(x), this.pixels2CanvasUnitHeight(y)]
  }
}

export default PixelUnitCanvas
