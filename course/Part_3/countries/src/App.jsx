import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountryList] = useState([])
  const [message, setMessage] = useState(null)
  const [country, setCountry] = useState(null)

  useEffect(() => {

    if (country) {
      console.log('fetching country list...')
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          const allCountries = response.data;
          const foundCountry = allCountries.filter(c => c.name.common.toLowerCase().includes(country.toLowerCase()));
          console.log(foundCountry);
          if (foundCountry.length > 10) {
            setMessage(`Too many matches, specify another filter`);
            return;
          } else {
            setMessage(null);
            setCountryList(foundCountry)
          }
        })
    }
  }, [country])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const onSearch = (event) => {
    event.preventDefault()
    setCountry(value)
  }
  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
    return (
      <div>
        {message}
      </div>
    )
  }
  const CountryList = ({ countries }) => {
    if (!Array.isArray(countries) || countries.length === 0) {
      return null
    } else if (countries.length === 1) {
      return <CountryDetail country={countries[0]} />
    } else {
      return (
         <ul>
          {countries.map(element => (
            <li key={element.name.common}>
              {element.name.common}
              <button onClick={() => setCountry(element.name.common)}>show</button>
            </li>
          ))}
        </ul>
       )
    }
  }
  const CountryDetail = ({ country }) => {
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital}</p>
        <p>Population: {country.population}</p>
        <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} width="200" />
        <h3>Languages</h3>
        <ul>
          {Object.values(country.languages).map((lang, index) => (  
            <li key={index}>{lang}</li>
          ))}
        </ul>
        <h3>Weather in {country.capital}</h3>
        <div>
          {country.capital && (
            <CapitalWeather capital={country.capital} capitalInfo={country.capitalInfo} />
          )}
        </div>
      </div>
    )
  }
  const CapitalWeather = ({ capital, capitalInfo }) => {
    const [weather, setWeather] = useState(null)
    useEffect(() => {
      if (capital) {
        const lat = capitalInfo?.lat || 0;
        const lon = capitalInfo?.lon || 0;
        axios
          .get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
          .then(response => {
            setWeather(response.data)
          })
      }
    }, [capital])
    if (!weather) {
      return null
    } else {
      return <CurrentWeather weather={weather} />
    }
  }
  const CurrentWeather = ({ weather }) => {
    return (
      <div>
        <p>Temperature: {weather.current_weather.temperature} °C</p>
        <p>Wind Speed: {weather.current_weather.windspeed} m/s</p>
      </div>
    )
  }
  return (
    <div>
      <form onSubmit={onSearch}>
        Countries: <input value={value} onChange={handleChange} />
         <button type="submit">Search countries</button>
      </form>
      <Notification message={message} />
      <CountryList countries={countries} />
    </div>
  )
}

export default App