import React, { useState, useEffect} from 'react';
import { ComposableMap, Geographies, Geography, Marker} from "react-simple-maps";
import geoData from "./map.json";
import './App.css';
import axios from "axios";
const url = `${process.env.REACT_APP_BACKEND_URL}`;

function App() {
  const disableGeo = !("geolocation" in navigator);
  const [count, setCount] = useState(() => {
    let storedCount = JSON.parse(window.localStorage.getItem('count'));
    return storedCount === null ? 0 : storedCount;
  });
  //d3-geo specifies locations as [lon, lat]
  const [locations, setLocations] = useState([]);
  // [{"longitude":-74.006,"latitude":40.7128},{"longitude":121.46,"latitude":31.22}]
  const [isLocationSent, setLocationSent] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    window.localStorage.setItem('count', count);
    async function fetchMap() {
      try {
        const result = await axios.get(`${url}`);
        setLocations(result.data.locations);
        setLoaded(true);
      } catch (error) {
        console.log(error);
      }
    }
    fetchMap();
  }, [count]);

  const handleClick = () => {
    if (!disableGeo && !isLocationSent){
      navigator.geolocation.getCurrentPosition((position)=> {
        axios.post(`${url}`,{
          location: {"longitude":position.coords.longitude.toFixed(4),"latitude":position.coords.latitude.toFixed(4)}
        })
        .then((response) => {
          setLocationSent(true);
          console.log("Location successfully saved!");
        })
        .catch((error) => {
          console.log("Location successfully saved!");
          console.log(error);
        });
      });
    }
    setCount(count+1);
  }

  const elem = 
  <div className="App">
    <header className="App-header">
      <h1> Click ON Earth </h1>    
      <button onClick={handleClick} className='button'>{count}</button>
      <div>
        <ComposableMap style={{ width: "100%" }}>
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} 
                  geography={geo} 
                  fill="#6495ed"
                  stroke="#f0f8ff"/>
              ))
            }
          </Geographies>
          {locations.map(l => <Marker key={locations.findIndex(e=>e.longitude === l.longitude && e.latitude ===l.latitude)} coordinates={[l.longitude,l.latitude]}> <circle r={6} fill="#F53" /> </Marker>)}
        </ComposableMap>
      </div>
    </header>
  </div>

  if (!loaded) return (
    <div className="App">
      <header className="App-header">
        <h1> Challenge Level 1</h1>
        <h2> Loading ... </h2>
      </header>
    </div>
  )
  else return elem;
}

export default App;
