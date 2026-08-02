import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await authAPI.login(formData);
      login(data);
      toast.success('Login successful!');
      
      if (data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600) center/cover fixed',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '80px',
        paddingBottom: '80px'
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="shadow-lg border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <Row className="g-0">
                <Col md={6} className="d-none d-md-block">
                  <div
                    style={{
                      height: '100%',
                      background: 'linear-gradient(rgba(201, 169, 110, 0.9), rgba(201, 169, 110, 0.9)), url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800) center/cover',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      padding: '40px'
                    }}
                  >
                    <div className="text-center">
                      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', marginBottom: '20px' }}>
                        Welcome Back
                      </h2>
                      <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                        Login to access your account and manage your bookings with ease.
                      </p>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <Card.Body className="p-5">
                    <h3 className="text-center mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Login
                    </h3>
                    
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                      </Form.Group>

                      <Button type="submit" className="btn-luxury w-100 mb-3" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                      </Button>
                    </Form>

                    <div className="text-center">
                      <p className="mb-2">
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#c9a96e', textDecoration: 'none', fontWeight: 'bold' }}>
                          Register here
                        </Link>
                      </p>
                      <p className="mb-0 text-muted">
                        Admin?{' '}
                        <Link to="/admin-login" style={{ color: '#c9a96e', textDecoration: 'none', fontWeight: 'bold' }}>
                          Login here
                        </Link>
                      </p>
                    </div>

                    <hr className="my-4" />

                    <div className="text-center">
                      <small className="text-muted">Demo Credentials</small>
                      <div className="mt-2" style={{ fontSize: '0.85rem', color: '#666' }}>
                        <div><strong>Admin:</strong> admin@gmail.com / admin123</div>
                        <div><strong>User:</strong> john@example.com / 123456</div>
                      </div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
