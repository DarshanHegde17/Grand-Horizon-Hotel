import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, InputGroup, Button } from 'react-bootstrap';
import { FaSearch, FaCalendarAlt, FaUsers, FaRupeeSign, FaHotel } from 'react-icons/fa';
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

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, bookings]);

  useEffect(() => {
    calculateStats();
  }, [bookings]);

  const fetchBookings = async () => {
    try {
      const { data } = await bookingAPI.getAllBookings();
      setBookings(data);
      setFilteredBookings(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const calculateStats = () => {
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
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (booking) =>
          booking.bookingId.toLowerCase().includes(filters.search.toLowerCase()) ||
          booking.user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          booking.user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          booking.room.roomNumber.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((booking) => booking.status === filters.status);
    }

    setFilteredBookings(filtered);
  };

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

        {/* Filters */}
        <Card className="shadow-sm mb-4">
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

        {/* Bookings Table */}
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
                    {filteredBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>
                          <strong>{booking.bookingId}</strong>
                        </td>
                        <td>
                          <div>
                            <strong>{booking.user.name}</strong>
                            <br />
                            <small className="text-muted">{booking.user.email}</small>
                            <br />
                            <small className="text-muted">{booking.user.phone}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong>{booking.room.roomType}</strong>
                            <br />
                            <small className="text-muted">#{booking.room.roomNumber}</small>
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
                    ))}
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
      </Container>
    </>
  );
};

export default AdminDashboard;
