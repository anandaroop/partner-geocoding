import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server'
import styled from 'styled-components'
import L from 'leaflet'
import 'leaflet-providers'
import 'leaflet.markercluster'
import 'leaflet.heat'

import './App.css'
import allFeatures from './all_the_locations.json' // should be GeoJSON

/*** CONFIG ***/

const SHOW_CLUSTERS = true
const CLUSTERS_ZOOM_THRESHOLD = 16
const CLUSTER_RADIUS = 30

const LIST_SIZE_THRESHOLD = 1000

// const TILE_PROVIDER = "OpenStreetMap.BlackAndWhite"
// const TILE_PROVIDER = "OpenMapSurfer.Grayscale"
// const TILE_PROVIDER = "Stamen.Toner"
const TILE_PROVIDER = 'CartoDB.Voyager'

/**************/

const cmsLocationLink = feature => (
  <a
    target="cms"
    href={`https://cms-staging.artsy.net/locations/${
      feature.properties.id
    }?current_partner_id=${feature.properties.partner_id}`}
  >
    {`${feature.properties.name || '(missing)'}`}
  </a>
)

export default class App extends Component {
  constructor(props) {
    super(props)
    this._features = this.prepareInitialFeatures()
    this.state = {
      filteredFeatures: [],
      date: new Date(),
      windowInDays: 90,
      bounds: null
    }
  }

  // componentDidMount() {
  //   this.filterFeatures()
  // }

  prepareInitialFeatures = () => {
    const parsedLocations = allFeatures.features
      .filter(f => f.geometry.coordinates[1] && f.geometry.coordinates[0])
      .map(feature => {
        return {
          ...feature
        }
      })
    return parsedLocations
  }

  filterFeatures = () => {
    const filteredFeatures = this._features.filter(feature =>
      this.state.bounds.contains({
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0]
      })
    )
    this.setState({ filteredFeatures })
  }

  setBounds = bounds => {
    this.setState({ bounds }, () => {
      this.filterFeatures()
    })
  }

  render() {
    return (
      <Wrapper>
        <Map features={this.state.filteredFeatures} onMove={this.setBounds} />
        <List
          features={this.state.filteredFeatures}
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
    if (SHOW_CLUSTERS) {
      this.replaceClusters()
      this.replaceHeat()
    } else {
      this.replaceMarkers()
    }
  }

  prepareMap = () => {
    this._map = L.map(this._mapRef.current)
    L.tileLayer.provider(TILE_PROVIDER).addTo(this._map)

    this._map.setView([0, 0], 2)
    // this._map.setView([40.72, -74], 16)

    this._markers = L.layerGroup().addTo(this._map)

    this._clusters = L.markerClusterGroup({
      maxClusterRadius: CLUSTER_RADIUS,
      zoomToBoundsOnClick: false
    }).addTo(this._map)

    this._heat = L.heatLayer([], {
      radius: CLUSTER_RADIUS,
      blur: CLUSTER_RADIUS / 2
    }).addTo(this._map)
  }

  replaceMarkers = () => {
    this._markers.clearLayers()
    const { features } = this.props
    if (features.length < 200) {
      features.forEach(feature => {
        this._markers.addLayer(
          L.marker([
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0]
          ])
        )
      })
    }
  }

  replaceClusters = () => {
    this._clusters.clearLayers()
    const { features } = this.props
    // if (features.length < 200) {
    if (this._map.getZoom() >= CLUSTERS_ZOOM_THRESHOLD) {
      features.forEach(feature => {
        this._clusters.addLayer(
          L.marker([
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0]
          ])
            .bindPopup(ReactDOMServer.renderToString(cmsLocationLink(feature)))
            .on('mouseover', el => el.target.openPopup())
        )
      })
    }
  }

  replaceHeat = () => {
    const { features } = this.props
    const points = features.map(s => s.geometry.coordinates.reverse()) // geojson = lng,lat ; leaflet-heat = lat,lng
    this._heat.setLatLngs(points)
  }

  addListeners = () => {
    this._map.on('moveend', this.handleMove)
    // this._clusters.on('clusterclick', this.handleClusterClick)
  }

  handleMove = e => {
    this.props.onMove(this._map.getBounds())
  }

  // handleClusterClick = e => {
  //   e.layer
  //     .getAllChildMarkers()
  //     .forEach(m => console.log(m.getPopup().getContent()))
  // }

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
  flex-grow: 10;
`

class List extends React.Component {
  render() {
    const { features, center } = this.props
    return (
      <ListWrapper>
        <CurrentCount>
          {features.length} results within current bounds
        </CurrentCount>
        {features.length < LIST_SIZE_THRESHOLD ? (
          features
            .sort((s1, s2) => {
              const p1 = L.latLng(
                s1.geometry.coordinates[1],
                s1.geometry.coordinates[0]
              )
              const p2 = L.latLng(
                s2.geometry.coordinates[1],
                s2.geometry.coordinates[0]
              )
              return p1.distanceTo(center) - p2.distanceTo(center)
            })
            .map(feature => (
              <ListItem key={feature.properties.id}>
                <div className="name">{cmsLocationLink(feature)}</div>
                <div className="address">
                  {[feature.properties.address, feature.properties.city].join(
                    ', '
                  )}
                </div>
                <div className="coordinates">
                  {feature.geometry.coordinates[1].toFixed(6)},
                  {feature.geometry.coordinates[0].toFixed(6)}
                </div>
                {/* <div className="end_at">{feature.end_at.toLocaleString()}</div> */}
              </ListItem>
            ))
        ) : (
          <TooMany>
            more than {LIST_SIZE_THRESHOLD} — shift-drag to zoom in
          </TooMany>
        )}
      </ListWrapper>
    )
  }
}

const ListWrapper = styled.div`
  background: #fff;
  flex: 1 0 20em;
  overflow: scroll;
  padding: 1em;
`

const CurrentCount = styled.p`
  font-weight: bold;
`
const ListItem = styled.div`
  margin: 0.5em 0;
  line-height: 1.2rem;

  .name {
    /* font-weight: bold; */
  }

  .address {
    color: purple;
    font-size: 0.8rem;
  }

  .coordinates {
    color: gray;
    font-size: 0.8rem;
  }
`
const TooMany = styled.div`
  color: red;
  margin: 1em 0;
`
