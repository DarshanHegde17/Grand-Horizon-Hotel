import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal } from 'react-bootstrap';
import { FaCalendarAlt, FaUsers, FaRupeeSign, FaDownload } from 'react-icons/fa';
import { bookingAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await bookingAPI.getUserBookings();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelBooking = async () => {
    setCancelling(true);
    try {
      await bookingAPI.cancelBooking(selectedBooking._id);
      toast.success('Booking cancelled successfully');
      setShowCancelModal(false);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Confirmed: 'success',
      Cancelled: 'danger',
      Completed: 'secondary'
    };
    return <Badge bg={statusColors[status] || 'primary'}>{status}</Badge>;
  };

  const canCancelBooking = (booking) => {
    if (booking.status !== 'Confirmed') return false;
    const checkInDate = new Date(booking.checkInDate);
    const today = new Date();
    return checkInDate > today;
  };

  const handleDownloadReceipt = (booking) => {
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

ROOM INFORMATION
═══════════════════════════════════════════════════════════════
Room Type:        ${booking.room.roomType}
Room Number:      #${booking.room.roomNumber}

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

  return (
    <>
      <div className="page-header">
        <h1>My Bookings</h1>
      </div>

      <Container className="py-5">
        {bookings.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <h4>No bookings found</h4>
              <p className="text-muted">You haven't made any bookings yet.</p>
              <Button className="btn-luxury mt-3" href="/dashboard">
                Browse Rooms
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {bookings.map((booking) => (
              <Col lg={6} key={booking._id} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Row className="g-0">
                    <Col md={5}>
                      <div style={{ height: '100%', minHeight: '250px' }}>
                        <img
                          src={booking.room.images[0]}
                          alt={booking.room.roomType}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </Col>
                    <Col md={7}>
                      <Card.Body className="d-flex flex-column h-100">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <Card.Title style={{ fontFamily: "'Playfair Display', serif" }}>
                              {booking.room.roomType}
                            </Card.Title>
                            <small className="text-muted">Booking ID: {booking.bookingId}</small>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>

                        <div className="mb-2">
                          <small className="text-muted d-block">
                            <FaCalendarAlt className="me-2" style={{ color: '#c9a96e' }} />
                            Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
                          </small>
                          <small className="text-muted d-block">
                            <FaCalendarAlt className="me-2" style={{ color: '#c9a96e' }} />
                            Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
                          </small>
                          <small className="text-muted d-block">
                            <FaUsers className="me-2" style={{ color: '#c9a96e' }} />
                            Guests: {booking.numberOfGuests}
                          </small>
                        </div>

                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted">Total Amount</span>
                            <strong style={{ fontSize: '1.3rem', color: '#c9a96e' }}>
                              <FaRupeeSign />
                              {booking.totalAmount}
                            </strong>
                          </div>

                          <div className="d-flex gap-2 mb-2">
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="flex-fill"
                              onClick={() => handleDownloadReceipt(booking)}
                            >
                              <FaDownload className="me-1" />
                              Receipt
                            </Button>
                          </div>

                          {canCancelBooking(booking) && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="w-100"
                              onClick={() => handleCancelClick(booking)}
                            >
                              Cancel Booking
                            </Button>
                          )}
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Cancel Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to cancel this booking?</p>
          {selectedBooking && (
            <div className="mt-3 p-3" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
              <p className="mb-1"><strong>Booking ID:</strong> {selectedBooking.bookingId}</p>
              <p className="mb-1"><strong>Room:</strong> {selectedBooking.room.roomType}</p>
              <p className="mb-1">
                <strong>Check-in:</strong> {new Date(selectedBooking.checkInDate).toLocaleDateString()}
              </p>
              <p className="mb-0">
                <strong>Amount:</strong> ₹{selectedBooking.totalAmount}
              </p>
            </div>
          )}
          <p className="mt-3 text-muted">
            <small>Note: Cancellation is free if done 24 hours before check-in.</small>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            No, Keep Booking
          </Button>
          <Button variant="danger" onClick={handleCancelBooking} disabled={cancelling}>
            {cancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyBookings;
