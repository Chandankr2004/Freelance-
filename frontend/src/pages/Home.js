import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaLaptopCode, FaPalette, FaPenNib, FaChartLine, FaFileAlt, FaHeadset, FaDollarSign, FaBalanceScale, FaUsers, FaCog, FaCheckCircle, FaGlobe, FaLock, FaCreditCard } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [heroToggle, setHeroToggle] = useState('talent');
  const [howItWorksToggle, setHowItWorksToggle] = useState('hiring');

  const categories = [
    { icon: <FaLaptopCode />, name: 'AI Services', count: '12.5k+' },
    { icon: <FaCog />, name: 'Development & IT', count: '45.2k+' },
    { icon: <FaPalette />, name: 'Design & Creative', count: '28.7k+' },
    { icon: <FaChartLine />, name: 'Sales & Marketing', count: '19.3k+' },
    { icon: <FaPenNib />, name: 'Writing & Translation', count: '15.8k+' },
    { icon: <FaHeadset />, name: 'Admin & Support', count: '8.9k+' },
    { icon: <FaDollarSign />, name: 'Finance & Accounting', count: '6.4k+' },
    { icon: <FaBalanceScale />, name: 'Legal', count: '3.2k+' },
    { icon: <FaUsers />, name: 'HR & Training', count: '5.1k+' },
    { icon: <FaFileAlt />, name: 'Engineering & Architecture', count: '7.6k+' }
  ];

  const testimonials = [
    {
      category: 'Web Development',
      review: 'FreelanceHub connected us with an amazing developer who delivered our project ahead of schedule. The quality exceeded our expectations!',
      rating: 5,
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc.',
      date: '2 weeks ago',
      image: 'https://ui-avatars.com/api?name=Sarah+Johnson&background=10b981&color=fff'
    },
    {
      category: 'Graphic Design',
      review: 'Found the perfect designer for our rebrand. The process was smooth, and the results were outstanding. Highly recommend!',
      rating: 5,
      name: 'Michael Chen',
      role: 'Marketing Director',
      date: '1 month ago',
      image: 'https://ui-avatars.com/api?name=Michael+Chen&background=10b981&color=fff'
    },
    {
      category: 'Content Writing',
      review: 'Professional writers who understand our brand voice. The content quality is consistently excellent.',
      rating: 5,
      name: 'Emily Rodriguez',
      role: 'Content Manager',
      date: '3 weeks ago',
      image: 'https://ui-avatars.com/api?name=Emily+Rodriguez&background=10b981&color=fff'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-headline">
                Find the Best Freelance <span className="gradient-text">Jobs</span>
              </h1>
              <p className="hero-subheading">
                Connecting talent with opportunity - The future of work is here!
              </p>
              
              {/* Search Bar */}
              <div className="hero-search">
                <form className="search-form-hero" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="text"
                    placeholder="Type job keyword"
                    className="search-input-hero"
                  />
                  <select className="search-dropdown-hero">
                    <option value="job">Job</option>
                    <option value="freelancer">Freelancer</option>
                  </select>
                  <button type="submit" className="search-button-hero">
                    <FaSearch />
                  </button>
                </form>
              </div>

              {/* Trust Section */}
              <div className="trust-section-hero">
                <p className="trust-text">Trusted by 1000+ Business</p>
                <div className="company-logos-container">
                  <div className="company-logos">
                    <div className="company-logo">loudWatch</div>
                    <div className="company-logo">Acme Corp</div>
                    <div className="company-logo">GlobalBank</div>
                    {/* Duplicate for seamless loop */}
                    <div className="company-logo">loudWatch</div>
                    <div className="company-logo">Acme Corp</div>
                    <div className="company-logo">GlobalBank</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-image-container">
                {/* Floating Green Shapes */}
                <div className="floating-shape shape-1"></div>
                <div className="floating-shape shape-2"></div>
                <div className="floating-shape shape-3"></div>
                
                {/* Animated Human Working on Laptop */}
                <div className="hero-main-image">
                  <div className="freelancer-illustration">
                    {/* Beanbag Chair */}
                    <div className="beanbag-chair"></div>
                    
                    {/* Human Body */}
                    <div className="human-body">
                      {/* Head */}
                      <div className="human-head">
                        <div className="human-face">
                          <div className="eye left-eye"></div>
                          <div className="eye right-eye"></div>
                          <div className="mouth"></div>
                        </div>
                        <div className="human-hair"></div>
                        <div className="glasses"></div>
                      </div>
                      
                      {/* Torso */}
                      <div className="human-torso">
                        <div className="shirt"></div>
                        <div className="jacket"></div>
                      </div>
                      
                      {/* Arms */}
                      <div className="arm left-arm">
                        <div className="hand left-hand"></div>
                      </div>
                      <div className="arm right-arm">
                        <div className="hand right-hand"></div>
                      </div>
                      
                      {/* Legs */}
                      <div className="legs">
                        <div className="leg left-leg"></div>
                        <div className="leg right-leg"></div>
                      </div>
                    </div>
                    
                    {/* Laptop */}
                    <div className="laptop-graphic">
                      <div className="laptop-screen">
                        <div className="screen-content">
                          <div className="code-line"></div>
                          <div className="code-line"></div>
                          <div className="code-line"></div>
                        </div>
                      </div>
                      <div className="laptop-keyboard"></div>
                    </div>
                  </div>
                </div>

                {/* Callout Badges */}
                <div className="callout-badge badge-1">
                  <span>100% Remote</span>
                </div>
                <div className="callout-badge badge-2">
                  <span>6700+ Jobs Available</span>
                </div>
                <div className="callout-badge badge-3">
                  <span>😊 Great Job ⭐⭐⭐⭐⭐</span>
                </div>
              </div>
              
              {/* Online Button */}
              <div className="online-button">
                <span className="online-dot"></span>
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Explore millions of professionals</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.count} professionals</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Real results from clients</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-badge">{testimonial.category}</div>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.review}"</p>
                <div className="testimonial-author">
                  <img src={testimonial.image} alt={testimonial.name} />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                    <span>{testimonial.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="how-it-works-toggle">
            <button 
              className={howItWorksToggle === 'hiring' ? 'active' : ''}
              onClick={() => setHowItWorksToggle('hiring')}
            >
              For Hiring
            </button>
            <button 
              className={howItWorksToggle === 'freelancing' ? 'active' : ''}
              onClick={() => setHowItWorksToggle('freelancing')}
            >
              For Finding Work
            </button>
          </div>

          {howItWorksToggle === 'hiring' ? (
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Posting jobs is always free</h3>
                <p>Create your job posting in minutes. No hidden fees, no commitments.</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Get proposals and hire experts</h3>
                <p>Receive proposals from qualified freelancers. Review portfolios and choose the best fit.</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Pay securely when work is done</h3>
                <p>Use our secure payment system. Release funds only when you're satisfied.</p>
              </div>
            </div>
          ) : (
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Create your profile</h3>
                <p>Showcase your skills, portfolio, and experience to attract clients.</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Browse and apply to jobs</h3>
                <p>Find projects that match your expertise. Submit proposals with your best work.</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Get hired and get paid</h3>
                <p>Work with clients, deliver quality results, and get paid securely.</p>
              </div>
            </div>
          )}

          <div className="cta-button-wrapper">
            <Link to="/jobs" className="btn btn-primary btn-large">
              Explore Experts
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Payment Section */}
      <section className="trust-section">
        <div className="container">
          <h2 className="section-title">Trusted by businesses worldwide</h2>
          <div className="trust-grid">
            <div className="trust-card">
              <FaGlobe className="trust-icon" />
              <h3>Global Payment Support</h3>
              <p>Accept payments from anywhere in the world with multiple currencies and payment methods.</p>
            </div>
            <div className="trust-card">
              <FaLock className="trust-icon" />
              <h3>Secure Escrow Payments</h3>
              <p>Your funds are held securely until work is completed and approved. Peace of mind guaranteed.</p>
            </div>
            <div className="trust-card">
              <FaCreditCard className="trust-icon" />
              <h3>Multiple Gateways</h3>
              <p>Pay with credit cards, PayPal, bank transfers, and more. Choose what works for you.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
