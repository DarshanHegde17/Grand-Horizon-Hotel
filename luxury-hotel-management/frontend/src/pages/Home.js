import React, { useState } from 'react';
import { Container, Row, Col, Carousel, Card, Button, Form } from 'react-bootstrap';
import { FaWifi, FaSpa, FaConciergeBell, FaSwimmingPool, FaDumbbell, FaUtensils, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { contactAPI } from '../utils/api';

const Home = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.sendMessage(contactForm);
      toast.success('Message sent successfully! We will contact you soon.');
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const services = [
    { icon: <FaWifi size={40} />, title: 'Free Wi-Fi', desc: 'High-speed internet throughout the property' },
    { icon: <FaSpa size={40} />, title: 'Spa & Wellness', desc: 'Rejuvenate with our luxury spa services' },
    { icon: <FaConciergeBell size={40} />, title: '24/7 Concierge', desc: 'Round-the-clock personalized service' },
    { icon: <FaSwimmingPool size={40} />, title: 'Pool & Beach', desc: 'Olympic-sized pool and private beach access' },
    { icon: <FaDumbbell size={40} />, title: 'Fitness Center', desc: 'State-of-the-art gym equipment' },
    { icon: <FaUtensils size={40} />, title: 'Fine Dining', desc: 'World-class restaurants and bars' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      text: 'An absolutely stunning hotel! The service was impeccable and the rooms were luxurious. Will definitely return!',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    {
      name: 'Michael Chen',
      rating: 5,
      text: 'Best hotel experience ever! From check-in to check-out, everything was perfect. The staff went above and beyond.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      name: 'Emma Williams',
      rating: 5,
      text: 'The presidential suite exceeded all expectations. Beautiful views, amazing amenities, and world-class service.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    }
  ];

  const gallery = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600',
    'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600'
  ];

  return (
    <>
      {/* Hero Carousel */}
      <Carousel fade>
        <Carousel.Item>
          <div
            style={{
              height: '90vh',
              background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600) center/cover'
            }}
            className="d-flex align-items-center justify-content-center"
          >
            <Container>
              <div className="text-center text-white fade-in-up">
                <h1 style={{ fontSize: '4rem', fontFamily: "'Playfair Display', serif", fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                  Welcome to Luxury
                </h1>
                <p style={{ fontSize: '1.5rem', marginTop: '20px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                  Experience world-class hospitality
                </p>
                <Button className="btn-luxury mt-4" size="lg" href="#rooms">
                  Explore Rooms
                </Button>
              </div>
            </Container>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div
            style={{
              height: '90vh',
              background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600) center/cover'
            }}
            className="d-flex align-items-center justify-content-center"
          >
            <Container>
              <div className="text-center text-white fade-in-up">
                <h1 style={{ fontSize: '4rem', fontFamily: "'Playfair Display', serif", fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                  Unparalleled Comfort
                </h1>
                <p style={{ fontSize: '1.5rem', marginTop: '20px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                  Your home away from home
                </p>
                <Button className="btn-luxury mt-4" size="lg" href="/login">
                  Book Your Stay
                </Button>
              </div>
            </Container>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div
            style={{
              height: '90vh',
              background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1600) center/cover'
            }}
            className="d-flex align-items-center justify-content-center"
          >
            <Container>
              <div className="text-center text-white fade-in-up">
                <h1 style={{ fontSize: '4rem', fontFamily: "'Playfair Display', serif", fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                  Exclusive Excellence
                </h1>
                <p style={{ fontSize: '1.5rem', marginTop: '20px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                  Where luxury meets perfection
                </p>
                <Button className="btn-luxury mt-4" size="lg" href="#contact">
                  Contact Us
                </Button>
              </div>
            </Container>
          </div>
        </Carousel.Item>
      </Carousel>

      {/* About Section */}
      <section id="about" className="section-padding" style={{ background: '#f8f9fa' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
                alt="About"
                className="img-fluid rounded shadow-lg"
              />
            </Col>
            <Col lg={6}>
              <h2 className="luxury-heading">About Luxury Hotel</h2>
              <div className="luxury-divider"></div>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#666' }}>
                Welcome to Luxury Hotel, where sophistication meets comfort. Established with a vision to redefine hospitality, we offer an unparalleled experience that combines elegance, modern amenities, and personalized service.
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#666' }}>
                Our meticulously designed rooms and suites provide the perfect sanctuary for both business and leisure travelers. Every detail has been carefully curated to ensure your stay is nothing short of extraordinary.
              </p>
              <Button className="btn-luxury mt-3">Learn More</Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Rooms Section */}
      <section id="rooms" className="section-padding">
        <Container>
          <div className="text-center mb-5">
            <h2 className="luxury-heading">Featured Rooms</h2>
            <div className="luxury-divider"></div>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>
              Discover our exquisite selection of rooms and suites
            </p>
          </div>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="card-luxury">
                <Card.Img variant="top" src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600" style={{ height: '250px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title style={{ fontFamily: "'Playfair Display', serif" }}>Deluxe Room</Card.Title>
                  <Card.Text>Elegant rooms with modern amenities and stunning city views.</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong style={{ color: '#c9a96e', fontSize: '1.3rem' }}>₹5,000/night</strong>
                    <Button className="btn-luxury" size="sm" href="/login">Book Now</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="card-luxury">
                <Card.Img variant="top" src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600" style={{ height: '250px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title style={{ fontFamily: "'Playfair Display', serif" }}>Suite</Card.Title>
                  <Card.Text>Luxurious suites with separate living areas and premium amenities.</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong style={{ color: '#c9a96e', fontSize: '1.3rem' }}>₹10,000/night</strong>
                    <Button className="btn-luxury" size="sm" href="/login">Book Now</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="card-luxury">
                <Card.Img variant="top" src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600" style={{ height: '250px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title style={{ fontFamily: "'Playfair Display', serif" }}>Presidential</Card.Title>
                  <Card.Text>The epitome of luxury with private pool and butler service.</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong style={{ color: '#c9a96e', fontSize: '1.3rem' }}>₹25,000/night</strong>
                    <Button className="btn-luxury" size="sm" href="/login">Book Now</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding" style={{ background: '#f8f9fa' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="luxury-heading">Hotel Services</h2>
            <div className="luxury-divider"></div>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>
              Experience premium services designed for your comfort
            </p>
          </div>
          <Row>
            {services.map((service, index) => (
              <Col md={4} className="mb-4" key={index}>
                <Card className="card-luxury text-center h-100 p-4">
                  <div style={{ color: '#c9a96e', marginBottom: '20px' }}>
                    {service.icon}
                  </div>
                  <Card.Body>
                    <Card.Title style={{ fontFamily: "'Playfair Display', serif", marginBottom: '15px' }}>
                      {service.title}
                    </Card.Title>
                    <Card.Text style={{ color: '#666' }}>
                      {service.desc}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Gallery Section */}
      <section className="section-padding">
        <Container>
          <div className="text-center mb-5">
            <h2 className="luxury-heading">Photo Gallery</h2>
            <div className="luxury-divider"></div>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>
              Explore our beautiful property
            </p>
          </div>
          <Row>
            {gallery.map((img, index) => (
              <Col md={4} className="mb-4" key={index}>
                <div style={{ height: '250px', overflow: 'hidden', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                  <img
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    onMouseOver={(e) => (e.target.style.transform = 'scale(1.1)')}
                    onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding" style={{ background: '#f8f9fa' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="luxury-heading">Guest Testimonials</h2>
            <div className="luxury-divider"></div>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>
              What our guests say about us
            </p>
          </div>
          <Row>
            {testimonials.map((testimonial, index) => (
              <Col md={4} className="mb-4" key={index}>
                <Card className="card-luxury h-100 p-3">
                  <Card.Body className="text-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '15px' }}
                    />
                    <Card.Title style={{ fontFamily: "'Playfair Display', serif", marginBottom: '10px' }}>
                      {testimonial.name}
                    </Card.Title>
                    <div className="mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} style={{ color: '#c9a96e' }} />
                      ))}
                    </div>
                    <Card.Text style={{ fontStyle: 'italic', color: '#666' }}>
                      "{testimonial.text}"
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Map Section */}
      <section className="section-padding">
        <Container>
          <div className="text-center mb-5">
            <h2 className="luxury-heading">Find Us</h2>
            <div className="luxury-divider"></div>
          </div>
          <div style={{ height: '400px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0346087242166!2d77.22647931508047!3d28.626137382422957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd0c3b3e8b57%3A0x9e1e64b4b8e8e8e8!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="section-padding" style={{ background: '#f8f9fa' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="luxury-heading">Contact Us</h2>
            <div className="luxury-divider"></div>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>
              Get in touch with us
            </p>
          </div>
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="card-luxury p-4">
                <Form onSubmit={handleContactSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Enter your phone"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Your message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Button type="submit" className="btn-luxury w-100" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;
