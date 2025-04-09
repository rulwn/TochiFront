import React from 'react';
import './About.css';
import AboutIcon from '../../assets/Abouticon.png';
import NewsIcon from '../../assets/Newsicon.png';
import { FaBullseye, FaEye, FaAppleAlt, FaHeart } from 'react-icons/fa';

function About() {
  return (
    <div className="about-container">
      <header className="about-header">
        {/* Header vacío según tu código actual */}
      </header>

      <main className="about-content">
        {/* Sección About */}
        <section className="about-section centered-section">
          <div className="section-header-centered">
            <div className="icon-title-wrapper">
              <img src={AboutIcon} alt="About" className="section-icon-centered" />
              <h2 className="section-title-centered">About</h2>
            </div>
          </div>
          <div className="divider-centered"></div>

          <div className="mission-vision">
            <div className="card">
              <div className="card-header">
                <FaBullseye className="card-icon" />
                <h3>Misión</h3>
              </div>
              <p>
                Brindar acceso a productos orgánicos y libres de químicos a través de una plataforma digital 
                que conecte directamente con agricultores locales con consumidores, fomentando una alimentación 
                saludable, el comercio justo y la sostenibilidad ambiental.
              </p>
            </div>

            <div className="card">
              <div className="card-header">
                <FaEye className="card-icon" />
                <h3>Visión</h3>
              </div>
              <p>
                Ser la plataforma líder en la distribución de productos orgánicos en El Salvador, impulsando 
                el desarrollo de la agricultura sostenible y generando un impacto positivo en la salud de 
                las personas y en la economía de los productores locales.
              </p>
            </div>
          </div>
        </section>

        {/* Sección News */}
        <section className="news-section centered-section">
          <div className="section-header-centered">
            <div className="icon-title-wrapper">
              <img src={NewsIcon} alt="News" className="section-icon-centered" />
              <h2 className="section-title-centered">News</h2>
            </div>
          </div>
          <div className="divider-centered"></div>

          <div className="news-articles">
            <article className="news-card">
              <div className="news-icon">
                <FaAppleAlt className="apple-icon" />
              </div>
              <div className="news-content">
                <h3>The new fruit in the market that...</h3>
                <p>
                  <FaHeart className="inline-icon" /> Apples Are Nutrition. Apples May Be Good for Your Heart.<br />
                  <FaHeart className="inline-icon" /> Apples Are Nutritious. Apples May Be Good For Your Heart.<br />
                  <FaHeart className="inline-icon" /> Apples Are Vegetables. Apples May Be Good For Your Heart.
                </p>
              </div>
            </article>

            <article className="news-card">
              <div className="news-icon">
                <FaAppleAlt className="apple-icon" />
              </div>
              <div className="news-content">
                <h3>The new fruit in the market that...</h3>
                <p>
                  <FaHeart className="inline-icon" /> Apples Are Nutritious. Apples May Be Good for Your Heart.<br />
                  <FaHeart className="inline-icon" /> Apples May Be Good For Your Heart.
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default About;