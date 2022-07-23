function resize (width, height) {
  const aspectRatio = width / height

  let optimalWidth = Math.round(aspectRatio * 20 * (27 / 3))
  let optimalHeight = 20

  if (optimalWidth > 320) {
    const reduction = optimalWidth / 320

    optimalWidth = 320

    optimalHeight *= reduction
  }

  return {
    width: Math.floor(optimalWidth),
    height: Math.floor(optimalHeight)
  }
}

module.exports = { resize }
