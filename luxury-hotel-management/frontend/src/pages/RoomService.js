import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Modal } from 'react-bootstrap';
import { FaUtensils, FaShoppingCart, FaTrash, FaPlus, FaMinus, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { foodOrderAPI } from '../utils/api';
import { toast } from 'react-toastify';

const RoomService = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [roomNumber, setRoomNumber] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);

  // Menu Items
  const menuItems = [
    // Breakfast
    {
      id: 1,
      name: 'Continental Breakfast',
      category: 'Breakfast',
      price: 450,
      image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400',
      description: 'Eggs, toast, juice, coffee'
    },
    {
      id: 2,
      name: 'Pancakes Special',
      category: 'Breakfast',
      price: 350,
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
      description: 'Stack of fluffy pancakes with maple syrup'
    },
    {
      id: 3,
      name: 'Fresh Fruit Platter',
      category: 'Breakfast',
      price: 300,
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400',
      description: 'Seasonal fresh fruits'
    },
    // Main Course
    {
      id: 4,
      name: 'Grilled Chicken',
      category: 'Main Course',
      price: 650,
      image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
      description: 'Grilled chicken with vegetables'
    },
    {
      id: 5,
      name: 'Butter Chicken',
      category: 'Main Course',
      price: 550,
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
      description: 'Classic Indian curry with naan'
    },
    {
      id: 6,
      name: 'Veg Biryani',
      category: 'Main Course',
      price: 400,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
      description: 'Aromatic rice with vegetables'
    },
    {
      id: 7,
      name: 'Pasta Alfredo',
      category: 'Main Course',
      price: 480,
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
      description: 'Creamy pasta with garlic bread'
    },
    // Snacks
    {
      id: 8,
      name: 'French Fries',
      category: 'Snacks',
      price: 200,
      image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400',
      description: 'Crispy golden fries'
    },
    {
      id: 9,
      name: 'Club Sandwich',
      category: 'Snacks',
      price: 350,
      image: 'https://images.unsplash.com/photo-1619894991209-e3e0be7e72f2?w=400',
      description: 'Triple-decker sandwich'
    },
    {
      id: 10,
      name: 'Chicken Wings',
      category: 'Snacks',
      price: 400,
      image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400',
      description: 'Spicy chicken wings'
    },
    // Beverages
    {
      id: 11,
      name: 'Fresh Juice',
      category: 'Beverages',
      price: 150,
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
      description: 'Orange/Apple/Mango juice'
    },
    {
      id: 12,
      name: 'Coffee',
      category: 'Beverages',
      price: 120,
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
      description: 'Hot espresso or cappuccino'
    },
    {
      id: 13,
      name: 'Soft Drinks',
      category: 'Beverages',
      price: 80,
      image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400',
      description: 'Cola, Sprite, Fanta'
    },
    // Desserts
    {
      id: 14,
      name: 'Ice Cream',
      category: 'Desserts',
      price: 200,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
      description: 'Vanilla, Chocolate, Strawberry'
    },
    {
      id: 15,
      name: 'Chocolate Cake',
      category: 'Desserts',
      price: 250,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
      description: 'Rich chocolate cake slice'
    }
  ];

  const categories = ['All', 'Breakfast', 'Main Course', 'Snacks', 'Beverages', 'Desserts'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} added to cart!`);
  };

  const updateQuantity = (itemId, change) => {
    setCart(cart.map(item =>
      item.id === itemId
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
    toast.info('Item removed from cart');
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (!roomNumber) {
      toast.error('Please enter your room number');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        roomNumber,
        items: cart.map(item => ({
          name: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: getTotalAmount(),
        specialInstructions
      };

      const { data } = await foodOrderAPI.createOrder(orderData);
      toast.success('Order placed successfully!');
      setCart([]);
      setRoomNumber('');
      setSpecialInstructions('');
      setShowCart(false);
      navigate(`/food-order-confirmation/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1><FaUtensils className="me-3" />Room Service</h1>
        <p style={{ fontSize: '1.2rem' }}>Order delicious food to your room</p>
      </div>

      <Container className="py-5">
        {/* Cart Button */}
        <div className="d-flex justify-content-end mb-4">
          <Button
            className="btn-luxury position-relative"
            onClick={() => setShowCart(true)}
          >
            <FaShoppingCart className="me-2" />
            View Cart
            {cart.length > 0 && (
              <Badge
                bg="danger"
                className="position-absolute top-0 start-100 translate-middle rounded-circle"
                style={{ fontSize: '0.7rem' }}
              >
                {cart.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Category Filter */}
        <div className="mb-4 d-flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'outline-secondary'}
              onClick={() => setSelectedCategory(category)}
              style={selectedCategory === category ? { background: '#c9a96e', borderColor: '#c9a96e' } : {}}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Menu Items */}
        <Row>
          {filteredItems.map((item) => (
            <Col md={6} lg={4} key={item.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <Card.Img
                    variant="top"
                    src={item.image}
                    style={{ height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title style={{ fontFamily: "'Playfair Display', serif" }}>
                      {item.name}
                    </Card.Title>
                    <Badge bg="secondary">{item.category}</Badge>
                  </div>
                  <Card.Text className="text-muted flex-grow-1">
                    {item.description}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <strong style={{ fontSize: '1.3rem', color: '#c9a96e' }}>
                      ₹{item.price}
                    </strong>
                    <Button
                      className="btn-luxury"
                      size="sm"
                      onClick={() => addToCart(item)}
                    >
                      <FaPlus className="me-1" />
                      Add
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Cart Modal */}
      <Modal show={showCart} onHide={() => setShowCart(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaShoppingCart className="me-2" />
            Your Cart
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cart.length === 0 ? (
            <div className="text-center py-5">
              <h5>Your cart is empty</h5>
              <p className="text-muted">Add items from the menu</p>
            </div>
          ) : (
            <>
              {/* Room Number */}
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Room Number *</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your room number (e.g., 101)"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Cart Items */}
              <div className="mb-3">
                <h6>Items:</h6>
                {cart.map((item) => (
                  <Card key={item.id} className="mb-2">
                    <Card.Body className="p-3">
                      <Row className="align-items-center">
                        <Col xs={3}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        </Col>
                        <Col xs={5}>
                          <strong>{item.name}</strong>
                          <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                            ₹{item.price} × {item.quantity}
                          </div>
                        </Col>
                        <Col xs={3}>
                          <div className="d-flex align-items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <FaMinus />
                            </Button>
                            <span>{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <FaPlus />
                            </Button>
                          </div>
                        </Col>
                        <Col xs={1}>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <FaTrash />
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>

              {/* Special Instructions */}
              <Form.Group className="mb-3">
                <Form.Label>Special Instructions (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Any special requests? (e.g., extra spicy, no onions)"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </Form.Group>

              {/* Delivery Time */}
              <div className="alert alert-info d-flex align-items-center">
                <FaClock className="me-2" />
                <span>Estimated delivery: 30-45 minutes</span>
              </div>

              {/* Total */}
              <div className="d-flex justify-content-between align-items-center mb-3 p-3" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
                <h5 className="mb-0">Total Amount:</h5>
                <h4 className="mb-0" style={{ color: '#c9a96e' }}>₹{getTotalAmount()}</h4>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowCart(false)}>
            Continue Shopping
          </Button>
          <Button
            className="btn-luxury"
            onClick={handlePlaceOrder}
            disabled={cart.length === 0 || !roomNumber || loading}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RoomService;
