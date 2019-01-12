import React from 'react'
import styled from 'styled-components'

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
      <ul>
        {locations.map(loc => (
          <LI key={loc.properties.attributes._id}>
            <a
              href={loc.properties.partner_slug}
              onClick={e => {
                e.preventDefault()
                selectLocation(loc.properties.attributes._id)
              }}
            >
              {loc.properties.partner_name}
            </a>
          </LI>
        ))}
      </ul>
    </>
  )
}

const LI = styled.li`
  list-style: none;
  padding: 0.25em 0;
`
