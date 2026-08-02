import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal } from 'react-bootstrap';
import { FaUtensils, FaRupeeSign, FaTrash, FaCheck, FaClock, FaTimes } from 'react-icons/fa';
import { foodOrderAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const AdminFoodOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0
  });

  const calculateStats = useCallback(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
    const preparingOrders = orders.filter((o) => o.status === 'Preparing').length;
    const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
    const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length;
    const totalRevenue = orders
      .filter((o) => o.status === 'Delivered')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    setStats({
      totalOrders,
      pendingOrders,
      preparingOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue
    });
  }, [orders]);

  const getOrdersByStatus = useCallback((status) => {
    return orders
      .filter(order => order.status === status)
      .sort((a, b) => {
        // Today's orders first
        const aIsToday = isToday(new Date(a.createdAt));
        const bIsToday = isToday(new Date(b.createdAt));
        
        if (aIsToday && !bIsToday) return -1;
        if (!aIsToday && bIsToday) return 1;
        
        // Then sort by newest first
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [orders]);

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const fetchOrders = async () => {
    try {
      const { data } = await foodOrderAPI.getAllOrders();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch food orders');
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await foodOrderAPI.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    
    setDeleting(true);
    try {
      await foodOrderAPI.cancelOrder(selectedOrder._id);
      toast.success('Order deleted successfully');
      setShowDeleteModal(false);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to delete order');
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: 'warning',
      Preparing: 'info',
      Delivered: 'success',
      Cancelled: 'danger'
    };
    return <Badge bg={statusColors[status] || 'primary'}>{status}</Badge>;
  };

  const renderOrderCard = (order) => {
    if (!order.user) return null;
    
    const orderIsToday = isToday(new Date(order.createdAt));
    
    return (
      <Card key={order._id} className="mb-3 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h6 className="mb-1">
                {order.orderId}
                {orderIsToday && (
                  <Badge bg="success" className="ms-2" style={{ fontSize: '0.7rem' }}>
                    TODAY
                  </Badge>
                )}
              </h6>
              <small className="text-muted">
                {new Date(order.createdAt).toLocaleString()}
              </small>
            </div>
            <div className="d-flex gap-2 align-items-center">
              {getStatusBadge(order.status)}
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDeleteClick(order)}
                title="Delete Order"
              >
                <FaTrash />
              </Button>
            </div>
          </div>
          
          <div className="mb-2">
            <strong>Room:</strong> <Badge bg="secondary">{order.roomNumber}</Badge>
            <br />
            <strong>Guest:</strong> {order.user?.name || 'N/A'}
            <br />
            <small className="text-muted">{order.user?.email || 'N/A'}</small>
          </div>

          <div className="mb-2">
            <strong>Items:</strong>
            <ul className="mb-0 mt-1" style={{ fontSize: '0.9rem' }}>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} × {item.quantity} - ₹{item.price * item.quantity}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-2 p-2" style={{ background: '#f8f9fa', borderRadius: '5px' }}>
            <strong>Total Amount:</strong>{' '}
            <span style={{ color: '#c9a96e', fontSize: '1.1rem', fontWeight: 'bold' }}>
              ₹{order.totalAmount}
            </span>
          </div>

          {order.specialInstructions && (
            <div className="mb-2">
              <small>
                <strong>Special Instructions:</strong> {order.specialInstructions}
              </small>
            </div>
          )}

          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
            <div className="d-flex gap-2 mt-2">
              {order.status === 'Pending' && (
                <Button
                  variant="info"
                  size="sm"
                  className="flex-fill"
                  onClick={() => handleStatusChange(order._id, 'Preparing')}
                >
                  <FaClock className="me-1" />
                  Start Preparing
                </Button>
              )}
              {order.status === 'Preparing' && (
                <Button
                  variant="success"
                  size="sm"
                  className="flex-fill"
                  onClick={() => handleStatusChange(order._id, 'Delivered')}
                >
                  <FaCheck className="me-1" />
                  Mark Delivered
                </Button>
              )}
              <Button
                variant="outline-danger"
                size="sm"
                className="flex-fill"
                onClick={() => handleStatusChange(order._id, 'Cancelled')}
              >
                <FaTimes className="me-1" />
                Cancel
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="page-header">
        <Container>
          <h1>
            <FaUtensils className="me-3" />
            Food Orders Management
          </h1>
          <p style={{ fontSize: '1.2rem' }}>Welcome, {user?.name}</p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={2} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body className="text-center">
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#e3f2fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px'
                  }}
                >
                  <FaUtensils size={25} color="#2196f3" />
                </div>
                <h4>{stats.totalOrders}</h4>
                <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Total</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body className="text-center">
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#fff3e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px'
                  }}
                >
                  <FaClock size={25} color="#ff9800" />
                </div>
                <h4>{stats.pendingOrders}</h4>
                <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Pending</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body className="text-center">
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#e3f2fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px'
                  }}
                >
                  <FaUtensils size={25} color="#2196f3" />
                </div>
                <h4>{stats.preparingOrders}</h4>
                <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Preparing</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body className="text-center">
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#e8f5e9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px'
                  }}
                >
                  <FaCheck size={25} color="#4caf50" />
                </div>
                <h4>{stats.deliveredOrders}</h4>
                <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Delivered</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body className="text-center">
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#ffebee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px'
                  }}
                >
                  <FaTimes size={25} color="#f44336" />
                </div>
                <h4>{stats.cancelledOrders}</h4>
                <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Cancelled</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body className="text-center">
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#fff3e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px'
                  }}
                >
                  <FaRupeeSign size={25} color="#ff9800" />
                </div>
                <h4 style={{ fontSize: '1.3rem' }}>₹{(stats.totalRevenue / 1000).toFixed(1)}k</h4>
                <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Revenue</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* 4 Categories */}
        <Row>
          {/* Pending Orders */}
          <Col lg={6} xl={3} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Header style={{ background: '#ff9800', color: 'white' }}>
                <h6 className="mb-0">
                  <FaClock className="me-2" />
                  Pending ({getOrdersByStatus('Pending').length})
                </h6>
              </Card.Header>
              <Card.Body style={{ maxHeight: '600px', overflowY: 'auto', padding: '15px' }}>
                {getOrdersByStatus('Pending').length > 0 ? (
                  getOrdersByStatus('Pending').map(renderOrderCard)
                ) : (
                  <div className="text-center py-3">
                    <p className="text-muted mb-0">No pending orders</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Preparing Orders */}
          <Col lg={6} xl={3} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Header style={{ background: '#2196f3', color: 'white' }}>
                <h6 className="mb-0">
                  <FaUtensils className="me-2" />
                  Preparing ({getOrdersByStatus('Preparing').length})
                </h6>
              </Card.Header>
              <Card.Body style={{ maxHeight: '600px', overflowY: 'auto', padding: '15px' }}>
                {getOrdersByStatus('Preparing').length > 0 ? (
                  getOrdersByStatus('Preparing').map(renderOrderCard)
                ) : (
                  <div className="text-center py-3">
                    <p className="text-muted mb-0">No orders being prepared</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Delivered Orders */}
          <Col lg={6} xl={3} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Header style={{ background: '#4caf50', color: 'white' }}>
                <h6 className="mb-0">
                  <FaCheck className="me-2" />
                  Delivered ({getOrdersByStatus('Delivered').length})
                </h6>
              </Card.Header>
              <Card.Body style={{ maxHeight: '600px', overflowY: 'auto', padding: '15px' }}>
                {getOrdersByStatus('Delivered').length > 0 ? (
                  getOrdersByStatus('Delivered').map(renderOrderCard)
                ) : (
                  <div className="text-center py-3">
                    <p className="text-muted mb-0">No delivered orders</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Cancelled Orders */}
          <Col lg={6} xl={3} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Header style={{ background: '#f44336', color: 'white' }}>
                <h6 className="mb-0">
                  <FaTimes className="me-2" />
                  Cancelled ({getOrdersByStatus('Cancelled').length})
                </h6>
              </Card.Header>
              <Card.Body style={{ maxHeight: '600px', overflowY: 'auto', padding: '15px' }}>
                {getOrdersByStatus('Cancelled').length > 0 ? (
                  getOrdersByStatus('Cancelled').map(renderOrderCard)
                ) : (
                  <div className="text-center py-3">
                    <p className="text-muted mb-0">No cancelled orders</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this order?</p>
          {selectedOrder && (
            <div className="mt-3 p-3" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
              <p className="mb-1"><strong>Order ID:</strong> {selectedOrder.orderId}</p>
              <p className="mb-1"><strong>Room:</strong> {selectedOrder.roomNumber}</p>
              <p className="mb-1"><strong>Amount:</strong> ₹{selectedOrder.totalAmount}</p>
              <p className="mb-0"><strong>Status:</strong> {getStatusBadge(selectedOrder.status)}</p>
            </div>
          )}
          <div className="alert alert-warning mt-3 mb-0">
            <small>⚠️ This action cannot be undone.</small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteOrder} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete Order'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminFoodOrders;
