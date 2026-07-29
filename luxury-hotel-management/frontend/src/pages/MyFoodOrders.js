import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal } from 'react-bootstrap';
import { FaUtensils, FaDownload, FaClock } from 'react-icons/fa';
import { foodOrderAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const MyFoodOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await foodOrderAPI.getUserOrders();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch orders');
      setLoading(false);
    }
  };

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      await foodOrderAPI.cancelOrder(selectedOrder._id);
      toast.success('Order cancelled successfully');
      setShowCancelModal(false);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: 'warning',
      Preparing: 'info',
      Delivered: 'success',
      Cancelled: 'danger'
    };
    return <Badge bg={statusColors[status] || 'primary'}>{status}</Badge>;
  };

  const canCancelOrder = (order) => {
    return order.status === 'Pending';
  };

  const handleDownloadReceipt = (order) => {
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

═══════════════════════════════════════════════════════════════
           Thank you for ordering with Luxury Hotel!
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

  return (
    <>
      <div className="page-header">
        <h1><FaUtensils className="me-3" />My Food Orders</h1>
      </div>

      <Container className="py-5">
        {orders.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <FaUtensils size={60} color="#c9a96e" className="mb-3" />
              <h4>No orders found</h4>
              <p className="text-muted">You haven't ordered any food yet.</p>
              <Button className="btn-luxury mt-3" href="/room-service">
                Order Now
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {orders.map((order) => (
              <Col lg={6} key={order._id} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 style={{ fontFamily: "'Playfair Display', serif" }}>
                          Order #{order.orderId}
                        </h5>
                        <small className="text-muted">
                          {new Date(order.createdAt).toLocaleString()}
                        </small>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="mb-3">
                      <strong>Room Number:</strong> {order.roomNumber}
                    </div>

                    <div className="mb-3">
                      <strong>Items:</strong>
                      <ul className="mt-2 mb-0">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.name} × {item.quantity} - ₹{item.price * item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {order.status === 'Pending' && (
                      <div className="alert alert-info py-2 mb-3">
                        <FaClock className="me-2" />
                        <small>Estimated: {order.deliveryTime}</small>
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center mb-3 p-2" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
                      <span>Total Amount:</span>
                      <strong style={{ fontSize: '1.2rem', color: '#c9a96e' }}>
                        ₹{order.totalAmount}
                      </strong>
                    </div>

                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="flex-fill"
                        onClick={() => handleDownloadReceipt(order)}
                      >
                        <FaDownload className="me-1" />
                        Receipt
                      </Button>
                      {canCancelOrder(order) && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="flex-fill"
                          onClick={() => handleCancelClick(order)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Cancel Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to cancel this order?</p>
          {selectedOrder && (
            <div className="mt-3 p-3" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
              <p className="mb-1"><strong>Order ID:</strong> {selectedOrder.orderId}</p>
              <p className="mb-1"><strong>Room:</strong> {selectedOrder.roomNumber}</p>
              <p className="mb-0"><strong>Amount:</strong> ₹{selectedOrder.totalAmount}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            No, Keep Order
          </Button>
          <Button variant="danger" onClick={handleCancelOrder} disabled={cancelling}>
            {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyFoodOrders;
