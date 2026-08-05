import { useState, useEffect } from 'react'
import countriesService from './services/countries.js'
import axios from 'axios'

function SearchForm({ search, handleCountryChange }) {
  return (
    <form>
      <div>
        find countries <input value={search} onChange={handleCountryChange} />
      </div>
    </form>
  )
}

function CountryWeather({ country }) {
  const [temp, setTemp] = useState(null)
  const [wind, setWind] = useState(null)
  const [img, setImg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_SOME_KEY

    if (!apiKey) {
      setLoading(false)
      return
    }

    const capital = country.capital?.join(' ') || country.name.common

    axios
      .get(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(capital)}&limit=1&appid=${apiKey}`)
      .then((response) => {
        const location = response.data[0]
        if (!location) {
          return null
        }

        return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}`)
      })
      .then((response) => {
        if (!response) {
          return
        }

        setTemp((response.data.main.temp - 273.15).toFixed(1))
        setWind(response.data.wind.speed)
        setImg(`https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
      })
      .catch(() => {
        setTemp(null)
        setWind(null)
        setImg('')
      })
      .finally(() => setLoading(false))
  }, [country])

  if (loading) {
    return <p>Loading weather...</p>
  }

  if (temp === null) {
    return <p>Weather unavailable</p>
  }

  return (
    <>
      <h2>Weather in {country.capital?.join(', ')}</h2>
      <p>Temperature {temp} °C</p>
      <img src={img} alt="Weather icon" width="150" />
      <p>Wind {wind} m/s</p>
    </>
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

        <CountryWeather country={country} />
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
