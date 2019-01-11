import React, { Component } from 'react'
import styled from 'styled-components'
import { Partners } from './Partners'
import { Map } from './Map'

class App extends Component {
  render() {
    return (
      <Main>
        <PartnerPane>
          <Partners />
        </PartnerPane>
        <MapPane>
          <Map />
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
  max-width: 800px;
`

const MapPane = styled.div`
  flex: 1 0 40%;
  background: #eee;
`
