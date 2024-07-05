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
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function Navigation({ recentlyViewed, searchId, setSearchId }) {
  const router = useRouter();

  const handleNavClick = (id) => {
    router.push(`/city/${id}`);
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>Weather App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link onClick={() => router.push('/')}>Home</Nav.Link>
          <NavDropdown title="Previously Viewed" id="basic-nav-dropdown">
            {recentlyViewed.length > 0 ? (
              recentlyViewed.map((city, index) => (
                <NavDropdown.Item key={index} onClick={() => handleNavClick(city.id)}>
                  <img src={city.flag} alt={`${city.name} flag`} style={{ width: '20px', marginRight: '10px' }} />
                  {city.name} (ID: {city.id})
                </NavDropdown.Item>
              ))
            ) : (
              <NavDropdown.Item>...</NavDropdown.Item>
            )}
          </NavDropdown>
        </Nav>
        <Form inline onSubmit={(e) => {
          e.preventDefault();
          router.push(`/city/${searchId}`);
        }}>
          <FormControl
            type="text"
            placeholder="City ID"
            className="mr-sm-2"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <Button type="submit" variant="outline-success">Search</Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
}
