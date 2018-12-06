import React, { Component } from 'react'
import styled from 'styled-components'
import L from 'leaflet'
import 'leaflet-providers'
import 'leaflet.markercluster'

import './App.css'
import allShows from './shows.json'

export default class App extends Component {
  constructor(props) {
    super(props)
    this._shows = this.prepareInitialShows()
    this.state = {
      filteredShows: [],
      date: new Date(),
      windowInDays: 90,
      bounds: null
    }
  }

  componentDidMount() {
    // this.filterShows()
  }

  prepareInitialShows = shows => {
    const parsedShows = allShows.filter(s => s.lat && s.lng).map(show => {
      const { start_at, end_at, created_at } = show
      return {
        ...show,
        parsed_start_at: Date.parse(start_at),
        parsed_end_at: Date.parse(end_at),
        parsed_created_at: Date.parse(created_at)
      }
    })
    return parsedShows
  }

  filterShows = () => {
    const filteredShows = this._shows.filter(
      show =>
        show.parsed_end_at > this.state.date &&
        this.state.bounds.contains({ lat: show.lat, lng: show.lng })
    )
    this.setState({ filteredShows })
  }

  setBounds = bounds => {
    this.setState({ bounds }, () => {
      this.filterShows()
    })
  }

  render() {
    return (
      <Wrapper>
        <Map shows={this.state.filteredShows} onMove={this.setBounds} />
        <List
          shows={this.state.filteredShows}
          center={this.state.bounds && this.state.bounds.getCenter()}
        />
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: row;
`

class Map extends React.Component {
  _mapRef = null
  _map = null
  _markers = null
  _cluster = null
  SHOW_CLUSTERS = true

  constructor(props) {
    super(props)
    this._mapRef = React.createRef()
    this.state = {
      lat: 40.7,
      lng: -74,
      zoom: 14
    }
  }

  componentDidMount() {
    this.prepareMap()
    this.addListeners()
    this.handleMove() // to set initial bounds
  }

  componentDidUpdate(prevProps, prevState) {
    if ((this.SHOW_CLUSTERS)) {
      this.replaceClusters()
    } else {
      this.replaceMarkers()
    }
  }

  prepareMap = () => {
    const { lat, lng, zoom } = this.state
    this._map = L.map(this._mapRef.current).setView([lat, lng], zoom)
    L.tileLayer.provider('OpenStreetMap.BlackAndWhite').addTo(this._map)
    this._markers = L.layerGroup().addTo(this._map)
    this._clusters = L.markerClusterGroup().addTo(this._map)
  }

  replaceMarkers = () => {
    this._markers.clearLayers()
    const { shows } = this.props
    if (shows.length < 200) {
      shows.forEach(show => {
        this._markers.addLayer(L.marker([show.lat, show.lng]))
      })
    }
  }

  replaceClusters = () => {
    this._clusters.clearLayers()
    const { shows } = this.props
    if (shows.length < 200) {
      shows.forEach(show => {
        this._clusters.addLayer(L.marker([show.lat, show.lng]))
      })
    }
  }

  addListeners = () => {
    this._map.on('moveend', this.handleMove)
  }

  handleMove = e => {
    this.props.onMove(this._map.getBounds())
  }

  render() {
    return (
      <MapWrapper>
        <div ref={this._mapRef} />
      </MapWrapper>
    )
  }
}

const MapWrapper = styled.div`
  background: #eee;
  flex: 1 0 60%;
`

const CUTOFF = 200

class List extends React.Component {
  render() {
    const { shows, center } = this.props
    return (
      <ListWrapper>
        <p>{shows.length} results within current bounds</p>
        {shows.length < CUTOFF ? (
          shows
            .sort((s1, s2) => {
              const p1 = L.latLng(s1.lat, s1.lng)
              const p2 = L.latLng(s2.lat, s2.lng)
              return p1.distanceTo(center) - p2.distanceTo(center)
            })
            .map(show => (
              <ListItem key={show.slug}>
                <div className="name">{show.slug}</div>
                <div className="address">{show.address}</div>
                <div className="coordinates">
                  {show.lat.toFixed(6)},{show.lng.toFixed(6)}
                </div>
                <div className="end_at">{show.end_at.toLocaleString()}</div>
              </ListItem>
            ))
        ) : (
          <TooMany>more than {CUTOFF} — shift-drag to zoom in</TooMany>
        )}
      </ListWrapper>
    )
  }
}

const ListWrapper = styled.div`
  background: #fff;
  flex: 1 0 40%;
  overflow: scroll;
`

const ListItem = styled.div`
  margin: 0.5em;

  .name {
    /* font-weight: bold; */
  }

  .address {
    color: purple;
  }
`
const TooMany = styled.div`
  color: red;
`
