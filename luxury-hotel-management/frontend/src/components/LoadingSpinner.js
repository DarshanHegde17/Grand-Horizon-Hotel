import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const LoadingSpinner = () => {
  return (
    <Container className="loading-spinner">
      <Spinner animation="border" style={{ color: '#c9a96e', width: '3rem', height: '3rem' }} />
    </Container>
  );
};

export default LoadingSpinner;
