import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, InputGroup, Button, Tabs, Tab } from 'react-bootstrap';
import { FaSearch, FaCalendarAlt, FaUsers, FaRupeeSign, FaHotel, FaCheck, FaHistory, FaClipboardList } from 'react-icons/fa';
import { bookingAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [orderHistory, setOrderHistory] = useState({});

  // Define callback functions BEFORE useEffect hooks
  const calculateStats = useCallback(() => {
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed').length;
    const cancelledBookings = bookings.filter((b) => b.status === 'Cancelled').length;
    const totalRevenue = bookings
      .filter((b) => b.status === 'Confirmed' || b.status === 'Completed')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    setStats({
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      totalRevenue
    });
  }, [bookings]);

  const applyFilters = useCallback(() => {
    let filtered = [...bookings];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (booking) => {
          // Safety checks for null values
          if (!booking.user || !booking.room) return false;
          
          return (
            booking.bookingId.toLowerCase().includes(filters.search.toLowerCase()) ||
            booking.user.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
            booking.user.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
            booking.room.roomNumber?.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((booking) => booking.status === filters.status);
    }

    setFilteredBookings(filtered);
  }, [bookings, filters]);

  const groupBookingsByDate = useCallback((bookings) => {
    const grouped = {};
    bookings.forEach(booking => {
      const date = new Date(booking.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(booking);
    });
    setOrderHistory(grouped);
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await bookingAPI.getAllBookings();
      setBookings(data);
      setFilteredBookings(data);
      groupBookingsByDate(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch bookings');
      setLoading(false);
    }
  }, [groupBookingsByDate]);

  const getTodayBookings = () => {
    const today = new Date().toDateString();
    return bookings.filter(booking => 
      new Date(booking.createdAt).toDateString() === today
    );
  };

  const getPendingBookings = () => {
    return bookings.filter(booking => booking.status === 'Confirmed');
  };

  const handleConfirmOrder = async (bookingId) => {
    try {
      await bookingAPI.updateBookingStatus(bookingId, 'Completed');
      toast.success('Order confirmed and moved to history!');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to confirm order');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const getStatusBadge = (status) => {
    const statusColors = {
      Confirmed: 'success',
      Cancelled: 'danger',
      Completed: 'secondary'
    };
    return <Badge bg={statusColors[status] || 'primary'}>{status}</Badge>;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="page-header">
        <Container>
          <h1>Admin Dashboard</h1>
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
                  <FaHotel size={30} color="#2196f3" />
                </div>
                <h3>{stats.totalBookings}</h3>
                <p className="text-muted mb-0">Total Bookings</p>
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
                  <FaCalendarAlt size={30} color="#4caf50" />
                </div>
                <h3>{stats.confirmedBookings}</h3>
                <p className="text-muted mb-0">Confirmed</p>
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
                    background: '#ffebee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 15px'
                  }}
                >
                  <FaUsers size={30} color="#f44336" />
                </div>
                <h3>{stats.cancelledBookings}</h3>
                <p className="text-muted mb-0">Cancelled</p>
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

        {/* Tabs for Different Views */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
          style={{ borderBottom: '2px solid #c9a96e' }}
        >
          {/* Overview Tab */}
          <Tab eventKey="overview" title={<span><FaClipboardList className="me-2" />Overview</span>}>
            {/* Filters */}
            <Card className="shadow-sm mb-4 mt-3">
              <Card.Body>
                <h5 className="mb-3">
                  <FaSearch className="me-2" />
                  Search & Filter Bookings
                </h5>
                <Row>
                  <Col md={8}>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaSearch />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search by Booking ID, Guest Name, Email, or Room Number"
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
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Completed">Completed</option>
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

            {/* All Bookings Table */}
            <Card className="shadow-sm">
              <Card.Header style={{ background: '#c9a96e', color: 'white' }}>
                <h5 className="mb-0">All Bookings ({filteredBookings.length})</h5>
              </Card.Header>
              <Card.Body className="p-0">
                {filteredBookings.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <Table striped hover responsive className="mb-0">
                      <thead style={{ background: '#f8f9fa' }}>
                        <tr>
                          <th>Booking ID</th>
                          <th>Guest</th>
                          <th>Room</th>
                          <th>Check-in</th>
                          <th>Check-out</th>
                          <th>Guests</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((booking) => {
                          if (!booking.user || !booking.room) {
                            return null;
                          }
                          
                          return (
                            <tr key={booking._id}>
                              <td>
                                <strong>{booking.bookingId}</strong>
                              </td>
                              <td>
                                <div>
                                  <strong>{booking.user?.name || 'N/A'}</strong>
                                  <br />
                                  <small className="text-muted">{booking.user?.email || 'N/A'}</small>
                                  <br />
                                  <small className="text-muted">{booking.user?.phone || 'N/A'}</small>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <strong>{booking.room?.roomType || 'N/A'}</strong>
                                  <br />
                                  <small className="text-muted">#{booking.room?.roomNumber || 'N/A'}</small>
                                </div>
                              </td>
                              <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                              <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                              <td>{booking.numberOfGuests}</td>
                              <td>
                                <strong style={{ color: '#c9a96e' }}>₹{booking.totalAmount}</strong>
                              </td>
                              <td>{getStatusBadge(booking.status)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <h5>No bookings found</h5>
                    <p className="text-muted">Try adjusting your filters</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab>

          {/* Order Summary Tab */}
          <Tab eventKey="summary" title={<span><FaClipboardList className="me-2" />Order Summary</span>}>
            <Row className="mt-3">
              {/* Today's Orders */}
              <Col lg={6} className="mb-4">
                <Card className="shadow-sm h-100">
                  <Card.Header style={{ background: '#4caf50', color: 'white' }}>
                    <h5 className="mb-0">
                      <FaCalendarAlt className="me-2" />
                      Today's Orders ({getTodayBookings().length})
                    </h5>
                  </Card.Header>
                  <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {getTodayBookings().length > 0 ? (
                      getTodayBookings().map((booking) => {
                        if (!booking.user || !booking.room) return null;
                        return (
                          <Card key={booking._id} className="mb-3 shadow-sm">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="mb-1">{booking.bookingId}</h6>
                                  <small className="text-muted">
                                    {new Date(booking.createdAt).toLocaleTimeString()}
                                  </small>
                                </div>
                                {getStatusBadge(booking.status)}
                              </div>
                              <div className="mb-2">
                                <strong>Guest:</strong> {booking.user?.name}<br />
                                <strong>Room:</strong> {booking.room?.roomType} (#{booking.room?.roomNumber})<br />
                                <strong>Guests:</strong> {booking.numberOfGuests}<br />
                                <strong>Amount:</strong> <span style={{ color: '#c9a96e', fontWeight: 'bold' }}>₹{booking.totalAmount}</span>
                              </div>
                              <div className="mb-2">
                                <small><strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</small><br />
                                <small><strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</small>
                              </div>
                              {booking.status === 'Confirmed' && (
                                <Button
                                  className="btn-luxury w-100 mt-2"
                                  size="sm"
                                  onClick={() => handleConfirmOrder(booking._id)}
                                >
                                  <FaCheck className="me-1" />
                                  Confirm & Move to History
                                </Button>
                              )}
                            </Card.Body>
                          </Card>
                        );
                      })
                    ) : (
                      <div className="text-center py-5">
                        <p className="text-muted">No orders today</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Pending Orders */}
              <Col lg={6} className="mb-4">
                <Card className="shadow-sm h-100">
                  <Card.Header style={{ background: '#ff9800', color: 'white' }}>
                    <h5 className="mb-0">
                      <FaClipboardList className="me-2" />
                      Pending Orders ({getPendingBookings().length})
                    </h5>
                  </Card.Header>
                  <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {getPendingBookings().length > 0 ? (
                      getPendingBookings().map((booking) => {
                        if (!booking.user || !booking.room) return null;
                        return (
                          <Card key={booking._id} className="mb-3 shadow-sm">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="mb-1">{booking.bookingId}</h6>
                                  <small className="text-muted">
                                    {new Date(booking.createdAt).toLocaleDateString()} {new Date(booking.createdAt).toLocaleTimeString()}
                                  </small>
                                </div>
                                {getStatusBadge(booking.status)}
                              </div>
                              <div className="mb-2">
                                <strong>Guest:</strong> {booking.user?.name}<br />
                                <strong>Email:</strong> {booking.user?.email}<br />
                                <strong>Phone:</strong> {booking.user?.phone}<br />
                                <strong>Room:</strong> {booking.room?.roomType} (#{booking.room?.roomNumber})<br />
                                <strong>Guests:</strong> {booking.numberOfGuests}<br />
                                <strong>Amount:</strong> <span style={{ color: '#c9a96e', fontWeight: 'bold' }}>₹{booking.totalAmount}</span>
                              </div>
                              <div className="mb-2">
                                <small><strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</small><br />
                                <small><strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</small>
                              </div>
                              <Button
                                className="btn-luxury w-100 mt-2"
                                size="sm"
                                onClick={() => handleConfirmOrder(booking._id)}
                              >
                                <FaCheck className="me-1" />
                                Confirm & Move to History
                              </Button>
                            </Card.Body>
                          </Card>
                        );
                      })
                    ) : (
                      <div className="text-center py-5">
                        <p className="text-muted">No pending orders</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          {/* Order History Tab */}
          <Tab eventKey="history" title={<span><FaHistory className="me-2" />Order History</span>}>
            <Card className="shadow-sm mt-3">
              <Card.Header style={{ background: '#c9a96e', color: 'white' }}>
                <h5 className="mb-0">
                  <FaHistory className="me-2" />
                  Day-by-Day Order History
                </h5>
              </Card.Header>
              <Card.Body>
                {Object.keys(orderHistory).length > 0 ? (
                  Object.keys(orderHistory)
                    .sort((a, b) => new Date(b) - new Date(a))
                    .map((date) => (
                      <div key={date} className="mb-4">
                        <h5 style={{ color: '#c9a96e', borderBottom: '2px solid #c9a96e', paddingBottom: '10px' }}>
                          📅 {date} ({orderHistory[date].length} orders)
                        </h5>
                        <div style={{ overflowX: 'auto' }}>
                          <Table striped hover responsive className="mt-3">
                            <thead style={{ background: '#f8f9fa' }}>
                              <tr>
                                <th>Time</th>
                                <th>Booking ID</th>
                                <th>Guest</th>
                                <th>Room</th>
                                <th>Check-in</th>
                                <th>Check-out</th>
                                <th>Amount</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orderHistory[date].map((booking) => {
                                if (!booking.user || !booking.room) return null;
                                return (
                                  <tr key={booking._id}>
                                    <td>
                                      <small>{new Date(booking.createdAt).toLocaleTimeString()}</small>
                                    </td>
                                    <td>
                                      <strong>{booking.bookingId}</strong>
                                    </td>
                                    <td>
                                      <div>
                                        <strong>{booking.user?.name}</strong>
                                        <br />
                                        <small className="text-muted">{booking.user?.email}</small>
                                      </div>
                                    </td>
                                    <td>
                                      <div>
                                        {booking.room?.roomType}
                                        <br />
                                        <small className="text-muted">#{booking.room?.roomNumber}</small>
                                      </div>
                                    </td>
                                    <td>
                                      <small>{new Date(booking.checkInDate).toLocaleDateString()}</small>
                                    </td>
                                    <td>
                                      <small>{new Date(booking.checkOutDate).toLocaleDateString()}</small>
                                    </td>
                                    <td>
                                      <strong style={{ color: '#c9a96e' }}>₹{booking.totalAmount}</strong>
                                    </td>
                                    <td>{getStatusBadge(booking.status)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </div>
                        <div className="mt-2 p-2" style={{ background: '#f8f9fa', borderRadius: '5px' }}>
                          <Row>
                            <Col md={6}>
                              <strong>Total Orders:</strong> {orderHistory[date].length}
                            </Col>
                            <Col md={6} className="text-end">
                              <strong>Total Revenue:</strong>{' '}
                              <span style={{ color: '#c9a96e', fontSize: '1.1rem' }}>
                                ₹{orderHistory[date]
                                  .filter(b => b.status === 'Completed' || b.status === 'Confirmed')
                                  .reduce((sum, b) => sum + b.totalAmount, 0)
                                  .toLocaleString()}
                              </span>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-5">
                    <h5>No order history</h5>
                    <p className="text-muted">Orders will appear here once created</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </Container>
    </>
  );
};

export default AdminDashboard;
