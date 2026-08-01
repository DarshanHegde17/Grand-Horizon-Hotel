import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import { FaUser, FaSignOutAlt, FaUserCircle, FaUtensils } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  return (
    <BSNavbar
      expand="lg"
      className="navbar-dark"
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        padding: '15px 0'
      }}
      sticky="top"
      expanded={expanded}
      onToggle={(expanded) => setExpanded(expanded)}
    >
      <Container>
        <BSNavbar.Brand
          as={Link}
          to="/"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#c9a96e'
          }}
          onClick={() => setExpanded(false)}
        >
          ✦ Luxury Hotel
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            {/* Show these links only when NOT logged in */}
            {!user && (
              <>
                <Nav.Link as={Link} to="/" className="px-3" onClick={() => setExpanded(false)}>
                  Home
                </Nav.Link>
                <Nav.Link href="#about" className="px-3" onClick={() => setExpanded(false)}>
                  About
                </Nav.Link>
                <Nav.Link href="#rooms" className="px-3" onClick={() => setExpanded(false)}>
                  Rooms
                </Nav.Link>
                <Nav.Link href="#services" className="px-3" onClick={() => setExpanded(false)}>
                  Services
                </Nav.Link>
                <Nav.Link href="#contact" className="px-3" onClick={() => setExpanded(false)}>
                  Contact
                </Nav.Link>
              </>
            )}

            {/* Show Room Service only for logged in non-admin users */}
            {user && !isAdmin && (
              <Nav.Link as={Link} to="/room-service" className="px-3" onClick={() => setExpanded(false)}>
                🍽️ Room Service
              </Nav.Link>
            )}

            {user ? (
              <>
                <Nav.Link
                  as={Link}
                  to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                  className="px-3"
                  onClick={() => setExpanded(false)}
                >
                  <FaUserCircle className="me-1" /> Dashboard
                </Nav.Link>
                {isAdmin && (
                  <Nav.Link
                    as={Link}
                    to="/admin/food-orders"
                    className="px-3"
                    onClick={() => setExpanded(false)}
                  >
                    <FaUtensils className="me-1" /> Food Orders
                  </Nav.Link>
                )}
                <Nav.Link
                  as={Link}
                  to="/profile"
                  className="px-3"
                  onClick={() => setExpanded(false)}
                >
                  <FaUser className="me-1" /> Profile
                </Nav.Link>
                {!isAdmin && (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/my-bookings"
                      className="px-3"
                      onClick={() => setExpanded(false)}
                    >
                      My Bookings
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/my-food-orders"
                      className="px-3"
                      onClick={() => setExpanded(false)}
                    >
                      My Food Orders
                    </Nav.Link>
                  </>
                )}
                <Button
                  variant="outline-light"
                  size="sm"
                  className="ms-lg-3 mt-2 mt-lg-0"
                  onClick={() => {
                    setExpanded(false);
                    handleLogout();
                  }}
                  style={{ borderColor: '#c9a96e', color: '#c9a96e' }}
                >
                  <FaSignOutAlt className="me-1" /> Logout
                </Button>
              </>
            ) : (
              <Button
                variant="outline-light"
                size="sm"
                className="ms-lg-3 mt-2 mt-lg-0"
                onClick={() => {
                  setExpanded(false);
                  navigate('/login');
                }}
                style={{ borderColor: '#c9a96e', color: '#c9a96e' }}
              >
                <FaUser className="me-1" /> Login
              </Button>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
