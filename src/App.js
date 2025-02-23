import React, { useState } from "react"
import axios from "axios"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { Form, ListGroup } from "react-bootstrap"

import "./App.css"

function WeatherApp() {
    const [weatherData, setWeatherData] = useState({})
    const [locationData, setLocationData] = useState("")
    const [suggestions, setSuggestions] = useState([]);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${locationData}&appid=f1032ef34fa5f2895e4d4258da67b24d&units=metric`

    // fetch weather based on the city name
    const fetchWeather = () => {
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
        } else {
            setSuggestions([]);
        }
    };

    // handle city selection
    const handleCitySelect = (city) => {
        setLocationData(city.name); // set the selected city
        setSuggestions([]); // clear suggestions
        fetchWeather(); // fetch the weather data for the selected city
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
        <div>
            <div className="text-center text-warning text-opacity-75" style={{ marginTop: "5rem" }}>
                <p className="display-3">weather</p>
            </div>
            <div className="w-25 mx-auto container col-md-5 ms-md-auto" style={{ marginTop: "12rem" }}>
                <Form.Control
                    type="text"
                    placeholder="Enter city name"
                    value={locationData}
                    onChange={handleInputChange}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && locationData) {
                            fetchWeather();
                            setSuggestions([]); // clear suggestions when enter is pressed
                        }
                    }}
                    className="bg-transparent border border-warning text-warning-emphasis"
                />
                {suggestions.length > 0 && (
                    <ListGroup className="border-warning">
                        {suggestions.map((city, index) => (
                            <ListGroup.Item className="bg-transparent mt-1 list-group-item-action border-warning" key={index} onClick={() => handleCitySelect(city)} >
                                {city.name}, {city.country}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </div>

            {weatherData.name !== undefined &&
                <div className="w-25 mx-auto container col-md-5 ms-md-auto bg-transparent p-2 px-4 rounded-3 mt-3 border border-warning">
                    <div className="mt-3">
                        <div className="row" >
                            <FontAwesomeIcon className="location-icon col-1 p-0 text-warning" style={{ marginTop: "0.4rem", fontSize: "1.5rem" }} icon={faLocationDot} /> <p style={{ fontSize: "1.5rem" }} className="col-6 mx-auto p-0 text-warning"><strong>{weatherData.name}</strong></p>
                            <p className="col text-end text-warning">{date_text}</p>
                        </div>
                        {weatherData.main ? <p className="text-end mb-0 text-warning" style={{ fontSize: "4rem" }}>{weatherData.main.temp.toFixed()}°C</p> : null}
                    </div>
                    <hr className="mt-0 mb-1 text-warning"></hr>
                    <div className="row text-warning-emphasis">
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
