import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'

export const getDatabase = async jsonPath => {
  const adapter = new LocalStorage('db')
  const db = low(adapter)

  if (isEmpty(db)) {
    await seedDatabaseFromJson(db, jsonPath)
  }
  return db
}

const isEmpty = db => {
  const collections = db.keys().value()
  return collections.length === 0
}

const seedDatabaseFromJson = async (db, jsonPath) => {
  try {
    const url = new URL(jsonPath, document.location.origin)
    const response = await fetch(url)
    const json = await response.json()
    db.setState({ features: json.features }).write()
  } catch (err) {
    throw new Error(`Could not seed database from JSON path ${jsonPath}`)
  }
}
