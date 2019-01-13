import React from 'react'
import styled from 'styled-components'

const currentAddress = loc => {
  const { address, address2 } = loc.properties.attributes
  return [address, address2].filter(x => x).join(', ')
}

export const Locations = ({
  locations,
  query,
  updateQuery,
  selectLocation
}) => {
  return (
    <>
      <Search>
        <Input
          type="search"
          placeholder="Filter locations by keyword"
          value={query}
          onChange={e => updateQuery(e.target.value)}
        />
      </Search>
      <Results>
        <LocationTable>
          <thead>
            <tr>
              <TH>Name</TH>
              <TH>Address</TH>
              <TH>City</TH>
              <TH>Δ1</TH>
              <TH>Δ2</TH>
            </tr>
          </thead>
          <tbody>
            {locations.map(loc => (
              <TR
                key={loc.properties.attributes._id}
                onClick={e => {
                  e.preventDefault()
                  selectLocation(loc.properties.attributes._id)
                }}
              >
                <TD className="name">{loc.properties.partner_name}</TD>
                <TD className="address">{currentAddress(loc)}</TD>
                <TD className="city">
                  <TK />
                </TD>
                <TD className="redo">
                  <TK />
                </TD>
                <TD className="scrape">
                  <TK />
                </TD>
              </TR>
            ))}
          </tbody>
        </LocationTable>
      </Results>
    </>
  )
}

const Search = styled.div`
  height: 4rem;
  display: flex;
`

const Results = styled.div`
  height: calc(100vh - 4rem);
  overflow-y: auto;
`

const Input = styled.input`
  appearance: none;
  width: calc(100% - 2rem);
  margin: auto;
  padding: 0.5rem;
  font-size: 1rem;
  border: solid 1px #ddd;
`

const LocationTable = styled.table`
  border-collapse: collapse;
  width: 100%;
`

const TR = styled.tr`
  &:hover {
    background: #f0e0ff;
    cursor: pointer;
  }
`

const TH = styled.th`
  background: #f8f8f8;
  border-left: solid 5px white;
  border-right: solid 5px white;
  padding: 0.5rem;
  position: sticky;
  top: 0;
`

const TD = styled.td`
  padding: 0.5rem;

  &.name {
    width: 20%;
  }
  &.address {
    width: 40%;
  }
  &.city {
    width: 20%;
    text-align: center;
  }
  &.redo {
    width: 10%;
    text-align: center;
  }
  &.scrape {
    width: 10%;
    text-align: center;
  }
`

const TK = () => <span style={{ color: '#999' }}>TK</span>
