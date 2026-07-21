import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, ProgressBar, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaMobileAlt, FaCalendarAlt, FaUsers, FaRupeeSign } from 'react-icons/fa';
import { roomAPI, bookingAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const Booking = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    paymentMethod: 'Credit Card'
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: ''
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    if (bookingData.checkInDate && bookingData.checkOutDate) {
      calculateTotal();
    }
  }, [bookingData.checkInDate, bookingData.checkOutDate, room]);

  const fetchRoom = async () => {
    try {
      const { data } = await roomAPI.getRoomById(roomId);
      setRoom(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch room details');
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    if (nights > 0) {
      setNumberOfNights(nights);
      setTotalAmount(nights * room.price);
    }
  };

  const validateStep1 = () => {
    setError('');
    
    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      setError('Please select check-in and check-out dates');
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);

    if (checkIn < today) {
      setError('Check-in date cannot be in the past');
      return false;
    }

    if (checkOut <= checkIn) {
      setError('Check-out date must be after check-in date');
      return false;
    }

    if (bookingData.numberOfGuests < 1 || bookingData.numberOfGuests > room.capacity) {
      setError(`Number of guests must be between 1 and ${room.capacity}`);
      return false;
    }

    return true;
  };

  const checkAvailability = async () => {
    try {
      const { data } = await bookingAPI.checkAvailability({
        roomId: room._id,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate
      });
      return data.available;
    } catch (error) {
      toast.error('Failed to check availability');
      return false;
    }
  };

  const handleStep1Submit = async () => {
    if (!validateStep1()) return;
    
    setProcessing(true);
    const available = await checkAvailability();
    setProcessing(false);

    if (!available) {
      setError('Room is not available for selected dates. Please choose different dates.');
      return;
    }

    setStep(2);
  };

  const validatePayment = () => {
    setError('');

    if (bookingData.paymentMethod === 'Credit Card') {
      if (!paymentDetails.cardNumber || paymentDetails.cardNumber.length !== 16) {
        setError('Please enter a valid 16-digit card number');
        return false;
      }
      if (!paymentDetails.cardName) {
        setError('Please enter card holder name');
        return false;
      }
      if (!paymentDetails.expiryDate) {
        setError('Please enter card expiry date');
        return false;
      }
      if (!paymentDetails.cvv || paymentDetails.cvv.length !== 3) {
        setError('Please enter a valid 3-digit CVV');
        return false;
      }
    } else {
      if (!paymentDetails.upiId) {
        setError('Please enter UPI ID');
        return false;
      }
    }

    return true;
  };

  const handleBooking = async () => {
    if (!validatePayment()) return;

    setProcessing(true);

    try {
      const { data } = await bookingAPI.createBooking({
        roomId: room._id,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        numberOfGuests: bookingData.numberOfGuests,
        totalAmount: totalAmount,
        paymentMethod: bookingData.paymentMethod
      });

      toast.success('Booking confirmed successfully!');
      navigate(`/booking-confirmation/${data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!room) return <div className="text-center py-5"><h3>Room not found</h3></div>;

  return (
    <>
      <div className="page-header">
        <h1>Book Your Room</h1>
      </div>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            {/* Progress Bar */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <div className="mb-3 text-center">
                  <h5>Step {step} of 3</h5>
                </div>
                <ProgressBar now={(step / 3) * 100} style={{ height: '10px' }} />
                <div className="d-flex justify-content-between mt-2">
                  <small className={step >= 1 ? 'text-primary fw-bold' : 'text-muted'}>
                    1. Select Dates
                  </small>
                  <small className={step >= 2 ? 'text-primary fw-bold' : 'text-muted'}>
                    2. Review Details
                  </small>
                  <small className={step >= 3 ? 'text-primary fw-bold' : 'text-muted'}>
                    3. Payment
                  </small>
                </div>
              </Card.Body>
            </Card>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row>
              <Col lg={8}>
                {/* Step 1: Select Dates and Guests */}
                {step === 1 && (
                  <Card className="shadow-sm">
                    <Card.Body className="p-4">
                      <h4 className="mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Select Dates & Guests
                      </h4>

                      <Form>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                <FaCalendarAlt className="me-2" style={{ color: '#c9a96e' }} />
                                Check-in Date
                              </Form.Label>
                              <Form.Control
                                type="date"
                                value={bookingData.checkInDate}
                                onChange={(e) => setBookingData({ ...bookingData, checkInDate: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                <FaCalendarAlt className="me-2" style={{ color: '#c9a96e' }} />
                                Check-out Date
                              </Form.Label>
                              <Form.Control
                                type="date"
                                value={bookingData.checkOutDate}
                                onChange={(e) => setBookingData({ ...bookingData, checkOutDate: e.target.value })}
                                min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-4">
                          <Form.Label>
                            <FaUsers className="me-2" style={{ color: '#c9a96e' }} />
                            Number of Guests (Max: {room.capacity})
                          </Form.Label>
                          <Form.Control
                            type="number"
                            value={bookingData.numberOfGuests}
                            onChange={(e) => setBookingData({ ...bookingData, numberOfGuests: parseInt(e.target.value) })}
                            min="1"
                            max={room.capacity}
                            required
                          />
                        </Form.Group>

                        <div className="d-flex gap-2">
                          <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                            Cancel
                          </Button>
                          <Button className="btn-luxury flex-fill" onClick={handleStep1Submit} disabled={processing}>
                            {processing ? 'Checking Availability...' : 'Continue'}
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                )}

                {/* Step 2: Review Details */}
                {step === 2 && (
                  <Card className="shadow-sm">
                    <Card.Body className="p-4">
                      <h4 className="mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Review Booking Details
                      </h4>

                      <div className="mb-4">
                        <h6>Room Information</h6>
                        <p><strong>Room Type:</strong> {room.roomType}</p>
                        <p><strong>Room Number:</strong> #{room.roomNumber}</p>
                        <p><strong>Price per Night:</strong> ₹{room.price}</p>
                      </div>

                      <div className="mb-4">
                        <h6>Booking Details</h6>
                        <p><strong>Check-in:</strong> {new Date(bookingData.checkInDate).toLocaleDateString()}</p>
                        <p><strong>Check-out:</strong> {new Date(bookingData.checkOutDate).toLocaleDateString()}</p>
                        <p><strong>Number of Nights:</strong> {numberOfNights}</p>
                        <p><strong>Number of Guests:</strong> {bookingData.numberOfGuests}</p>
                      </div>

                      <div className="d-flex gap-2">
                        <Button variant="outline-secondary" onClick={() => setStep(1)}>
                          Back
                        </Button>
                        <Button className="btn-luxury flex-fill" onClick={() => setStep(3)}>
                          Proceed to Payment
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <Card className="shadow-sm">
                    <Card.Body className="p-4">
                      <h4 className="mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Payment Information
                      </h4>

                      <Alert variant="info">
                        <small>This is a demo payment. No actual transaction will be processed.</small>
                      </Alert>

                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Payment Method</Form.Label>
                          <Form.Select
                            value={bookingData.paymentMethod}
                            onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                          >
                            <option value="Credit Card">Credit Card</option>
                            <option value="UPI">UPI</option>
                          </Form.Select>
                        </Form.Group>

                        {bookingData.paymentMethod === 'Credit Card' ? (
                          <>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                <FaCreditCard className="me-2" />
                                Card Number
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                maxLength="16"
                                value={paymentDetails.cardNumber}
                                onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value.replace(/\D/g, '') })}
                                required
                              />
                            </Form.Group>

                            <Form.Group className="mb-3">
                              <Form.Label>Card Holder Name</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="John Doe"
                                value={paymentDetails.cardName}
                                onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
                                required
                              />
                            </Form.Group>

                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Expiry Date</Form.Label>
                                  <Form.Control
                                    type="month"
                                    value={paymentDetails.expiryDate}
                                    onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                                    required
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>CVV</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="123"
                                    maxLength="3"
                                    value={paymentDetails.cvv}
                                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value.replace(/\D/g, '') })}
                                    required
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </>
                        ) : (
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <FaMobileAlt className="me-2" />
                              UPI ID
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="yourname@upi"
                              value={paymentDetails.upiId}
                              onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })}
                              required
                            />
                          </Form.Group>
                        )}

                        <div className="d-flex gap-2">
                          <Button variant="outline-secondary" onClick={() => setStep(2)}>
                            Back
                          </Button>
                          <Button className="btn-luxury flex-fill" onClick={handleBooking} disabled={processing}>
                            {processing ? 'Processing...' : `Pay ₹${totalAmount}`}
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                )}
              </Col>

              {/* Booking Summary Sidebar */}
              <Col lg={4}>
                <Card className="shadow-lg sticky-top" style={{ top: '100px' }}>
                  <Card.Body className="p-4">
                    <h5 className="mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Booking Summary
                    </h5>

                    <div className="mb-3">
                      <img
                        src={room.images[0]}
                        alt={room.roomType}
                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </div>

                    <h6>{room.roomType} Room</h6>
                    <p className="text-muted mb-3">Room #{room.roomNumber}</p>

                    {bookingData.checkInDate && bookingData.checkOutDate && (
                      <>
                        <hr />
                        <div className="d-flex justify-content-between mb-2">
                          <span>₹{room.price} × {numberOfNights} nights</span>
                          <span>₹{room.price * numberOfNights}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Guests</span>
                          <span>{bookingData.numberOfGuests}</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                          <strong>Total Amount</strong>
                          <strong style={{ fontSize: '1.5rem', color: '#c9a96e' }}>
                            <FaRupeeSign />
                            {totalAmount}
                          </strong>
                        </div>
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Booking;
