import React, { Component } from 'react'
import styled from 'styled-components'
import { Partners } from './Partners'
import { Map } from './Map'
import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'

class App extends Component {
  _db = null
  state = {
    isLoaded: false
  }

  componentDidMount() {
    this.intializeDB()
  }

  intializeDB = () => {
    const adapter = new LocalStorage('db')
    this._db = low(adapter)

    const url = new URL(`/db.json`, document.location.origin)
    fetch(url)
      .then(response => response.json())
      .then(({ features }) => {
        this._db.setState({ features }).write()
      })
      .then(() => this.setState({ isLoaded: true }))
  }

  render() {
    return (
      <Main>
        {this.state.isLoaded ? (
          <>
            <PartnerPane>
              <Partners />
            </PartnerPane>
            <MapPane>
              <Map />
            </MapPane>
          </>
        ) : (
          <span>loading...</span>
        )}
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
  max-width: 800px;
`

const MapPane = styled.div`
  flex: 1 0 40%;
  background: #eee;
`
