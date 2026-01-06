import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/press">Press</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>For Clients</h3>
            <ul>
              <li><Link to="/how-it-works">How to Hire</Link></li>
              <li><Link to="/talent">Find Talent</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/enterprise">Enterprise</Link></li>
              <li><Link to="/case-studies">Case Studies</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>For Freelancers</h3>
            <ul>
              <li><Link to="/how-to-work">How to Work</Link></li>
              <li><Link to="/find-jobs">Find Jobs</Link></li>
              <li><Link to="/skills">Skills</Link></li>
              <li><Link to="/resources">Resources</Link></li>
              <li><Link to="/community">Community</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Resources</h3>
            <ul>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/guides">Guides</Link></li>
              <li><Link to="/webinars">Webinars</Link></li>
              <li><Link to="/api">API</Link></li>
              <li><Link to="/partners">Partners</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Legal & Security</h3>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/security">Security</Link></li>
              <li><Link to="/trust">Trust & Safety</Link></li>
              <li><Link to="/compliance">Compliance</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {new Date().getFullYear()} FreelanceHub. All rights reserved.</p>
            <div className="social-icons">
              <a href="#" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="GitHub"><FaGithub /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
