import React, { Component } from 'react'
import styled from 'styled-components'
import { Locations } from './Locations'
import { Map } from './Map'
import { getDatabase } from './db.js'

const SORTS = {
  NAME: 'NAME'
}

class App extends Component {
  _db = null

  state = {
    isLoaded: false,
    sort: SORTS.NAME,
    query: '',
    selectedId: null
  }

  componentDidMount() {
    this.prepareDatabase()
  }

  prepareDatabase = async () => {
    this._db = await getDatabase('/db.json')
    this.setState({
      isLoaded: true
    })
  }

  getSortCriteria = () => {
    switch (this.state.sort) {
      case SORTS.NAME:
        return 'properties.partner_name'
      default:
        return 'properties.partner_name'
    }
  }

  getFilterCriteria = () => {
    const query = this.state.query.toLowerCase()
    const isPresent = query.trim() !== ''
    const predicate = isPresent
      ? loc => loc.properties.partner_name.toLowerCase().includes(query)
      : () => true
    return predicate
  }

  updateQuery = val => {
    this.setState({
      query: val
    })
  }

  selectLocation = locationId => {
    this.setState({
      selectedId: locationId
    })
  }

  render() {
    if (!this.state.isLoaded) {
      return <span>loading...</span>
    }

    const { query, selectedId } = this.state

    const locations = this._db
      .get('features')
      .sortBy(this.getSortCriteria())
      .filter(this.getFilterCriteria())
      .value()

    const selectedLocation = selectedId
      ? this._db
          .get('features')
          .find(f => f.properties.attributes._id === selectedId)
          .value()
      : null

    return (
      <Main>
        <PartnerPane>
          <Locations
            locations={locations}
            query={query}
            updateQuery={this.updateQuery}
            selectLocation={this.selectLocation}
          />
        </PartnerPane>
        <MapPane>
          <Map location={selectedLocation} />
        </MapPane>
      </Main>
    )
  }
}

export default App

const Main = styled.main`
  display: flex;
  height: 100vh;
`

const PartnerPane = styled.div`
  flex: 1 0 60%;
  max-width: 50rem;
  padding: 1rem;
`

const MapPane = styled.div`
  flex: 1 0 40%;
`
