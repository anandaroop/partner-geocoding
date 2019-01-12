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
      <input
        type="search"
        value={query}
        onChange={e => updateQuery(e.target.value)}
      />
      <Table>
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
              <TD>{loc.properties.partner_name}</TD>
              <TD>{currentAddress(loc)}</TD>
              <TD>city tk</TD>
              <TD>Δredo tk</TD>
              <TD>Δscrape tk</TD>
            </TR>
          ))}
        </tbody>
      </Table>
    </>
  )
}

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`

const TR = styled.tr`
  &:hover {
    background: #eee;
    cursor: pointer;
  }
`

const TH = styled.th`
  padding: 0.5em;
`

const TD = styled.td`
  padding: 0.5em;
`
