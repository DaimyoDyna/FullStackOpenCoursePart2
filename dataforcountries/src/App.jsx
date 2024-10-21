import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {

  //initialising states:
  const [countries, setCountries] = useState(["a","b","c","d","e","f","g","h","i","j","k"]) //ensures that we don't have a massive list of countries before typing into search
  const [allCountries, setAllCountries] = useState([])
  const [showBio, setShowBio] = useState('') //used for keeping track of which country bio should be shown
  const [lat, setLat] = useState(0.0) //current latitude for use with weather API
  const [lng, setLng] = useState(0.0) //current longitude for use with weather API
  const [weatherData, setWeatherData] = useState([]) //all weather data based on lat&lng of capital city
  const [icon, setIcon] = useState('') //code for icon

  //my API key: 3d5f450e7c1cded1614567ef479649c3
  //full command: set "VITE_SOME_KEY=3d5f450e7c1cded1614567ef479649c3" && npm run dev
  const api_key = import.meta.env.VITE_SOME_KEY//environment variable: API key for weather API

  const handleSearch = (event) => {
    //handles the changes in the search field
    const currentSearch = event.target.value
    //console.log(search)
    updateSearch({ setCountries, allCountries, currentSearch })
  }

  const updateSearch = ({ setCountries, allCountries, currentSearch }) => {
    setCountries(allCountries.filter(country => country.name.common.toLowerCase().includes(currentSearch.toLowerCase())))
  }

  const handleShowCountry = (country) => {
    setShowBio(country)
    setLat(country.capitalInfo.latlng[0])
    setLng(country.capitalInfo.latlng[1])
  }

  useEffect(() => { //initialises list of all countries
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all/')
      .then(response => {
        setAllCountries(response.data)
      })
  }, []) //done only once!

  useEffect(() => { //this useEffect ensures that showBio is always updated AFTER countries
    if (countries.length === 1) {
      setShowBio(countries[0])
      setLat(countries[0].capitalInfo.latlng[0])
      setLng(countries[0].capitalInfo.latlng[1])
    } else {
      setShowBio('') //showBio needs to be reset so that bios don't hang around afterwards
      setLat(0.0) //might as well reset these as well
      setLng(0.0)
      setWeatherData([])
      setIcon('')
    }
  }, [countries]) //updated whenever countries changes (changes with search)

  useEffect(() => {
    //units set to metric via parameters, since we need Celsius:
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${api_key}&units=metric`)
      .then(response => {
        setWeatherData(response.data)
        setIcon(response.data.weather[0].icon) //this is just the code for the icon
      })
  }, [lat, lng])

  const countryBio = () => { //returns the full bio for one specific country
    if (showBio != '') {
      const country = showBio
      const languageList = Object.values(country.languages) //list of languages for the specific country
      return(
        <div>
          <h1>{country.name.common}</h1>
          <p>capital {country.capital}<br />
          area {country.area}</p>
          <h3>languages:</h3>
          <ul>  
            {languageList.map(language => (
              <li key={language}>
                {language}
              </li>
            ))}
          </ul>
          <img src={country.flags.png}></img>
          <h2>Weather in {country.capital}</h2>
          <p>temperature {weatherData.main ? weatherData.main.temp : '__'} Celcius</p>
          <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`}></img>
          <p>wind {weatherData.wind ? weatherData.wind.speed : '__'} m/s</p>
        </div>
      )
    }
  }

  const countryList = () => {
    if (countries.length === 1) { //single country view
      return <>{countryBio()}</>
    } else if (countries.length < 11) { //list of countries
      return (
        <div>
          <ul>
            {countries.map(country => (
              <li key={country.name.common}>
                {country.name.common}
                <button type="button" onClick={() => handleShowCountry(country)}>show</button>
              </li>
            ))}
          </ul>
          <>{countryBio()}</>
        </div>
      )
    } else { //more than 10 countries
      return <p>Too many matches, specify another filter</p>
    }
  }

  return (
    <>
      <div>
        find countries <input onChange={handleSearch} />
      </div>
      <div>
        {countryList()}
      </div>
    </>
  )
}

export default App
