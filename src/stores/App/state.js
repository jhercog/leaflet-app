import { colors } from 'quasar'

export default () => {
  const { getPaletteColor } = colors

  return {
    drawerOpened: null,
    drawerItemFocused: false,
    currentGeolocation: null,
    modes: null,
    //
    map: null,
    vectorLayer: null,
    imageLayer: null,
    baseGroup: null,
    drawingGroup: null,
    selectionGroup: null,
    // drawingGroupId: null,
    selectedLayersIds: new Set(),
    selectedTool: 'Select',
    //
    noColor: getPaletteColor('primary-3'),
    noFillColor: getPaletteColor('primary-3'),
    pathColor: getPaletteColor('primary'),
    pathFillColor: getPaletteColor('primary'),
    tempColor: getPaletteColor('primary'),
    tempFillColor: getPaletteColor('primary')
  }
}
