import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaUtensils, FaClock, FaDownload } from 'react-icons/fa';
import { foodOrderAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const FoodOrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data } = await foodOrderAPI.getOrderById(orderId);
      setOrder(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch order details');
      setLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    const receiptContent = `
╔═══════════════════════════════════════════════════════════════╗
║                    LUXURY HOTEL                              ║
║                 ROOM SERVICE RECEIPT                         ║
╚═══════════════════════════════════════════════════════════════╝

ORDER DETAILS
═══════════════════════════════════════════════════════════════
Order ID:         ${order.orderId}
Room Number:      ${order.roomNumber}
Order Date:       ${new Date(order.createdAt).toLocaleString()}
Status:           ${order.status}

ITEMS ORDERED
═══════════════════════════════════════════════════════════════
${order.items.map((item, index) => `
${index + 1}. ${item.name}
   Category: ${item.category}
   Price: ₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}
`).join('')}

SPECIAL INSTRUCTIONS
═══════════════════════════════════════════════════════════════
${order.specialInstructions || 'None'}

PAYMENT DETAILS
═══════════════════════════════════════════════════════════════
Total Amount:     ₹${order.totalAmount}

DELIVERY INFORMATION
═══════════════════════════════════════════════════════════════
Estimated Time:   ${order.deliveryTime}

═══════════════════════════════════════════════════════════════
           Thank you for ordering with Luxury Hotel!
           
           For assistance, contact Room Service:
           Extension: 101
═══════════════════════════════════════════════════════════════

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FoodReceipt_${order.orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Receipt downloaded successfully!');
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return <div className="text-center py-5"><h3>Order not found</h3></div>;

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
              Order Confirmed!
            </h1>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>
              Your food will be delivered to your room shortly
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="shadow-lg mb-4">
            <Card.Header style={{ background: '#c9a96e', color: 'white' }}>
              <h4 className="mb-0">
                <FaUtensils className="me-2" />
                Order Details
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="mb-4">
                <Col md={6}>
                  <h6 className="text-muted">ORDER ID</h6>
                  <h4 style={{ color: '#c9a96e' }}>{order.orderId}</h4>
                </Col>
                <Col md={6} className="text-md-end">
                  <h6 className="text-muted">ROOM NUMBER</h6>
                  <h4>{order.roomNumber}</h4>
                </Col>
              </Row>

              <hr />

              <h6 className="mb-3">Items Ordered:</h6>
              <ListGroup className="mb-3">
                {order.items.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row className="align-items-center">
                      <Col xs={2}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '100%', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </Col>
                      <Col xs={6}>
                        <strong>{item.name}</strong>
                        <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                          {item.category}
                        </div>
                      </Col>
                      <Col xs={4} className="text-end">
                        <div>₹{item.price} × {item.quantity}</div>
                        <strong>₹{item.price * item.quantity}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {order.specialInstructions && (
                <>
                  <h6>Special Instructions:</h6>
                  <Card className="mb-3" style={{ background: '#f8f9fa' }}>
                    <Card.Body>
                      <p className="mb-0">{order.specialInstructions}</p>
                    </Card.Body>
                  </Card>
                </>
              )}

              <div className="alert alert-success d-flex align-items-center mb-3">
                <FaClock className="me-2" size={20} />
                <span>Estimated Delivery: <strong>{order.deliveryTime}</strong></span>
              </div>

              <hr />

              <div className="text-end">
                <h5>Total Amount</h5>
                <h2 style={{ color: '#c9a96e' }}>₹{order.totalAmount}</h2>
              </div>
            </Card.Body>
          </Card>

          {/* Important Information */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-3">Important Information</h5>
              <ul style={{ lineHeight: '2' }}>
                <li>Your order has been sent to our kitchen</li>
                <li>Food will be delivered to Room #{order.roomNumber}</li>
                <li>Please ensure someone is in the room to receive the order</li>
                <li>For any queries, dial Extension 101 for Room Service</li>
                <li>Payment will be added to your room bill</li>
              </ul>
            </Card.Body>
          </Card>

          {/* Action Buttons */}
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Button variant="outline-success" onClick={handleDownloadReceipt}>
              <FaDownload className="me-2" />
              Download Receipt
            </Button>
            <Button className="btn-luxury" onClick={() => navigate('/my-food-orders')}>
              View My Orders
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate('/room-service')}>
              Order More
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FoodOrderConfirmation;
