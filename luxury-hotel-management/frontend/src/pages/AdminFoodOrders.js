import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, InputGroup, Button } from 'react-bootstrap';
import { FaSearch, FaUtensils, FaRupeeSign } from 'react-icons/fa';
import { foodOrderAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const AdminFoodOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0
  });

  const calculateStats = useCallback(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Preparing').length;
    const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
    const totalRevenue = orders
      .filter((o) => o.status === 'Delivered')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    setStats({
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue
    });
  }, [orders]);

  const applyFilters = useCallback(() => {
    let filtered = [...orders];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (order) => {
          // Safety check for null user
          if (!order.user) return false;
          
          return (
            order.orderId.toLowerCase().includes(filters.search.toLowerCase()) ||
            order.roomNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
            order.user.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
            order.user.email?.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    setFilteredOrders(filtered);
  }, [orders, filters]);

  const fetchOrders = async () => {
    try {
      const { data } = await foodOrderAPI.getAllOrders();
      setOrders(data);
      setFilteredOrders(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch food orders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await foodOrderAPI.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
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
          <Col md={3} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body className="text-center">
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#e3f2fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 15px'
                  }}
                >
                  <FaUtensils size={30} color="#2196f3" />
                </div>
                <h3>{stats.totalOrders}</h3>
                <p className="text-muted mb-0">Total Orders</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body className="text-center">
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#fff3e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 15px'
                  }}
                >
                  <FaUtensils size={30} color="#ff9800" />
                </div>
                <h3>{stats.pendingOrders}</h3>
                <p className="text-muted mb-0">Pending/Preparing</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body className="text-center">
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#e8f5e9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 15px'
                  }}
                >
                  <FaUtensils size={30} color="#4caf50" />
                </div>
                <h3>{stats.deliveredOrders}</h3>
                <p className="text-muted mb-0">Delivered</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body className="text-center">
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#fff3e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 15px'
                  }}
                >
                  <FaRupeeSign size={30} color="#ff9800" />
                </div>
                <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
                <p className="text-muted mb-0">Total Revenue</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <h5 className="mb-3">
              <FaSearch className="me-2" />
              Search & Filter Orders
            </h5>
            <Row>
              <Col md={8}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by Order ID, Room Number, Guest Name, or Email"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </Form.Select>
              </Col>
              <Col md={1}>
                <Button
                  variant="outline-secondary"
                  onClick={() => setFilters({ search: '', status: '' })}
                  className="w-100"
                >
                  Clear
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Orders Table */}
        <Card className="shadow-sm">
          <Card.Header style={{ background: '#c9a96e', color: 'white' }}>
            <h5 className="mb-0">All Food Orders ({filteredOrders.length})</h5>
          </Card.Header>
          <Card.Body className="p-0">
            {filteredOrders.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <Table striped hover responsive className="mb-0">
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th>Order ID</th>
                      <th>Room</th>
                      <th>Guest</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      // Safety check for null user
                      if (!order.user) return null;
                      
                      return (
                        <tr key={order._id}>
                          <td>
                            <strong>{order.orderId}</strong>
                          </td>
                          <td>
                            <Badge bg="secondary">{order.roomNumber}</Badge>
                          </td>
                          <td>
                            <div>
                              <strong>{order.user?.name || 'N/A'}</strong>
                              <br />
                              <small className="text-muted">{order.user?.email || 'N/A'}</small>
                              <br />
                              <small className="text-muted">{order.user?.phone || 'N/A'}</small>
                            </div>
                          </td>
                          <td>
                            <small>
                              {order.items.map((item, index) => (
                                <div key={index}>
                                  {item.name} × {item.quantity}
                                </div>
                              ))}
                            </small>
                          </td>
                          <td>
                            <strong style={{ color: '#c9a96e' }}>₹{order.totalAmount}</strong>
                          </td>
                          <td>{getStatusBadge(order.status)}</td>
                          <td>
                            <small>{new Date(order.createdAt).toLocaleString()}</small>
                          </td>
                          <td>
                            {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                              <Form.Select
                                size="sm"
                                value={order.status}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                style={{ width: '140px' }}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Preparing">Preparing</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </Form.Select>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-5">
                <h5>No orders found</h5>
                <p className="text-muted">Try adjusting your filters</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default AdminFoodOrders;
