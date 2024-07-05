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

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import CityCard from '../../components/CityCard';

const apiKey = 'f0ea161c81fa72480cdd106971f60c86';

export default function City() {
  const router = useRouter();
  const { id } = router.query; //Get the city ID from the URL
  const [city, setCity] = useState(null); //State for storing city data
  const [error, setError] = useState(''); //State for storing error messages
  const [show, setShow] = useState(true); //State for controlling modal visibility

  //Fetch city data based on ID
  useEffect(() => {
    if (id) {
      const fetchCityData = async () => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?id=${id}&units=metric&appid=${apiKey}`
          );
          if (!response.ok) throw new Error('City not found');
          const data = await response.json();
          const cityWithFlag = {...data, flag: `http://openweathermap.org/images/flags/${data.sys.country.toLowerCase()}.png`
          };
          setCity(cityWithFlag);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchCityData();
    }
  }, [id]);

  //Handle closing the modal
  const handleClose = () => {
    setShow(false);
    router.back();
  };

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!city) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Button variant="primary" onClick={() => router.back()}>Back</Button>
      <CityCard city={city} isDetailed={true} show={show} handleClose={handleClose} />
    </div>
  );
}
