import React, { useState } from "react"
import axios from "axios"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { Form, ListGroup } from "react-bootstrap"

function WeatherApp() {
    const [weatherData, setWeatherData] = useState({})
    const [locationData, setLocationData] = useState("")
    const [suggestions, setSuggestions] = useState([]);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${locationData}&appid=f1032ef34fa5f2895e4d4258da67b24d&units=metric`

    // fetch weather based on the city name
    function fetchWeather() {
        setSuggestions([])
        axios
            .get(url)
            .then((response) => {
                setWeatherData(response.data);
            })
            .catch((error) => {
                console.error("ERROR FETCHING WEATHER DATA:", error);
            });
    };

    // handle city input change and provide suggestions
    const handleInputChange = (event) => {
        const query = event.target.value;
        setLocationData(query);

        if (query.length > 1) {
            // fetch city suggestions from the geocoding API
            axios
                .get(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=f1032ef34fa5f2895e4d4258da67b24d`)
                .then((response) => {
                    setSuggestions(response.data.slice(0, 3));
                })
                .catch((error) => {
                    console.error("ERROR FETCHING CITY SUGGESTIONS:", error);
                });
        } else setSuggestions([]);
    };

    function handleCitySelect(city) {
        setLocationData(city.name.toLowerCase());
        fetchWeather(); // fetch the weather data for the selected city
    };

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const date = new Date();
    let date_text = `${months[date.getMonth()]} ${date.getDate()}, ${date.toLocaleTimeString()}`

    return (
        <div>
            <div className="text-center" style={{ marginTop: "5rem" }}>
                <p className="display-3">weather</p>
                <hr className="w-25 mx-auto" />
            </div>
            <div className="w-25 mx-auto container col-md-5 ms-md-auto">
                <Form.Control
                    type="text"
                    placeholder="Enter city name"
                    value={locationData}
                    onChange={handleInputChange}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && locationData) fetchWeather();
                    }}
                    className="bg-transparent border mb-2"
                />
                {suggestions.length > 0 && (
                    <ListGroup>
                        {suggestions.map((city, index) => (
                            <ListGroup.Item className="bg-transparent list-group-item-action" key={index} onClick={() => {
                                setLocationData(city.name.toLowerCase());
                                fetchWeather()
                            }} >
                                {city.name}, {city.country}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </div>

            {weatherData.name !== undefined &&
                <div className="w-25 mx-auto container col-md-5 ms-md-auto bg-transparent p-2 px-4 rounded-3 mt-3 border">
                    <div className="mt-3">
                        <div className="row" >
                            <FontAwesomeIcon className="location-icon col-1 p-0" style={{ marginTop: "0.4rem", fontSize: "1.5rem" }} icon={faLocationDot} /> <p style={{ fontSize: "1.5rem" }} className="col-6 mx-auto p-0"><strong>{weatherData.name}</strong></p>
                            <p className="col text-end ">{date_text}</p>
                        </div>
                        {weatherData.main ? <p className="text-end mb-0" style={{ fontSize: "4rem" }}>{weatherData.main.temp.toFixed()}°C</p> : null}
                    </div>
                    <hr className="mt-0 mb-1 "></hr>
                    <div className="row">
                        <div className="col">
                            <p>{weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1)}</p>
                            {weatherData.main ? <p>Feels like <strong>{weatherData.main.feels_like.toFixed()}°C</strong></p> : null}
                        </div>
                        <div className="col text-end">
                            {weatherData.main ? <p>Humidity: <strong>{weatherData.main.humidity.toFixed()}%</strong></p> : null}
                            {weatherData.wind ? <p>{weatherData.wind.speed.toFixed()} m/s</p> : null}
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}

export default WeatherApp
