import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}
    >
      <Container className="text-center">
        <h1
          style={{
            fontSize: '8rem',
            fontWeight: 'bold',
            color: '#c9a96e',
            fontFamily: "'Playfair Display', serif"
          }}
        >
          404
        </h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="mb-4" style={{ fontSize: '1.2rem', color: '#666' }}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button className="btn-luxury" size="lg" onClick={() => navigate('/')}>
          <FaHome className="me-2" />
          Back to Home
        </Button>
      </Container>
    </div>
  );
};

export default NotFound;
