import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{ background: '#1a1a1a', color: '#f8f9fa', marginTop: 'auto' }}>
      <Container className="py-5">
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#c9a96e', marginBottom: '20px' }}>
              ✦ Luxury Hotel
            </h4>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.8' }}>
              Experience world-class hospitality and unparalleled luxury. Your comfort is our priority.
            </p>
            <div className="mt-3">
              <a href="#" className="text-decoration-none me-3" style={{ color: '#c9a96e' }}>
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-decoration-none me-3" style={{ color: '#c9a96e' }}>
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-decoration-none me-3" style={{ color: '#c9a96e' }}>
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-decoration-none" style={{ color: '#c9a96e' }}>
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </Col>

          <Col md={4} className="mb-4 mb-md-0">
            <h5 style={{ color: '#c9a96e', marginBottom: '20px' }}>Quick Links</h5>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li className="mb-2">
                <a href="#" className="text-decoration-none" style={{ color: '#f8f9fa' }}>
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#rooms" className="text-decoration-none" style={{ color: '#f8f9fa' }}>
                  Our Rooms
                </a>
              </li>
              <li className="mb-2">
                <a href="#services" className="text-decoration-none" style={{ color: '#f8f9fa' }}>
                  Services
                </a>
              </li>
              <li className="mb-2">
                <a href="#contact" className="text-decoration-none" style={{ color: '#f8f9fa' }}>
                  Contact Us
                </a>
              </li>
            </ul>
          </Col>

          <Col md={4}>
            <h5 style={{ color: '#c9a96e', marginBottom: '20px' }}>Contact Info</h5>
            <div className="mb-3">
              <FaMapMarkerAlt className="me-2" style={{ color: '#c9a96e' }} />
              <span>123 Luxury Avenue, City Center, 110001</span>
            </div>
            <div className="mb-3">
              <FaPhone className="me-2" style={{ color: '#c9a96e' }} />
              <span>+91 9876543210</span>
            </div>
            <div className="mb-3">
              <FaEnvelope className="me-2" style={{ color: '#c9a96e' }} />
              <span>info@luxuryhotel.com</span>
            </div>
          </Col>
        </Row>
      </Container>

      <div style={{ borderTop: '1px solid #333', padding: '20px 0', textAlign: 'center' }}>
        <Container>
          <p className="mb-0" style={{ fontSize: '0.9rem' }}>
            &copy; {new Date().getFullYear()} Luxury Hotel. All Rights Reserved. | Designed with ❤️
          </p>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
