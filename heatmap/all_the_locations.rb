# frozen_string_literal: true

puts JSON.pretty_generate(
  type: 'FeatureCollection',
  features: PartnerLocation.limit(1000).map do |loc|
    {
      type: 'Feature',
      properties: {
        name: loc.partner&.name,
        id: loc.id,
        # publicly_viewable: loc.publicly_viewable,
        # skip_geocoding: loc.skip_geocoding,
        partner_id: loc.partner&.id,
        address: loc.address,
        city: loc.city
      },
      geometry: {
        type: 'Point',
        coordinates: [loc.coordinates&.x, loc.coordinates&.y]
      }
    }
  end
)
