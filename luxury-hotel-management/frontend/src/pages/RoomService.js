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

  // Menu Items - Organized by Veg, Non-Veg, and Drinks
  const menuItems = [
    // VEG BREAKFAST
    {
      id: 1,
      name: 'Idli Sambar',
      category: 'Veg Breakfast',
      price: 150,
      image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400',
      description: 'Steamed rice cakes with sambar and chutney'
    },
    {
      id: 2,
      name: 'Poha',
      category: 'Veg Breakfast',
      price: 120,
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
      description: 'Flattened rice with peanuts and spices'
    },
    {
      id: 3,
      name: 'Upma',
      category: 'Veg Breakfast',
      price: 130,
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400',
      description: 'Semolina porridge with vegetables'
    },
    {
      id: 4,
      name: 'Aloo Paratha',
      category: 'Veg Breakfast',
      price: 180,
      image: 'https://images.unsplash.com/photo-1639562952443-64ad0b9c7e5e?w=400',
      description: 'Stuffed potato flatbread with curd'
    },
    {
      id: 5,
      name: 'Pancakes',
      category: 'Veg Breakfast',
      price: 200,
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
      description: 'Fluffy pancakes with maple syrup'
    },

    // VEG LUNCH
    {
      id: 6,
      name: 'Veg Thali',
      category: 'Veg Lunch',
      price: 300,
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400',
      description: 'Complete meal with dal, sabzi, roti, rice'
    },
    {
      id: 7,
      name: 'Paneer Butter Masala',
      category: 'Veg Lunch',
      price: 280,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
      description: 'Cottage cheese in creamy tomato gravy'
    },
    {
      id: 8,
      name: 'Chole Bhature',
      category: 'Veg Lunch',
      price: 250,
      image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400',
      description: 'Spicy chickpeas with fried bread'
    },
    {
      id: 9,
      name: 'Veg Biryani',
      category: 'Veg Lunch',
      price: 280,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
      description: 'Aromatic rice with mixed vegetables'
    },
    {
      id: 10,
      name: 'Dal Makhani',
      category: 'Veg Lunch',
      price: 220,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
      description: 'Black lentils in creamy gravy'
    },

    // VEG SNACKS
    {
      id: 11,
      name: 'Samosa',
      category: 'Veg Snacks',
      price: 80,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
      description: 'Crispy pastry with potato filling (2 pcs)'
    },
    {
      id: 12,
      name: 'Pav Bhaji',
      category: 'Veg Snacks',
      price: 180,
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
      description: 'Mashed vegetables with butter buns'
    },
    {
      id: 13,
      name: 'Vada Pav',
      category: 'Veg Snacks',
      price: 60,
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400',
      description: 'Potato fritter in bread bun'
    },
    {
      id: 14,
      name: 'French Fries',
      category: 'Veg Snacks',
      price: 150,
      image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400',
      description: 'Crispy golden fries'
    },
    {
      id: 15,
      name: 'Spring Rolls',
      category: 'Veg Snacks',
      price: 180,
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400',
      description: 'Crispy vegetable spring rolls (4 pcs)'
    },

    // VEG DINNER
    {
      id: 16,
      name: 'Palak Paneer',
      category: 'Veg Dinner',
      price: 280,
      image: 'https://images.unsplash.com/photo-1645177628172-a94c2097a0e8?w=400',
      description: 'Cottage cheese in spinach gravy'
    },
    {
      id: 17,
      name: 'Veg Manchurian',
      category: 'Veg Dinner',
      price: 250,
      image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400',
      description: 'Veg balls in spicy Chinese sauce'
    },
    {
      id: 18,
      name: 'Pasta Alfredo',
      category: 'Veg Dinner',
      price: 300,
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
      description: 'Creamy pasta with garlic bread'
    },
    {
      id: 19,
      name: 'Veg Pizza',
      category: 'Veg Dinner',
      price: 350,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
      description: 'Loaded vegetable pizza'
    },
    {
      id: 20,
      name: 'Veg Fried Rice',
      category: 'Veg Dinner',
      price: 220,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
      description: 'Chinese style fried rice with vegetables'
    },

    // NON-VEG BREAKFAST
    {
      id: 21,
      name: 'Egg Bhurji',
      category: 'Non-Veg Breakfast',
      price: 180,
      image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400',
      description: 'Scrambled eggs with spices'
    },
    {
      id: 22,
      name: 'Omelette',
      category: 'Non-Veg Breakfast',
      price: 150,
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
      description: 'Fluffy omelette with toast'
    },
    {
      id: 23,
      name: 'Chicken Sandwich',
      category: 'Non-Veg Breakfast',
      price: 220,
      image: 'https://images.unsplash.com/photo-1619894991209-e3e0be7e72f2?w=400',
      description: 'Grilled chicken sandwich'
    },
    {
      id: 24,
      name: 'Egg Paratha',
      category: 'Non-Veg Breakfast',
      price: 200,
      image: 'https://images.unsplash.com/photo-1639562952443-64ad0b9c7e5e?w=400',
      description: 'Flatbread stuffed with egg'
    },

    // NON-VEG LUNCH
    {
      id: 25,
      name: 'Butter Chicken',
      category: 'Non-Veg Lunch',
      price: 400,
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
      description: 'Creamy tomato chicken curry with naan'
    },
    {
      id: 26,
      name: 'Chicken Biryani',
      category: 'Non-Veg Lunch',
      price: 380,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
      description: 'Aromatic rice with tender chicken'
    },
    {
      id: 27,
      name: 'Fish Curry',
      category: 'Non-Veg Lunch',
      price: 420,
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400',
      description: 'Fresh fish in spicy curry'
    },
    {
      id: 28,
      name: 'Mutton Rogan Josh',
      category: 'Non-Veg Lunch',
      price: 450,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
      description: 'Aromatic mutton curry'
    },
    {
      id: 29,
      name: 'Chicken Thali',
      category: 'Non-Veg Lunch',
      price: 380,
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400',
      description: 'Complete meal with chicken curry, dal, roti, rice'
    },

    // NON-VEG SNACKS
    {
      id: 30,
      name: 'Chicken Wings',
      category: 'Non-Veg Snacks',
      price: 320,
      image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400',
      description: 'Spicy fried chicken wings (6 pcs)'
    },
    {
      id: 31,
      name: 'Chicken Nuggets',
      category: 'Non-Veg Snacks',
      price: 280,
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
      description: 'Crispy chicken nuggets (8 pcs)'
    },
    {
      id: 32,
      name: 'Fish Fingers',
      category: 'Non-Veg Snacks',
      price: 300,
      image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400',
      description: 'Breaded fish fingers (6 pcs)'
    },
    {
      id: 33,
      name: 'Chicken Tikka',
      category: 'Non-Veg Snacks',
      price: 320,
      image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
      description: 'Grilled chicken tikka (6 pcs)'
    },
    {
      id: 34,
      name: 'Seekh Kebab',
      category: 'Non-Veg Snacks',
      price: 350,
      image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400',
      description: 'Minced meat kebabs (4 pcs)'
    },

    // NON-VEG DINNER
    {
      id: 35,
      name: 'Grilled Chicken',
      category: 'Non-Veg Dinner',
      price: 450,
      image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
      description: 'Grilled chicken with vegetables'
    },
    {
      id: 36,
      name: 'Chicken Fried Rice',
      category: 'Non-Veg Dinner',
      price: 280,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
      description: 'Chinese style fried rice with chicken'
    },
    {
      id: 37,
      name: 'Chicken Pizza',
      category: 'Non-Veg Dinner',
      price: 400,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
      description: 'Loaded chicken pizza'
    },
    {
      id: 38,
      name: 'Fish Fry',
      category: 'Non-Veg Dinner',
      price: 420,
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400',
      description: 'Crispy fried fish with tartar sauce'
    },
    {
      id: 39,
      name: 'Prawn Curry',
      category: 'Non-Veg Dinner',
      price: 480,
      image: 'https://images.unsplash.com/photo-1633504581786-316c8002b1b2?w=400',
      description: 'Fresh prawns in spicy coconut curry'
    },

    // DRINKS - TEA
    {
      id: 40,
      name: 'Masala Chai',
      category: 'Drinks - Tea',
      price: 50,
      image: 'https://images.unsplash.com/photo-1597318112634-c4850f10a2f7?w=400',
      description: 'Indian spiced tea'
    },
    {
      id: 41,
      name: 'Green Tea',
      category: 'Drinks - Tea',
      price: 60,
      image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400',
      description: 'Healthy green tea'
    },
    {
      id: 42,
      name: 'Lemon Tea',
      category: 'Drinks - Tea',
      price: 60,
      image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400',
      description: 'Refreshing lemon tea'
    },
    {
      id: 43,
      name: 'Black Tea',
      category: 'Drinks - Tea',
      price: 40,
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400',
      description: 'Strong black tea'
    },

    // DRINKS - COFFEE
    {
      id: 44,
      name: 'Cappuccino',
      category: 'Drinks - Coffee',
      price: 120,
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
      description: 'Classic cappuccino with foam'
    },
    {
      id: 45,
      name: 'Espresso',
      category: 'Drinks - Coffee',
      price: 100,
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400',
      description: 'Strong espresso shot'
    },
    {
      id: 46,
      name: 'Latte',
      category: 'Drinks - Coffee',
      price: 130,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
      description: 'Smooth coffee latte'
    },
    {
      id: 47,
      name: 'Cold Coffee',
      category: 'Drinks - Coffee',
      price: 140,
      image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
      description: 'Chilled coffee with ice cream'
    },
    {
      id: 48,
      name: 'Filter Coffee',
      category: 'Drinks - Coffee',
      price: 80,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
      description: 'South Indian filter coffee'
    },

    // DRINKS - OTHER
    {
      id: 49,
      name: 'Fresh Orange Juice',
      category: 'Drinks - Other',
      price: 120,
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
      description: 'Freshly squeezed orange juice'
    },
    {
      id: 50,
      name: 'Mango Shake',
      category: 'Drinks - Other',
      price: 130,
      image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400',
      description: 'Thick mango milkshake'
    },
    {
      id: 51,
      name: 'Banana Shake',
      category: 'Drinks - Other',
      price: 120,
      image: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400',
      description: 'Creamy banana milkshake'
    },
    {
      id: 52,
      name: 'Lassi',
      category: 'Drinks - Other',
      price: 100,
      image: 'https://images.unsplash.com/photo-1589733955941-5eeaf9c0b5ca?w=400',
      description: 'Sweet yogurt drink'
    },
    {
      id: 53,
      name: 'Soft Drinks',
      category: 'Drinks - Other',
      price: 60,
      image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400',
      description: 'Cola, Sprite, Fanta, etc.'
    },
    {
      id: 54,
      name: 'Mineral Water',
      category: 'Drinks - Other',
      price: 30,
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
      description: 'Bottled mineral water (1L)'
    },
    {
      id: 55,
      name: 'Fresh Lime Soda',
      category: 'Drinks - Other',
      price: 80,
      image: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400',
      description: 'Refreshing lime soda'
    }
  ];

  const categories = [
    'All', 
    'Veg Breakfast', 'Veg Lunch', 'Veg Snacks', 'Veg Dinner',
    'Non-Veg Breakfast', 'Non-Veg Lunch', 'Non-Veg Snacks', 'Non-Veg Dinner',
    'Drinks - Tea', 'Drinks - Coffee', 'Drinks - Other'
  ];
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
