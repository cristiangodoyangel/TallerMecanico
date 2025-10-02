import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={8}>
            <h5>AJE Servicios Integrales</h5>
            <p className="mb-1">Gestión digitalizada de órdenes de trabajo</p>
            <ul className="list-unstyled">
              <li>✓ Numeración correlativa automática</li>
              <li>✓ Marcado interactivo de daños del vehículo</li>
              <li>✓ Firmas digitales de cliente y recepcionista</li>
              <li>✓ Generación automática de PDF</li>
              <li>✓ Envío por correo electrónico</li>
              <li>✓ Diseño responsive para móviles y tablets</li>
            </ul>
          </Col>
          <Col md={4}>
            <h6>Contacto</h6>
            <p className="mb-1"><strong>Teléfono:</strong> +569 43572479</p>
            <p className="mb-1"><strong>Email:</strong> tallereselingmail.com</p>
            <p className="mb-1"><strong>Dirección:</strong> Calle Llanquihue #3932</p>
            <p className="mb-0">Antofagasta, Chile</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;