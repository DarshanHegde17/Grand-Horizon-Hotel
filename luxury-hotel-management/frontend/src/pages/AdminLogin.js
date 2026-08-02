import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { FaUserShield, FaLock } from 'react-icons/fa';

const AdminLogin = () => {
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
      
      // Check if user is actually an admin
      if (data.role !== 'admin') {
        setError('Access denied. Admin credentials required.');
        setLoading(false);
        return;
      }
      
      login(data);
      toast.success('Welcome Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '80px',
        paddingBottom: '80px'
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card 
              className="shadow-lg border-0" 
              style={{ 
                borderRadius: '20px', 
                overflow: 'hidden',
                border: '2px solid #c9a96e'
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #c9a96e 0%, #8b7355 100%)',
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: 'white'
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    border: '3px solid white'
                  }}
                >
                  <FaUserShield size={40} />
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', marginBottom: '10px' }}>
                  Admin Portal
                </h2>
                <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                  Secure access for administrators only
                </p>
              </div>

              <Card.Body className="p-5">
                {error && (
                  <Alert variant="danger" className="mb-4">
                    <strong>Error:</strong> {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', color: '#2d2d2d' }}>
                      <FaUserShield className="me-2" />
                      Admin Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter admin email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      style={{
                        padding: '12px',
                        fontSize: '1rem',
                        borderColor: '#c9a96e'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', color: '#2d2d2d' }}>
                      <FaLock className="me-2" />
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter admin password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      style={{
                        padding: '12px',
                        fontSize: '1rem',
                        borderColor: '#c9a96e'
                      }}
                    />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    className="w-100 mb-3" 
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #c9a96e 0%, #8b7355 100%)',
                      border: 'none',
                      padding: '14px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Authenticating...
                      </>
                    ) : (
                      'Login as Admin'
                    )}
                  </Button>
                </Form>

                <hr className="my-4" />

                <div className="text-center">
                  <p className="mb-2 text-muted">
                    Not an admin?{' '}
                    <Link to="/login" style={{ color: '#c9a96e', textDecoration: 'none', fontWeight: 'bold' }}>
                      User Login
                    </Link>
                  </p>
                  <p className="mb-0 text-muted">
                    <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>
                      ← Back to Home
                    </Link>
                  </p>
                </div>

                <div className="mt-4 p-3" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
                  <small className="text-muted d-block mb-2" style={{ fontSize: '0.85rem' }}>
                    <strong>Default Admin Credentials:</strong>
                  </small>
                  <div style={{ fontSize: '0.9rem', color: '#555', fontFamily: 'monospace' }}>
                    <div>📧 Email: admin@gmail.com</div>
                    <div>🔒 Password: admin123</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLogin;
