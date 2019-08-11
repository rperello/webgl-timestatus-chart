function processStatusData (statusData = [], statusField, timeField = 'ts') {
  if (typeof statusField !== 'string' || !statusField) {
    throw new TypeError('statusField is not a string')
  }
  return statusData.map(status => [status[timeField], status[statusField]])
}

export default processStatusData
