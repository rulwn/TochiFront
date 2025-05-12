import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TermsConditionsAdmin.css';


function TermsAndConditionsAdmin() {
  const navigate = useNavigate();

  return (
    <div className="terms-conditions-admin">

      <div className="admin-terms-container">
      <button 
        className="admin-back-button"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>
      
      <div className="admin-terms-content">
        <header className="admin-terms-header">
          <h1>TÉRMINOS Y CONDICIONES DE USO</h1>
          <h2>Plataforma Tochi - Conectando agricultores y consumidores</h2>
        </header>

        <section className="admin-terms-section">
          <h3>1. Introducción</h3>
          <p>
            Bienvenido a Tochi, la plataforma que conecta directamente a agricultores y consumidores 
            de productos orgánicos en El Salvador. Estos términos y condiciones rigen el uso de 
            nuestra aplicación y los servicios relacionados.
          </p>
        </section>

        <section className="admin-terms-section">
          <h3>2. Definiciones</h3>
          <ul>
            <li><strong>Plataforma:</strong> La aplicación móvil y web Tochi.</li>
            <li><strong>Usuario:</strong> Persona registrada que utiliza la plataforma.</li>
            <li><strong>Consumidor:</strong> Usuario que compra productos a través de la plataforma.</li>
            <li><strong>Productos:</strong> Bienes orgánicos listados en la plataforma.</li>
          </ul>
        </section>

        <section className="admin-terms-section">
          <h3>3. Registro de Usuarios</h3>
          <p>
            Para acceder a todas las funcionalidades, los usuarios deben registrarse proporcionando 
            información verídica como nombre, email, teléfono y dirección. Tochi se reserva el derecho 
            de suspender cuentas con información falsa.
          </p>
        </section>

        <section className="admin-terms-section">
          <h3>4. Publicación de Productos</h3>
          <p>
            Los agricultores son responsables de la exactitud de la información de sus productos 
            (descripción, precio, imágenes). Tochi verifica pero no garantiza la calidad de los 
            productos ofrecidos.
          </p>
        </section>

        <section className="admin-terms-section">
          <h3>5. Proceso de Compra</h3>
          <ul>
            <li>Los precios mostrados son finales e incluyen impuestos aplicables.</li>
            <li>El pago se realiza a través de métodos autorizados por la plataforma.</li>
            <li>Los pedidos quedan confirmados al recibir el pago completo.</li>
          </ul>
        </section>

        <section className="admin-terms-section">
          <h3>6. Política de Envíos</h3>
          <p>
            Los tiempos de entrega varían según la ubicación y disponibilidad del producto. 
            Tochi no se responsabiliza por retrasos causados por factores externos.
          </p>
        </section>

        <section className="admin-terms-section">
          <h3>7. Reseñas y Calificaciones</h3>
          <p>
            Los usuarios pueden calificar productos y dejar comentarios basados en experiencias reales. 
            Se prohíben comentarios difamatorios o falsos.
          </p>
        </section>

        <section className="admin-terms-section">
          <h3>8. Devoluciones y Reembolsos</h3>
          <p>
            Se aceptan devoluciones de productos defectuosos o que no coincidan con la descripción, 
            dentro de las 48 horas posteriores a la recepción. Los reembolsos se procesarán según 
            el método de pago original.
          </p>
        </section>

        <section className="admin-terms-section">
          <h3>9. Privacidad y Seguridad</h3>
          <p>
            Tochi protege los datos personales según nuestra Política de Privacidad. No compartimos 
            información con terceros sin consentimiento, excepto cuando sea requerido por ley.
          </p>
        </section>

        <section className="admin-terms-section">
          <h3>10. Modificaciones</h3>
          <p>
            Estos términos pueden actualizarse periódicamente. Los cambios entrarán en vigor al ser 
            publicados en la plataforma.
          </p>
        </section>

        <section className="admin-terms-section">
          <h3>11. Contacto</h3>
          <p>
            Para consultas sobre estos términos: <br />
            Email: legal@tochi.com.sv <br />
            Teléfono: +503 1234-5678 <br />
            Dirección: Instituto Técnico Ricaldone, San Salvador
          </p>
        </section>

      </div>
    </div>

    </div>
  );
}

export default TermsAndConditionsAdmin;