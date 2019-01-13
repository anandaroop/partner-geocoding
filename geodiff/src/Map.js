import React from 'react'
import styled from 'styled-components'
import L from 'leaflet'
import 'leaflet-providers'
import _ from 'lodash'

const TILE_PROVIDER = 'CartoDB.Voyager'

export class Map extends React.Component {
  _mapRef = null
  _map = null
  _points

  constructor(props) {
    super(props)
    this._mapRef = React.createRef()
  }

  componentDidMount() {
    this.prepareMap()
    this.addListeners()
    this.handleMove() // to set initial bounds
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevProps.location, this.props.location)) {
      this.replacePoints()
    }
  }

  prepareMap = () => {
    this._map = L.map(this._mapRef.current)
    L.tileLayer.provider(TILE_PROVIDER).addTo(this._map)
    this._points = L.featureGroup().addTo(this._map)

    this._map.setView([0, 0], 2)
  }

  addListeners = () => {
    this._map.on('moveend', this.handleMove)
  }

  replacePoints = () => {
    this._points.clearLayers()
    const { location } = this.props

    // mark the original geocoded point
    const original = L.circleMarker(location.properties.geocodes.original, {
      radius: 5,
      color: 'red',
      fill: false
    })

    this._points.addLayer(original)

    // mark the re-geocoded point
    const redo_old_address = L.circleMarker(
      location.properties.geocodes.redo_old_address,
      {
        radius: 10,
        color: 'green',
        fill: false
      }
    )
    this._points.addLayer(redo_old_address)

    // mark the scraped + geocoded point
    const new_address_string = location.properties.new_address_string
    if (new_address_string) {
      const new_address = L.circleMarker(
        location.properties.geocodes.new_address,
        {
          radius: 15,
          color: 'blue',
          fill: false
        }
      )
      this._points.addLayer(new_address)
    }

    this._map.fitBounds(this._points.getBounds())
  }

  handleMove = e => {
    // this.props.onMove(this._map.getBounds())
  }

  render() {
    return <MapDiv ref={this._mapRef} />
  }
}

const MapDiv = styled.div`
  background: #eee;
  width: 100%;
  height: 100vh;
`
