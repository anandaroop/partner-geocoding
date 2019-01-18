import React, { Component } from 'react'
import styled from 'styled-components'
import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'

export class FeatureCollectionViewer extends Component {
  _db = null
  state = {
    isReady: false,
    query: '',
    currentFeatureId: null
  }

  updateQuery = () => {}

  componentDidMount() {
    this.prepareDatabase(this.props.featureCollection.features)
  }

  prepareDatabase = features => {
    const adapter = new LocalStorage('db')
    this._db = low(adapter)

    if (isEmpty(this._db)) {
      console.log('Seeding', features.length, 'features')
      this._db.setState({ features }).write()
    }
    this.setState({ isReady: true })
  }

  render() {
    if (!this.state.isReady) return null

    const { renderFeatureToList, renderFeatureToMap } = this.props
    const { currentFeatureId } = this.state

    const matchingFeatures = this._db.get('features').value()
    const currentFeature = currentFeatureId
      ? this._db
          .get('features')
          .find(f => f.id._id === currentFeatureId)
          .value()
      : null

    return (
      <div>
        <FeaturePane>
          <FeatureSearch onUpdateQuery={this.updateQuery} />
          <FeatureList
            features={matchingFeatures}
            renderFeatureToList={renderFeatureToList}
          />
        </FeaturePane>
        <MapPane>
          <FeatureMap
            currentFeature={currentFeature}
            renderFeatureToMap={renderFeatureToMap}
          />
        </MapPane>
      </div>
    )
  }
}

const FeaturePane = styled.div``
const MapPane = styled.div``

const FeatureSearch = () => <div>FeatureSearch</div>
const FeatureList = ({ features, renderFeatureToList }) => (
  <ul>{features.map(f => renderFeatureToList(f))}</ul>
)
const FeatureMap = () => <div>FeatureMap</div>

const isEmpty = db => {
  const collections = db.keys().value()
  return collections.length === 0
}
