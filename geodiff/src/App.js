import React, { Component } from 'react'
// import styled from 'styled-components'

// import _ from 'lodash'
// import { Locations } from './Locations'
// import { Map } from './Map'
// import { getDatabase } from './db.js'
import { FeatureCollectionViewer } from './FeatureCollectionViewer'

class App extends Component {
  state = {
    featureCollection: null
  }

  componentDidMount() {
    const { jsonPath } = this.props
    const url = new URL(jsonPath, document.location.origin)
    this.fetchFeatureCollectionFrom(url)
  }

  fetchFeatureCollectionFrom = async url => {
    const response = await fetch(url)
    const json = await response.json()
    this.setState({ featureCollection: json })
  }

  render() {
    if (this.state.featureCollection === null) return null

    return (
      <FeatureCollectionViewer
        featureCollection={this.state.featureCollection}
        renderFeatureToList={f => <p key={f.id}>{f.properties.partner_name}</p>}
        renderFeatureToMap={feat => {
          // turn feature json into a leaflet UI
        }}
      />
    )
  }
}

export default App

// export const SORTS = {
//   NAME: 'NAME',
//   CITY: 'CITY',
//   DELTA_1: 'DELTA_1',
//   DELTA_2: 'DELTA_2'
// }

// class App extends Component {
//   _db = null

//   state = {
//     isLoaded: false,
//     scraped: false,
//     query: '',
//     selectedId: null,
//     sort: SORTS.NAME
//   }

//   componentDidMount() {
//     this.prepareDatabase()
//   }

//   prepareDatabase = async () => {
//     this._db = await getDatabase('/db.json')
//     this.setState({
//       isLoaded: true
//     })
//   }

//   getSortCriteria = () => {
//     switch (this.state.sort) {
//       case SORTS.NAME:
//         return 'properties.partner_name'
//       case SORTS.CITY:
//         return ['properties.assigned_city', 'properties.partner_name']
//       case SORTS.DELTA_1:
//         return loc =>
//           -1 * _.get(loc, 'properties.geocodes.redo_old_address.distance')
//       case SORTS.DELTA_2:
//         return loc =>
//           -1 * _.get(loc, 'properties.geocodes.new_address.distance')
//       default:
//         return 'properties.partner_name'
//     }
//   }

//   getQueryCriteria = () => {
//     const query = this.state.query.toLowerCase()
//     const isQueryPresent = query.trim() !== ''
//     const fieldsToSearch = [
//       'properties.partner_name',
//       'properties.assigned_city'
//     ]

//     if (!isQueryPresent) return () => true

//     return loc =>
//       fieldsToSearch.some(f => {
//         const val = _.get(loc, f)
//         return val && val.toLowerCase().includes(query)
//       })
//   }

//   getScrapedCriteria = () => {
//     return this.state.scraped ? 'properties.new_address_string' : () => true
//   }

//   updateQuery = val => {
//     this.setState({
//       query: val
//     })
//   }

//   selectLocation = locationId => {
//     this.setState({
//       selectedId: locationId
//     })
//   }

//   updateSort = sort => {
//     this.setState({
//       sort
//     })
//   }

//   updateScraped = scraped => {
//     this.setState({
//       scraped
//     })
//   }

//   render() {
//     if (!this.state.isLoaded) {
//       return <span>loading...</span>
//     }

//     const { query, selectedId, sort, scraped } = this.state

//     const locations = this._db
//       .get('features')
//       .filter(this.getQueryCriteria())
//       .filter(this.getScrapedCriteria())
//       .sortBy(this.getSortCriteria())
//       .value()

//     const selectedLocation = selectedId
//       ? this._db
//           .get('features')
//           .find(f => f.properties.attributes._id === selectedId)
//           .value()
//       : null

//     return (
//       <Main>
//         <PartnerPane>
//           <Locations
//             locations={locations}
//             query={query}
//             scraped={scraped}
//             selectedId={selectedId}
//             selectLocation={this.selectLocation}
//             sort={sort}
//             updateQuery={this.updateQuery}
//             updateScraped={this.updateScraped}
//             updateSort={this.updateSort}
//           />
//         </PartnerPane>
//         <MapPane>
//           <Map location={selectedLocation} />
//         </MapPane>
//       </Main>
//     )
//   }
// }

// export default App

// const Main = styled.main`
//   display: flex;
//   height: 100vh;
// `

// const PartnerPane = styled.div`
//   flex: 1 0 60%;
//   max-width: 55rem;
// `

// const MapPane = styled.div`
//   flex: 1 0 40%;
// `
