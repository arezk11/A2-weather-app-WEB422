/*********************************************************************************
* WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Ali Rezk      Student ID:105593222          Date: 2024/07/04
*
*
********************************************************************************/
import { Card, Modal } from 'react-bootstrap';
export default function CityCard({ city, isDetailed, onClick, show, handleClose }) {
  const sunriseTime = new Date(city.sys.sunrise * 1000).toLocaleTimeString();
  const sunsetTime = new Date(city.sys.sunset * 1000).toLocaleTimeString();

  if (isDetailed) {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{city.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Weather: {city.weather[0].main}</p>
          <p>Description: {city.weather[0].description}</p>
          <p>Temperature: {city.main.temp}°C</p>
          <p>Max Temperature: {city.main.temp_max}°C</p>
          <p>Min Temperature: {city.main.temp_min}°C</p>
          <p>Wind Speed: {city.wind.speed} m/s</p>
          <p>Humidity: {city.main.humidity}%</p>
          <p>Pressure: {city.main.pressure} hPa</p>
          <p>Sunrise: {sunriseTime}</p>
          <p>Sunset: {sunsetTime}</p>
          <p>Last Updated: {new Date(city.dt * 1000).toLocaleString()}</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Card onClick={onClick} style={{ cursor: 'pointer' }}>
      <Card.Body>
        <Card.Title>{city.name}, {city.sys.country}</Card.Title>
        <Card.Text>
          <img src={city.flag} alt={`${city.name} flag`} style={{ width: '20px', marginRight: '10px' }} />
          Temperature: {city.main.temp}°C
        </Card.Text>
        <Card.Text>
          Weather: {city.weather[0].description}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
