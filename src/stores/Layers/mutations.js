export const selectFeature = async function (_id, val) {
  const featureIndex = this.features.findIndex(item => item._id === _id)
  const feature = this.features[featureIndex]
  // console.log({ _id, val, featureIndex, feature })
  feature.selected = val
}
