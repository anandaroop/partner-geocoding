import React from 'react'
import styled, { css } from 'styled-components'
import _ from 'lodash'

import { SORTS } from './App'

const currentAddress = loc => {
  const { address, address2 } = loc.properties.attributes
  return [address, address2].filter(x => x).join(', ')
}

export class Locations extends React.Component {
  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  handleKeyUp = e => {
    // ignore if focused in search field
    if (document.activeElement.type !== 'search') {
      if (e.key === '/') {
        document.querySelector('input[type="search"]').focus()
      }
      // ignore arrows if focused in map
      if (!document.activeElement.classList.contains('leaflet-container')) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          const { selectedId, locations, selectLocation } = this.props
          // find current index
          const currentLocation = _.find(
            locations,
            loc => loc.properties.attributes._id === selectedId
          )
          const currentIndex = locations.indexOf(currentLocation)
          // increment or decrement to find next location
          const delta = e.key === 'ArrowLeft' ? -1 : +1
          const newIndex = _.clamp(
            currentIndex + delta,
            0,
            locations.length - 1
          )
          const newLocation = locations[newIndex]
          const newId = newLocation.properties.attributes._id
          // update app state and browser focus˝
          selectLocation(newId)
          document.querySelector(`[data-location-id="${newId}"]`).focus()
        }
      }
    }
  }

  render() {
    const {
      locations,
      query,
      scraped,
      selectedId,
      selectLocation,
      sort,
      updateQuery,
      updateScraped,
      updateSort
    } = this.props

    return (
      <>
        <Search>
          <Input
            type="search"
            placeholder="Filter locations by keyword"
            value={query}
            onChange={e => updateQuery(e.target.value)}
          />
          <Controls>
            <Group>
              <Label>
                <input
                  type="checkbox"
                  name="scraped"
                  checked={scraped}
                  onChange={e => updateScraped(e.target.checked)}
                />
                Scraped only
              </Label>
            </Group>
            <Group>
              Sort by:
              <Label>
                <input
                  type="radio"
                  checked={sort === SORTS.NAME}
                  name="sort"
                  onChange={() => updateSort(SORTS.NAME)}
                />
                name
              </Label>
              <Label>
                <input
                  type="radio"
                  checked={sort === SORTS.CITY}
                  name="sort"
                  onChange={() => updateSort(SORTS.CITY)}
                />
                city
              </Label>
              <Label>
                <input
                  type="radio"
                  checked={sort === SORTS.DELTA_1}
                  name="sort"
                  onChange={() => updateSort(SORTS.DELTA_1)}
                />
                Δ1
              </Label>
              <Label>
                <input
                  type="radio"
                  defaultChecked={sort === SORTS.DELTA_2}
                  name="sort"
                  onChange={() => updateSort(SORTS.DELTA_2)}
                />
                Δ2
              </Label>
            </Group>
          </Controls>
        </Search>
        <Results>
          <LocationTable>
            <thead>
              <tr>
                <TH
                  className={'clickable'}
                  current={sort === SORTS.NAME}
                  onClick={() => updateSort(SORTS.NAME)}
                >
                  Name
                </TH>
                <TH>Address</TH>
                <TH
                  className={'clickable'}
                  current={sort === SORTS.CITY}
                  onClick={() => updateSort(SORTS.CITY)}
                >
                  City
                </TH>
                <TH
                  className={'clickable'}
                  current={sort === SORTS.DELTA_1}
                  onClick={() => updateSort(SORTS.DELTA_1)}
                >
                  Δ1 (m)
                </TH>
                <TH
                  className={'clickable'}
                  current={sort === SORTS.DELTA_2}
                  onClick={() => updateSort(SORTS.DELTA_2)}
                >
                  Δ2 (m)
                </TH>
              </tr>
            </thead>
            <tbody>
              {locations.map(loc => (
                <TR
                  key={loc.properties.attributes._id}
                  current={loc.properties.attributes._id === selectedId}
                  onClick={e => {
                    e.preventDefault()
                    selectLocation(loc.properties.attributes._id)
                    document
                      .querySelector(
                        `[data-location-id="${loc.properties.attributes._id}"]`
                      )
                      .focus()
                  }}
                >
                  <TD className="name">{loc.properties.partner_name}</TD>
                  <TD
                    data-location-id={loc.properties.attributes._id}
                    tabIndex={0}
                    className="address"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        selectLocation(loc.properties.attributes._id)
                      }
                    }}
                  >
                    <OldAddress>{currentAddress(loc)}</OldAddress>
                    {loc.properties.new_address_string && (
                      <NewAddress>
                        {loc.properties.new_address_string}
                      </NewAddress>
                    )}
                  </TD>
                  <TD className="city">{loc.properties.assigned_city}</TD>
                  <TD className="redo">
                    {Math.round(
                      1000 * loc.properties.geocodes.redo_old_address.distance
                    ).toLocaleString()}
                  </TD>
                  <TD className="scrape">
                    {Math.round(
                      1000 * loc.properties.geocodes.new_address.distance
                    ).toLocaleString()}
                  </TD>
                </TR>
              ))}
            </tbody>
          </LocationTable>
        </Results>
      </>
    )
  }
}

const Search = styled.div`
  height: 6rem;
  display: flex;
  flex-direction: column;
`

const Input = styled.input`
  appearance: none;
  width: calc(100% - 2rem);
  margin: auto;
  padding: 0.5rem;
  font-size: 1rem;
  border: solid 1px #ddd;
`

const Controls = styled.div`
  width: calc(100% - 2rem);
  height: 2rem;
  margin: auto;
  opacity: 0.5;
`

const Group = styled.span`
  margin: 0 1em 0 0;
`

const Label = styled.label`
  padding: 0 0.5em;

  input {
    margin-right: 0.4em;
  }
`

const Results = styled.div`
  height: calc(100vh - 6rem);
  overflow-y: auto;
`

const LocationTable = styled.table`
  border-collapse: collapse;
  width: calc(100% - 2rem);
  margin: auto;
`

const TR = styled.tr`
  outline: solid 2px transparent;
  &:hover {
    outline: solid 2px #f0e0ff;
    cursor: pointer;
  }
  ${p =>
    p.current &&
    css`
      background: #f0e0ff;
    `}
`

const TH = styled.th`
  background: ${p => (p.current ? '#eeddff' : '#f0f0f0')};
  border-left: solid 5px white;
  border-right: solid 5px white;
  padding: 0.5rem;
  position: sticky;
  top: 0;

  &.clickable {
    cursor: pointer;
  }
`

const TD = styled.td`
  padding: 0.75rem 0.5em;
  border-bottom: solid 1px #eee;
  vertical-align: top;

  &.name {
    width: 20%;
    font-weight: bold;
  }
  &.address {
    width: 40%;
  }
  &.city {
    width: 20%;
    text-align: center;
    color: #999;
  }
  &.redo {
    width: 10%;
    text-align: right;
    color: #999;
  }
  &.scrape {
    width: 10%;
    text-align: right;
    color: #999;
  }
`

const OldAddress = styled.div``

const NewAddress = styled.div`
  padding: 0.25em 0;
  margin: 0.25em 0;
  /* border-top: solid 1px #abf; */
  color: #9ae;
`

// const TK = () => <span style={{ color: '#999' }}>TK</span>
