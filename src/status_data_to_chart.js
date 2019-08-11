class StatusDataToChart {
  constructor (originalData = [], fixedMaxValue) {
    this.fixedMaxValue = fixedMaxValue
    this.maxValue = fixedMaxValue || null
    this.minValue = 0
    this.dataRefreshRate = 1000
    this.data = originalData
    this.lastTs = null
  }

  getMaxAndMin () {
    let min = null
    let max = null

    this.data.forEach(d => {
      if (!min || d < min) {
        min = d
      }
      if (!max || d > max) {
        max = d
      }
    })

    this.minValue = min
    this.maxValue = max
  }

  getChartData () {
    if (this.hasNewData()) {
      const t1 = new Date().getTime()
      let data = this.data
      data.shift()
      const newValue = 6 + 0.08 * Math.floor(100 * Math.random() * 100) / 100
      data.push([t1 / 1000, newValue])
      this.data = data
      this.lastTs = t1
    }

    return this.data.map(([t, v]) => [ t, v / this.maxValue ])
  }

  hasNewData () {
    return !this.lastTs || new Date().getTime() - this.lastTs >= this.dataRefreshRate
  }
}

export default StatusDataToChart
