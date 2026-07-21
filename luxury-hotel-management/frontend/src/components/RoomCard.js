import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaUsers, FaRupeeSign } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  return (
    <Card className="card-luxury h-100">
      <div style={{ height: '250px', overflow: 'hidden' }}>
        <Card.Img
          variant="top"
          src={room.images[0]}
          alt={room.roomType}
          style={{
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onMouseOver={(e) => (e.target.style.transform = 'scale(1.1)')}
          onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>
            {room.roomType}
          </Card.Title>
          <Badge bg="dark" style={{ background: '#c9a96e !important' }}>
            #{room.roomNumber}
          </Badge>
        </div>
        
        <Card.Text style={{ fontSize: '0.95rem', color: '#666', flex: 1 }}>
          {room.description.substring(0, 100)}...
        </Card.Text>

        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <FaUsers className="me-2" style={{ color: '#c9a96e' }} />
            <span>Capacity: {room.capacity} Guests</span>
          </div>
          <div className="d-flex align-items-center">
            <FaRupeeSign className="me-1" style={{ color: '#c9a96e' }} />
            <strong style={{ fontSize: '1.3rem', color: '#c9a96e' }}>
              {room.price}
            </strong>
            <span className="ms-1 text-muted">/ night</span>
          </div>
        </div>

        <div className="d-flex gap-2">
          <Button
            variant="outline-dark"
            size="sm"
            className="flex-fill"
            onClick={() => navigate(`/rooms/${room._id}`)}
          >
            View Details
          </Button>
          <Button
            className="btn-luxury flex-fill"
            size="sm"
            onClick={() => navigate(`/booking/${room._id}`)}
          >
            Book Now
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RoomCard;
