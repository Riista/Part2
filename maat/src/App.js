import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({country}) => {
  const [weather, setWeather] = useState()  
  const api = process.env.REACT_APP_API_KEY
  const code = country.cioc.toLowerCase()
  const org = ('https://api.openweathermap.org/data/2.5/weather?q='+country.capital+','+code+'&appid='+api+'&units=metric')
  console.log(org)
  useEffect(() => {
    console.log('effect')
    axios
      .get(org)
      .then(response => {
        console.log('promise fulfilled')
        setWeather(response.data)
      })
  }, [])
  return (
    <>
   <h2> Weather in {country.capital}</h2> 
   <p> temperature {weather? Object.values(weather.main) [0]: '-'} Celsius</p>
   <div> {weather? <img  src={`http://openweathermap.org/img/wn/${Object.values(weather.weather)[0].icon}@2x.png`}></img> : <p> '_' </p>}
  </div>
   <p> wind {weather? Object.values(weather.wind) [0]: '-'} m/s</p>
  
   </>
  )
  
}

function SingleCountry({country}) {
  return (
  <>
  <h2>{country.name.common}</h2> 
  <p>capital {country.capital}</p>
  <p>area {country.area}</p>
  <h3>languages:</h3>
  <div> 
  {Object.values(country.languages).map((value, i) => (
  <li key={i}>{value}</li>))}
  </div>
  <div>
  <img src={country.flags.png}></img>
  </div>
  <Weather country={country}/>
  </>
 );
}

const Results = ({countries, set, toshow}) =>
{
  var l = countries.length;
  
  
  if (toshow) {
    
    return (
   <div> <SingleCountry country={toshow}/>
   </div>
   )
    
  }
  else if (l > 9) {
    return <div> too many matches</div>
  }
  
  else if (l > 1 && l < 10) {
    return (
    
    <div> {countries.map(country => 
      
      <p key={country.name.common}>  {country.name.common} <button onClick={() => set(country)}>show</button> </p> 
    )} </div> )}
    else if (l < 1) {
      return <div> try new search</div>
    }
  
  else {
    return (
      <div> {countries.map(country => 
        <div key={country.name.common}> <SingleCountry country={country}/></div>
      )} 
      </div>
      )}
   
  }


const App = () => {
  const [countries, setCountries] = useState([]) 
  const [newSearch, setNewSearch] = useState("");
  const [searchedCountries, setSearchedCountries] = useState(countries);
  const [countryToShow, setCountryToShow] = useState()
  useEffect(() => {
    console.log('effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])
  console.log('render', countries.length, 'countries')
  const filter = (event) => {
    const keyword = event.target.value;

    if (keyword !== "") {
      const results = countries.filter((country) => {
        return country.name.common.toLowerCase().startsWith(keyword.toLowerCase());
      });
      setSearchedCountries(results);
    } else {
      setSearchedCountries(countries);
    }

    setNewSearch(keyword);
    setCountryToShow();
  };

   
    return (

    <div>
    find countries: <input value={newSearch}
        onChange={filter} />
    <Results countries={searchedCountries} set={setCountryToShow} toshow={countryToShow}/>
    </div>
  )

}















export default App;
