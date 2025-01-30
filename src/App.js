import React, { useState } from "react"
import axios from "axios"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLocationDot, faCloudBolt } from "@fortawesome/free-solid-svg-icons"

function WeatherApp() {
    const [weatherData, setWeatherData] = useState({})
    const [locationData, setLocationData] = useState("")
    const [suggestions, setSuggestions] = useState([]);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${locationData}&appid=f1032ef34fa5f2895e4d4258da67b24d&units=metric`

    // Fetch weather based on the city name
    const fetchWeather = () => {
        axios
            .get(url)
            .then((response) => {
                setWeatherData(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error("ERROR FETCHING WEATHER DATA:", error);
            });
    };

    // Handle city input change and provide suggestions
    const handleInputChange = (event) => {
        const query = event.target.value;
        setLocationData(query);

        if (query.length > 1) {
            // Fetch city suggestions from the geocoding API
            axios
                .get(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=f1032ef34fa5f2895e4d4258da67b24d`)
                .then((response) => {
                    setSuggestions(response.data.slice(0, 3)); 
                })
                .catch((error) => {
                    console.error("ERROR FETCHING CITY SUGGESTIONS:", error);
                });
        } else {
            setSuggestions([]);
        }
    };

    // Handle city selection
    const handleCitySelect = (city) => {
        setLocationData(city.name); // Set the selected city
        setSuggestions([]); // Clear suggestions
        fetchWeather(); // Fetch the weather data for the selected city
    };

    /* const searchLocationData = (event) => {
        if (event.key === "Enter") {
            axios.get(url)
                .then((response) => {
                    setWeatherData(response.data)
                    console.log(response.data)
                })
                .catch(error => {
                    console.error("ERROR FETHCHING WEATHER DATA:", error)
                })
            setLocationData("")
        }
    } */

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const date = new Date();
    let date_text = `${months[date.getMonth()]} ${date.getDate()}, ${date.toLocaleTimeString()}`

    return (
        <div className="app">
            <div className="title">
            <FontAwesomeIcon className="title-icon" icon={faCloudBolt} /> <h1>weather app</h1> <br></br>
            </div>
            <div className="search">
                <input type="text" placeholder="Enter City Name" value={locationData} onChange={handleInputChange} onKeyDown={(event) => {
                    if (event.key === "Enter" && locationData) {
                        fetchWeather();
                        setSuggestions([]); // Clear suggestions when Enter is pressed
                    }
                }}
                />
                {suggestions.length > 0 && (
                    <ul className="suggesstions-list">
                        {suggestions.map((city, index) => (
                            <li key={index} onClick={() => handleCitySelect(city)} className="p-2 hover:bg-gray-200 cursor-pointer">
                                {city.name}, {city.country}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {weatherData.name !== undefined &&
                <div className="container">
                    <div className="top">
                        <div className="location">
                            <FontAwesomeIcon className="location-icon" icon={faLocationDot} /> <p>{weatherData.name}</p>
                        </div>
                        <div className="date">
                            <p>{date_text}</p>
                        </div>
                        <div className="temperature">
                            {weatherData.main ? <p>{weatherData.main.temp.toFixed()}°C</p> : null}
                        </div>
                    </div>
                    <div className="bottom">
                        <div className="description">
                            <p>{weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1)}</p>
                        </div>
                        <div className="feels">
                            {weatherData.main ? <p>Feels like {weatherData.main.feels_like.toFixed()}°C</p> : null}
                        </div>
                        <div className="humidity">
                            {weatherData.main ? <p>Humidity: {weatherData.main.humidity.toFixed()}%</p> : null}
                        </div>
                        <div className="wind">
                            {weatherData.wind ? <p>{weatherData.wind.speed.toFixed()} m/s</p> : null}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default WeatherApp
