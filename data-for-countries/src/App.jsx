import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import CountryList from './components/CountryList'
import CountryDetail from './components/CountryDetail'

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])

  // Fetch all countries once when the app starts
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  // Filter countries based on input
  const countriesToShow = query
    ? countries.filter(c => 
        c.name.common.toLowerCase().includes(query.toLowerCase())
      )
    : []

  // Function for the "Show" button to select a country
  const handleShowClick = (name) => setQuery(name)

  return (
    <div>
      <Filter value={query} onChange={(e) => setQuery(e.target.value)} />
      
      <div>
        {countriesToShow.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : countriesToShow.length > 1 ? (
          <CountryList countries={countriesToShow} onShow={handleShowClick} />
        ) : countriesToShow.length === 1 ? (
          <CountryDetail country={countriesToShow[0]} />
        ) : query && <p>No matches found</p>}
      </div>
    </div>
  )
}

export default App