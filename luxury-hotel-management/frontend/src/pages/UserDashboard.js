import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { roomAPI } from '../utils/api';
import RoomCard from '../components/RoomCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    roomType: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, rooms]);

  const fetchRooms = async () => {
    try {
      const { data } = await roomAPI.getAllRooms();
      setRooms(data);
      setFilteredRooms(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch rooms');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...rooms];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (room) =>
          room.roomType.toLowerCase().includes(filters.search.toLowerCase()) ||
          room.roomNumber.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Room type filter
    if (filters.roomType) {
      filtered = filtered.filter((room) => room.roomType === filters.roomType);
    }

    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter((room) => room.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((room) => room.price <= Number(filters.maxPrice));
    }

    setFilteredRooms(filtered);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      roomType: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="page-header">
        <Container>
          <h1 className="text-center">Welcome, {user?.name}!</h1>
          <p className="text-center" style={{ fontSize: '1.2rem' }}>Find your perfect room</p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Filters Section */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h5 className="mb-3">
              <FaFilter className="me-2" />
              Search & Filter
            </h5>
            <Row>
              <Col md={3} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search by room type or number"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Select
                  value={filters.roomType}
                  onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
                >
                  <option value="">All Room Types</option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Executive">Executive</option>
                  <option value="Presidential">Presidential</option>
                </Form.Select>
              </Col>
              <Col md={2} className="mb-3">
                <Form.Control
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />
              </Col>
              <Col md={2} className="mb-3">
                <Form.Control
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
              </Col>
              <Col md={2} className="mb-3">
                <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
                  Clear
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <h5>
            Showing {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'}
          </h5>
        </div>

        {/* Rooms Grid */}
        {filteredRooms.length > 0 ? (
          <Row>
            {filteredRooms.map((room) => (
              <Col md={6} lg={4} key={room._id} className="mb-4">
                <RoomCard room={room} />
              </Col>
            ))}
          </Row>
        ) : (
          <Card className="text-center py-5">
            <Card.Body>
              <h4>No rooms found</h4>
              <p className="text-muted">Try adjusting your filters</p>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
};

export default UserDashboard;
