import React from 'react'
import styled from 'styled-components'
import L from 'leaflet'
import 'leaflet-providers'

const TILE_PROVIDER = 'CartoDB.Voyager'

export class Map extends React.Component {
  _mapRef = null
  _map = null

  constructor(props) {
    super(props)
    this._mapRef = React.createRef()
  }

  componentDidMount() {
    this.prepareMap()
    this.addListeners()
    this.handleMove() // to set initial bounds
  }

  componentDidUpdate(prevProps, prevState) {}

  prepareMap = () => {
    this._map = L.map(this._mapRef.current)
    L.tileLayer.provider(TILE_PROVIDER).addTo(this._map)

    this._map.setView([0, 0], 2)
    // this._map.setView([40.72, -74], 14)
  }

  addListeners = () => {
    this._map.on('moveend', this.handleMove)
  }

  handleMove = e => {
    console.log(this._map.getBounds())
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
