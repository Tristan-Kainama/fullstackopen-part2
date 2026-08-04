import { useState, useEffect } from 'react'
import countriesService from './services/countries.js'

function SearchForm({ search, handleCountryChange }) {
  return (
    <form>
      <div>
        find countries <input value={search} onChange={handleCountryChange} />
      </div>
    </form>
  )
}

function Output({ filteredAmount, filteredCountries, handleShowCountry }) {
  if (filteredAmount > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (filteredAmount > 1) {
    return (
      <>
        {filteredCountries.map((country) => (
          <div key={country.name.common}>
            <p>{country.name.common}</p>
            <button onClick={() => handleShowCountry(country)}>Show</button>
          </div>
        ))}
      </>
    )
  }

  if (filteredAmount === 1) {
    const country = filteredCountries[0]

    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>Capital {country.capital?.join(', ')}</p>
        <p>Area {country.area}</p>
        <h3>Languages</h3>
        <ul>
          {Object.entries(country.languages ?? {}).map(([code, name]) => (
            <li key={code}>{name}</li>
          ))}
        </ul>
        <img src={country.flags?.png} alt={`Flag of ${country.name.common}`} width="150" />
      </div>
    )
  }

  return <p>No countries found</p>
}

function App() {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    countriesService.getAll().then((initialCountries) => {
      setCountries(initialCountries)
      setFilteredCountries(initialCountries)
    })
  }, [])

  const handleCountryChange = (event) => {
    const newSearch = event.target.value
    setSearch(newSearch)

    const nextFilteredCountries = countries.filter((country) =>
      country.name.common.toLowerCase().includes(newSearch.toLowerCase())
    )

    setFilteredCountries(nextFilteredCountries)
  }

  const handleShowCountry = (country) => {
    setSearch(country.name.common)
    setFilteredCountries([country])
  }

  const filteredAmount = filteredCountries.length

  return (
    <div>
      <SearchForm search={search} handleCountryChange={handleCountryChange} />
      <Output
        filteredAmount={filteredAmount}
        filteredCountries={filteredCountries}
        handleShowCountry={handleShowCountry}
      />
    </div>
  )
}

export default App
