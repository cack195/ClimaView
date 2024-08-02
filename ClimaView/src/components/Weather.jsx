import React, { useState } from "react";
import DisplayWeather from "./DisplayWeather";
import "./weather.css";

function Weather() {
  const [weather, setWeather] = useState(null);
  const [form, setForm] = useState({
    city: "",
    country: "",
  });

  const APIKEY = " "; 
  // create an API key from https://openweathermap.org/

  async function getCoordinates(city, country) {
    const geoData = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=1&appid=${APIKEY}`
    ).then((res) => res.json());
    if (geoData.length > 0) {
      console.log( geoData[0].lat,  geoData[0].lon);
      return { lat: geoData[0].lat, lon: geoData[0].lon };
    } else {
      alert("Location not found");
      return null;
    }
  }

  async function weatherData(e) {
    e.preventDefault();
    if (form.city === "" || form.country === "") {
      alert("Add values");
    } else {
      const coordinates = await getCoordinates(form.city, form.country);
      if (coordinates) {
        const data = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly&appid=${APIKEY}`
        )
          .then((res) => res.json())
          .then((data) => data);

        setWeather({ data: data });
      }
    }
  }

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setForm({ ...form, [name]: value });
  };

  return (
    <div className="weather">
      <span className="title">ClimaView</span>
      <br />
      <form>
        <input
          type="text"
          placeholder="City"
          name="city"
          onChange={(e) => handleChange(e)}
        />
        &nbsp; &nbsp; &nbsp;&nbsp;
        <input
          type="text"
          placeholder="Country"
          name="country"
          onChange={(e) => handleChange(e)}
        />
        <button className="getweather" onClick={(e) => weatherData(e)}>
          Submit
        </button>
      </form>

      {weather && weather.data ? (
        <div>
          <DisplayWeather data={weather.data} />
        </div>
      ) : null}
    </div>
  );
}

export default Weather;