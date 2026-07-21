import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Carousel } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUsers, FaRupeeSign, FaCheckCircle } from 'react-icons/fa';
import { roomAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const { data } = await roomAPI.getRoomById(id);
      setRoom(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch room details');
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      toast.info('Please login to book a room');
      navigate('/login');
    } else {
      navigate(`/booking/${room._id}`);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!room) return <div className="text-center py-5"><h3>Room not found</h3></div>;

  return (
    <>
      <div className="page-header">
        <h1>{room.roomType} Room</h1>
      </div>

      <Container className="py-5">
        <Row>
          <Col lg={8} className="mb-4">
            {/* Image Carousel */}
            <Carousel>
              {room.images.map((image, index) => (
                <Carousel.Item key={index}>
                  <div style={{ height: '500px' }}>
                    <img
                      className="d-block w-100"
                      src={image}
                      alt={`${room.roomType} ${index + 1}`}
                      style={{ height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                    />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>

            {/* Description */}
            <Card className="mt-4 shadow-sm">
              <Card.Body>
                <h4 style={{ fontFamily: "'Playfair Display', serif" }}>About This Room</h4>
                <div className="luxury-divider mb-3"></div>
                <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#666' }}>
                  {room.description}
                </p>
              </Card.Body>
            </Card>

            {/* Amenities */}
            <Card className="mt-4 shadow-sm">
              <Card.Body>
                <h4 style={{ fontFamily: "'Playfair Display', serif" }}>Amenities</h4>
                <div className="luxury-divider mb-3"></div>
                <Row>
                  {room.amenities.map((amenity, index) => (
                    <Col md={6} key={index} className="mb-2">
                      <div className="d-flex align-items-center">
                        <FaCheckCircle className="me-2" style={{ color: '#c9a96e' }} />
                        <span>{amenity}</span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Booking Card */}
            <Card className="shadow-lg sticky-top" style={{ top: '100px' }}>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 0 }}>
                    {room.roomType}
                  </h3>
                  <Badge bg="dark" style={{ background: '#c9a96e !important' }}>
                    #{room.roomNumber}
                  </Badge>
                </div>

                <div className="mb-3 pb-3 border-bottom">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <FaRupeeSign style={{ color: '#c9a96e' }} />
                      <strong style={{ fontSize: '2rem', color: '#c9a96e', marginLeft: '5px' }}>
                        {room.price}
                      </strong>
                      <span className="text-muted ms-2">/ night</span>
                    </div>
                  </div>
                </div>

                <ListGroup variant="flush" className="mb-3">
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>
                      <FaUsers className="me-2" style={{ color: '#c9a96e' }} />
                      Capacity
                    </span>
                    <strong>{room.capacity} Guests</strong>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Room Type</span>
                    <strong>{room.roomType}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Status</span>
                    <Badge bg={room.isAvailable ? 'success' : 'danger'}>
                      {room.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </ListGroup.Item>
                </ListGroup>

                <Button
                  className="btn-luxury w-100"
                  size="lg"
                  onClick={handleBookNow}
                  disabled={!room.isAvailable}
                >
                  {room.isAvailable ? 'Book Now' : 'Not Available'}
                </Button>

                <div className="mt-3 text-center text-muted" style={{ fontSize: '0.9rem' }}>
                  <small>✓ Free cancellation up to 24 hours before check-in</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RoomDetails;
