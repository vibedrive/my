function VibedriveResource (vibedrive) {
  if (!(this instanceof VibedriveResource)) return new VibedriveResource(vibedrive)

  this._vibedrive = vibedrive
}

module.exports = VibedriveResource
