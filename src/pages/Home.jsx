import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home">

    
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Balance.</h1>
          <p>Premium performance footwear inspired by innovation.</p>
          <div className="hero-buttons">
            <Link to="/products?gender=men" className="btn btn-light px-4">Shop Men</Link>
            <Link to="/products?gender=women" className="btn btn-outline-light px-4">Shop Women</Link>
          </div>
        </div>
      </section>
<div className='container my-5'>

<section className="container my-5" > 
  <h2 className="section-title">Featured Categories</h2>

  <div className="row g-4">
    
    <div className="col-md-6">
      <Link to="/products?gender=men" className="category-card">
        <img
          src="https://i.pinimg.com/1200x/4c/d7/81/4cd7817b1f4fb8e053a1dc1f56bd6951.jpg"
          alt="Men Shoes"
          />
        <div className="category-overlay">
          <h3>MEN</h3>
        </div>
      </Link>
    </div>

    <div className="col-md-6">
      <Link to="/products?gender=women" className="category-card">
        <img
          src="https://i.pinimg.com/1200x/09/0d/72/090d720aa1eaec3d2bbeb1a9e067631e.jpg"
          alt="Women Shoes"
          />
        <div className="category-overlay">
          <h3>WOMEN</h3>
        </div>
      </Link>
    </div>
  </div>
</section>

          </div>
      <section className="premium-banner">
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between">
          <div>
            <h2>Crafted for Performance</h2>
            <p>Engineered comfort meets timeless design.</p>
          </div>
          <Link to="/products" className="btn btn-dark px-4">Explore Collection</Link>
        </div>
      </section>

     <section className="about-section text-center">
  <div className="container">

    <h4 className="about-title">About Us</h4>

    <div className="row about-items">
      <div className="col-md-4">
        <h5>Free Shipping</h5>
        
      </div>

      <div className="col-md-4">
        <h5>Secure Payments</h5>
      
      </div>

      <div className="col-md-4">
        <h5>30-Day Returns</h5>
       
      </div>
    </div>

  </div>
</section>

    </div>
  )
}
