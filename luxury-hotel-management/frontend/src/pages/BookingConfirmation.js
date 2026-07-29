import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaDownload, FaPrint } from 'react-icons/fa';
import { bookingAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const { data } = await bookingAPI.getBookingById(bookingId);
      setBooking(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch booking details');
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    // Create receipt content
    const receiptContent = `
╔═══════════════════════════════════════════════════════════════╗
║                    LUXURY HOTEL                              ║
║                 BOOKING RECEIPT                              ║
╚═══════════════════════════════════════════════════════════════╝

BOOKING DETAILS
═══════════════════════════════════════════════════════════════
Booking ID:       ${booking.bookingId}
Booking Date:     ${new Date(booking.createdAt).toLocaleDateString()}
Status:           ${booking.status}

GUEST INFORMATION
═══════════════════════════════════════════════════════════════
Name:             ${booking.user.name}
Email:            ${booking.user.email}
Phone:            ${booking.user.phone}

ROOM INFORMATION
═══════════════════════════════════════════════════════════════
Room Type:        ${booking.room.roomType}
Room Number:      #${booking.room.roomNumber}
Capacity:         ${booking.room.capacity} Guests

STAY DETAILS
═══════════════════════════════════════════════════════════════
Check-in:         ${new Date(booking.checkInDate).toLocaleDateString()}
Check-out:        ${new Date(booking.checkOutDate).toLocaleDateString()}
Number of Guests: ${booking.numberOfGuests}

PAYMENT DETAILS
═══════════════════════════════════════════════════════════════
Payment Method:   ${booking.paymentMethod}
Total Amount:     ₹${booking.totalAmount}

═══════════════════════════════════════════════════════════════
           Thank you for choosing Luxury Hotel!
           
           For queries, contact us at:
           Email: info@luxuryhotel.com
           Phone: +91 9876543210
═══════════════════════════════════════════════════════════════

Generated on: ${new Date().toLocaleString()}
    `;

    // Create and download file
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${booking.bookingId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Receipt downloaded successfully!');
  };

  if (loading) return <LoadingSpinner />;
  if (!booking) return <div className="text-center py-5"><h3>Booking not found</h3></div>;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          {/* Success Message */}
          <div className="text-center mb-5">
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: '#28a745',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                marginBottom: '20px'
              }}
            >
              <FaCheckCircle size={60} color="white" />
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#28a745' }}>
              Booking Confirmed!
            </h1>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>
              Thank you for choosing Luxury Hotel
            </p>
          </div>

          {/* Booking Details Card */}
          <Card className="shadow-lg mb-4">
            <Card.Header style={{ background: '#c9a96e', color: 'white' }}>
              <h4 className="mb-0">Booking Details</h4>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="mb-4">
                <Col md={6}>
                  <h6 className="text-muted">BOOKING ID</h6>
                  <h4 style={{ color: '#c9a96e' }}>{booking.bookingId}</h4>
                </Col>
                <Col md={6} className="text-md-end">
                  <h6 className="text-muted">STATUS</h6>
                  <h4 className="text-success">{booking.status}</h4>
                </Col>
              </Row>

              <hr />

              <Row className="mb-3">
                <Col md={6}>
                  <h6>Guest Information</h6>
                  <p className="mb-1"><strong>Name:</strong> {booking.user.name}</p>
                  <p className="mb-1"><strong>Email:</strong> {booking.user.email}</p>
                  <p className="mb-1"><strong>Phone:</strong> {booking.user.phone}</p>
                </Col>
                <Col md={6}>
                  <h6>Room Information</h6>
                  <p className="mb-1"><strong>Room Type:</strong> {booking.room.roomType}</p>
                  <p className="mb-1"><strong>Room Number:</strong> #{booking.room.roomNumber}</p>
                  <p className="mb-1"><strong>Capacity:</strong> {booking.room.capacity} Guests</p>
                </Col>
              </Row>

              <hr />

              <Row className="mb-3">
                <Col md={6}>
                  <h6>Check-in</h6>
                  <p><strong>{new Date(booking.checkInDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
                </Col>
                <Col md={6}>
                  <h6>Check-out</h6>
                  <p><strong>{new Date(booking.checkOutDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <h6>Number of Guests</h6>
                  <p><strong>{booking.numberOfGuests}</strong></p>
                </Col>
                <Col md={6}>
                  <h6>Payment Method</h6>
                  <p><strong>{booking.paymentMethod}</strong></p>
                </Col>
              </Row>

              <hr />

              <div className="text-end">
                <h5>Total Amount Paid</h5>
                <h2 style={{ color: '#c9a96e' }}>₹{booking.totalAmount}</h2>
              </div>
            </Card.Body>
          </Card>

          {/* Important Information */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-3">Important Information</h5>
              <ul style={{ lineHeight: '2' }}>
                <li>Check-in time: 2:00 PM</li>
                <li>Check-out time: 11:00 AM</li>
                <li>Please carry a valid ID proof for verification</li>
                <li>Free cancellation available up to 24 hours before check-in</li>
                <li>A confirmation email has been sent to {booking.user.email}</li>
              </ul>
            </Card.Body>
          </Card>

          {/* Action Buttons */}
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Button variant="outline-primary" onClick={handlePrint}>
              <FaPrint className="me-2" />
              Print
            </Button>
            <Button variant="outline-success" onClick={handleDownloadReceipt}>
              <FaDownload className="me-2" />
              Download Receipt
            </Button>
            <Button className="btn-luxury" onClick={() => navigate('/my-bookings')}>
              View My Bookings
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingConfirmation;
