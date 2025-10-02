import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="main-content">
      <Container className="py-5">
        {/* Título principal */}
        <Row className="justify-content-center text-center mb-5">
          <Col lg={10} xl={8}>
            <h1 className="display-4 text-gradient mb-4">Sistema de Ingreso de Vehículos</h1>
            <p className="lead text-muted fs-5">
              AJE Servicios Integrales - Gestión digitalizada de órdenes de trabajo
            </p>
          </Col>
        </Row>

        {/* Tarjetas principales */}
        <Row className="justify-content-center mb-5 g-4">
          {/* Nuevo Ingreso */}
          <Col lg={4} md={6}>
            <Card className="h-100 text-center dashboard-card">
              <Card.Body className="d-flex flex-column p-4">
                <div className="mb-4">
                  <div className="bg-danger text-white rounded-circle mx-auto mb-3" 
                       style={{width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <i className="fas fa-plus fa-2x"></i>
                  </div>
                  <h4 className="card-title text-danger mb-3">Nuevo Ingreso</h4>
                </div>
                <p className="card-text mb-4 flex-grow-1">
                  Registra el ingreso de un nuevo vehículo al taller con todos sus datos y documentación necesaria.
                </p>
                <div className="mt-auto">
                  <Link to="/nueva-orden">
                    <Button variant="danger" size="lg" className="px-4 py-3">
                      INGRESAR VEHÍCULO
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Órdenes de Trabajo */}
          <Col lg={4} md={6}>
            <Card className="h-100 text-center dashboard-card">
              <Card.Body className="d-flex flex-column p-4">
                <div className="mb-4">
                  <div className="bg-white border border-danger rounded-circle mx-auto mb-3" 
                       style={{width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderWidth: '3px'}}>
                    <i className="fas fa-list-alt fa-2x text-danger"></i>
                  </div>
                  <h4 className="card-title text-danger mb-3">Órdenes de Trabajo</h4>
                </div>
                <p className="card-text mb-4 flex-grow-1">
                  Consulta y gestiona todas las órdenes de trabajo activas en el taller.
                </p>
                <div className="mt-auto">
                  <Link to="/ordenes">
                    <Button variant="outline-danger" size="lg" className="px-4 py-3">
                      Ver Órdenes
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Buscar */}
          <Col lg={4} md={6}>
            <Card className="h-100 text-center dashboard-card">
              <Card.Body className="d-flex flex-column p-4">
                <div className="mb-4">
                  <div className="bg-dark text-white rounded-circle mx-auto mb-3" 
                       style={{width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <i className="fas fa-search fa-2x"></i>
                  </div>
                  <h4 className="card-title mb-3">Buscar</h4>
                </div>
                <p className="card-text mb-4 flex-grow-1">
                  Busca clientes, vehículos y órdenes de trabajo por diferentes criterios.
                </p>
                <div className="mt-auto">
                  <Link to="/buscar">
                    <Button variant="dark" size="lg" className="px-4 py-3">
                      Buscar
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Características del Sistema */}
        <Row className="justify-content-center mt-5">
          <Col lg={8} xl={6}>
            <Card className="border-start border-danger border-5 shadow">
              <Card.Body className="p-4">
                <h5 className="text-danger mb-4 text-center">Características del Sistema</h5>
                <Row>
                  <Col md={6}>
                    <ul className="list-unstyled">
                      <li className="mb-3 d-flex align-items-center">
                        <i className="fas fa-check-circle text-danger me-3"></i>
                        <span>Numeración correlativa automática</span>
                      </li>
                      <li className="mb-3 d-flex align-items-center">
                        <i className="fas fa-check-circle text-danger me-3"></i>
                        <span>Marcado interactivo de daños del vehículo</span>
                      </li>
                      <li className="mb-3 d-flex align-items-center">
                        <i className="fas fa-check-circle text-danger me-3"></i>
                        <span>Firmas digitales de cliente y recepcionista</span>
                      </li>
                    </ul>
                  </Col>
                  <Col md={6}>
                    <ul className="list-unstyled">
                      <li className="mb-3 d-flex align-items-center">
                        <i className="fas fa-check-circle text-danger me-3"></i>
                        <span>Generación automática de PDF</span>
                      </li>
                      <li className="mb-3 d-flex align-items-center">
                        <i className="fas fa-check-circle text-danger me-3"></i>
                        <span>Envío por correo electrónico</span>
                      </li>
                      <li className="mb-3 d-flex align-items-center">
                        <i className="fas fa-check-circle text-danger me-3"></i>
                        <span>Diseño responsive para móviles y tablets</span>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} xl={3} className="mt-4 mt-lg-0">
            <Card className="shadow h-100">
              <Card.Body className="p-4 text-center">
                <h6 className="text-danger mb-4">
                  <i className="fas fa-phone me-2"></i>
                  Contacto
                </h6>
                <div className="text-start">
                  <p className="mb-3">
                    <strong>Teléfono:</strong><br />
                    <span className="text-muted">+569 43572479</span>
                  </p>
                  <p className="mb-3">
                    <strong>Email:</strong><br />
                    <span className="text-muted">tallereselingmail.com</span>
                  </p>
                  <p className="mb-0">
                    <strong>Dirección:</strong><br />
                    <span className="text-muted">Calle Llanquihue #3932<br />Antofagasta, Chile</span>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;