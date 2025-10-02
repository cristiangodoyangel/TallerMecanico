import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Badge, Spinner } from 'react-bootstrap';
import { busquedaAPI, clientesAPI, vehiculosAPI } from '../services/api';

const Busqueda = () => {
  const [termino, setTermino] = useState('');
  const [resultados, setResultados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tipoBusqueda, setTipoBusqueda] = useState('general');

  const realizarBusqueda = async (e) => {
    e.preventDefault();
    
    if (!termino.trim()) {
      setError('Por favor ingresa un término de búsqueda');
      return;
    }

    setLoading(true);
    setError('');
    setResultados(null);

    try {
      let datos;
      
      switch (tipoBusqueda) {
        case 'rut':
          datos = await clientesAPI.buscarPorRut(termino);
          setResultados({ clientes: [datos], vehiculos: [], ordenes: [] });
          break;
        case 'patente':
          datos = await vehiculosAPI.buscarPorPatente(termino);
          setResultados({ clientes: [], vehiculos: [datos], ordenes: [] });
          break;
        case 'general':
        default:
          datos = await busquedaAPI.buscarGeneral(termino);
          setResultados(datos);
          break;
      }
    } catch (err) {
      setError(err.message || 'Error al realizar la búsqueda');
      setResultados(null);
    } finally {
      setLoading(false);
    }
  };

  const detectarTipoBusqueda = (valor) => {
    const rutPattern = /^\d{7,8}-[\dkK]$/;
    const patentePattern = /^[A-Z]{2}\d{4}$|^[A-Z]{4}\d{2}$/;
    
    if (rutPattern.test(valor)) {
      setTipoBusqueda('rut');
    } else if (patentePattern.test(valor.toUpperCase())) {
      setTipoBusqueda('patente');
    } else {
      setTipoBusqueda('general');
    }
  };

  const handleTerminoChange = (e) => {
    const valor = e.target.value;
    setTermino(valor);
    detectarTipoBusqueda(valor);
  };

  const getTipoBadge = () => {
    switch (tipoBusqueda) {
      case 'rut':
        return <Badge bg="primary" className="ms-2">RUT</Badge>;
      case 'patente':
        return <Badge bg="success" className="ms-2">Patente</Badge>;
      default:
        return <Badge bg="secondary" className="ms-2">General</Badge>;
    }
  };

  const renderClientes = (clientes) => {
    if (!clientes || clientes.length === 0) return null;

    return (
      <Card className="mb-4 border-0 shadow">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">
            <i className="fas fa-users me-2"></i>
            Clientes Encontrados ({clientes.length})
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive className="mb-0">
            <thead className="bg-light">
              <tr>
                <th className="py-3">Nombre</th>
                <th className="py-3">RUT</th>
                <th className="py-3">Teléfono</th>
                <th className="py-3">Comuna</th>
                <th className="py-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente, index) => (
                <tr key={index}>
                  <td className="py-3"><strong>{cliente.nombre}</strong></td>
                  <td className="py-3">{cliente.rut}</td>
                  <td className="py-3">{cliente.telefono}</td>
                  <td className="py-3">{cliente.comuna}</td>
                  <td className="py-3">{cliente.email || <span className="text-muted">No registrado</span>}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  const renderVehiculos = (vehiculos) => {
    if (!vehiculos || vehiculos.length === 0) return null;

    return (
      <Card className="mb-4 border-0 shadow">
        <Card.Header className="bg-success text-white">
          <h5 className="mb-0">
            <i className="fas fa-car me-2"></i>
            Vehículos Encontrados ({vehiculos.length})
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive className="mb-0">
            <thead className="bg-light">
              <tr>
                <th className="py-3">Patente</th>
                <th className="py-3">Marca</th>
                <th className="py-3">Modelo</th>
                <th className="py-3">Año</th>
                <th className="py-3">Color</th>
                <th className="py-3">Cliente</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.map((vehiculo, index) => (
                <tr key={index}>
                  <td className="py-3"><strong className="text-primary">{vehiculo.patente}</strong></td>
                  <td className="py-3">{vehiculo.marca}</td>
                  <td className="py-3">{vehiculo.modelo}</td>
                  <td className="py-3">{vehiculo.año}</td>
                  <td className="py-3">{vehiculo.color}</td>
                  <td className="py-3">{vehiculo.cliente_nombre || <span className="text-muted">No asignado</span>}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  const renderOrdenes = (ordenes) => {
    if (!ordenes || ordenes.length === 0) return null;

    return (
      <Card className="mb-4 border-0 shadow">
        <Card.Header className="bg-danger text-white">
          <h5 className="mb-0">
            <i className="fas fa-clipboard-list me-2"></i>
            Órdenes de Trabajo Encontradas ({ordenes.length})
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive className="mb-0">
            <thead className="bg-light">
              <tr>
                <th className="py-3">N° Orden</th>
                <th className="py-3">Cliente</th>
                <th className="py-3">Vehículo</th>
                <th className="py-3">Fecha Ingreso</th>
                <th className="py-3">Estado</th>
                <th className="py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden, index) => (
                <tr key={index}>
                  <td className="py-3"><strong className="text-danger">#{orden.numero_orden}</strong></td>
                  <td className="py-3">{orden.cliente_nombre}</td>
                  <td className="py-3">{orden.vehiculo_info}</td>
                  <td className="py-3">{new Date(orden.fecha_ingreso).toLocaleDateString()}</td>
                  <td className="py-3">
                    <Badge bg="primary">{orden.estado}</Badge>
                  </td>
                  <td className="py-3">
                    <div className="d-flex gap-2">
                      <Button variant="outline-primary" size="sm">
                        <i className="fas fa-eye me-1"></i>
                        Ver
                      </Button>
                      <Button variant="outline-danger" size="sm">
                        <i className="fas fa-file-pdf me-1"></i>
                        PDF
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="main-content">
      <Container className="py-5">
        {/* Formulario de Búsqueda */}
        <Row className="justify-content-center mb-5">
          <Col lg={10} xl={8}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-5">
                  <h1 className="text-primary mb-3 fw-bold">Buscar Cliente/Vehículo</h1>
                  <div className="border-start border-danger border-5 d-inline-block ps-3">
                    <h5 className="mb-0 text-muted">Buscar por RUT, Nombre o Patente</h5>
                  </div>
                </div>
                
                <Form onSubmit={realizarBusqueda}>
                  <Row className="align-items-end">
                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="Ingresa RUT, nombre del cliente o patente del vehículo"
                          size="lg"
                          value={termino}
                          onChange={handleTerminoChange}
                          disabled={loading}
                          className="py-3"
                        />
                        <Form.Text className="text-muted d-flex align-items-center mt-2">
                          <i className="fas fa-info-circle me-2"></i>
                          Tipo detectado: {getTipoBadge()}
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Button 
                        variant="danger" 
                        size="lg" 
                        className="w-100 mb-3 py-3"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Buscando...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-search me-2"></i>
                            BUSCAR
                          </>
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Form>
                
                <div className="mt-4 text-center">
                  <small className="text-muted">
                    <i className="fas fa-lightbulb me-2 text-warning"></i>
                    Puedes buscar por RUT (ej: 12345678-9), nombre del cliente o patente del vehículo (ej: AB1234)
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Mensajes de Error */}
        {error && (
          <Row className="justify-content-center mb-4">
            <Col lg={10} xl={8}>
              <Alert variant="danger" className="border-0 shadow-sm">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Resultados */}
        {resultados && (
          <Row className="justify-content-center">
            <Col lg={10} xl={10}>
              <div className="mb-4">
                <h3 className="text-primary">
                  <i className="fas fa-search-plus me-2"></i>
                  Resultados de la búsqueda
                </h3>
                <p className="text-muted fs-5">
                  Término buscado: "<strong>{termino}</strong>" {getTipoBadge()}
                </p>
              </div>

              {renderClientes(resultados.clientes)}
              {renderVehiculos(resultados.vehiculos)}
              {renderOrdenes(resultados.ordenes)}

              {/* Sin resultados */}
              {(!resultados.clientes || resultados.clientes.length === 0) &&
               (!resultados.vehiculos || resultados.vehiculos.length === 0) &&
               (!resultados.ordenes || resultados.ordenes.length === 0) && (
                <Card className="border-0 shadow-sm">
                  <Card.Body className="text-center py-5">
                    <div className="mb-4">
                      <i className="fas fa-search fa-4x text-muted mb-3"></i>
                      <h5 className="text-muted">No se encontraron resultados</h5>
                      <p className="text-muted">
                        No se encontraron clientes, vehículos u órdenes que coincidan con tu búsqueda.
                      </p>
                    </div>
                    <Button variant="outline-danger" onClick={() => {
                      setTermino('');
                      setResultados(null);
                      setError('');
                    }}>
                      <i className="fas fa-redo me-2"></i>
                      Nueva Búsqueda
                    </Button>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Busqueda;