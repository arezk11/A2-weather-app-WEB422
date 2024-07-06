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
import { useEffect, useState } from 'react'; //Import the hooks from React
import { Form, Button, Alert, Pagination, Dropdown } from 'react-bootstrap'; //Import the components from React Bootstrap
import CityCard from '../components/CityCard'; //Import the CityCard component
import Navigation from '../components/Navbar'; //Import the Navbar component

//My API key
const apiKey = 'f0ea161c81fa72480cdd106971f60c86';

export default function Home() {
  //State for storing the search location
  const [location, setLocation] = useState('');

  //State for storing weather data
  const [weatherList, setWeatherList] = useState([]);

  //State for storing error messages
  const [error, setError] = useState('');

  //State for storing recently viewed cities
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  //State for storing the search ID
  const [searchId, setSearchId] = useState('');

  //State for storing the selected city details
  const [selectedCity, setSelectedCity] = useState(null);

  //State for controlling modal visibility
  const [showModal, setShowModal] = useState(false);

  //State for pagination
  const [currentPage, setCurrentPage] = useState(1);

  //Number of items to be displayed per page
  const itemsPerPage = 3;

  //State for selected language
  const [language, setLanguage] = useState('en'); 

  //Fetch the weather data using geolocation
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=${language}&appid=${apiKey}`
          );
          if (!response.ok) throw new Error('Failed to fetch weather data');
          const data = await response.json();
          setWeatherList([data]);
        } catch (err) {
          setError(err.message);
        }
      });
    }
  }, [language]); //For refetching the data when the language changes

  //Handle the search by city name
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/find?q=${location}&units=metric&lang=${language}&appid=${apiKey}&cnt=50`
      );
      if (!response.ok) throw new Error('City not found');
      const data = await response.json();

      const detailedWeatherPromises = data.list.map(async (city) => {
        const detailedResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?id=${city.id}&units=metric&appid=${apiKey}`
        );
        if (!detailedResponse.ok) throw new Error('Failed to fetch detailed weather data');
        const detailedData = await detailedResponse.json();
        return {
          ...city,
          sunrise: detailedData.sys.sunrise,
          sunset: detailedData.sys.sunset,
          flag: `http://openweathermap.org/images/flags/${city.sys.country.toLowerCase()}.png`,
        };
      });

      const citiesWithDetails = await Promise.all(detailedWeatherPromises);

      setWeatherList(citiesWithDetails);
      setRecentlyViewed((prev) => {
        const newViewed = [
          ...new Set([...prev, ...citiesWithDetails.map(city => ({ id: city.id, name: city.name, flag: city.flag }))])
        ];
     return newViewed;
      });
    } catch (err) {
      setError(err.message);
    }
  };

  //The city click to show details
  const handleCityClick = (city) => {
    setSelectedCity(city);
    setShowModal(true);
  };

  //language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  //Pagination logic
  const indexOfLastCity = currentPage * itemsPerPage;
  const indexOfFirstCity = indexOfLastCity - itemsPerPage;
  const currentCities = weatherList.slice(indexOfFirstCity, indexOfLastCity);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Navigation 
        recentlyViewed={recentlyViewed} 
        searchId={searchId} 
        setSearchId={setSearchId} 
      />
      <div>
        <h1>Weather App</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <Dropdown onSelect={handleLanguageChange}>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Select Language
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="en">English</Dropdown.Item>
            <Dropdown.Item eventKey="fr">French</Dropdown.Item>
            <Dropdown.Item eventKey="ar">Arabic</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Form onSubmit={handleSearch}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Enter city name or city_name,country_code</Form.Label>
            <Form.Control
              type="text"
              placeholder="City"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">Search</Button>
        </Form>
        {currentCities.map((city) => (
          <CityCard key={city.id} city={city} onClick={() => handleCityClick(city)} />
        ))}
        {weatherList.length > itemsPerPage && (
          <Pagination>
            {Array.from({ length: Math.ceil(weatherList.length / itemsPerPage) }).map((_, index) => (
              <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        )}
        {selectedCity && (
          <CityCard city={selectedCity} isDetailed={true} show={showModal} handleClose={() => setShowModal(false)} />
        )}
      </div>
    </div>
  );
}
