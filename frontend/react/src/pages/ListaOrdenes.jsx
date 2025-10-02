import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ordenesAPI } from '../services/api';

const ListaOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar órdenes del backend
  useEffect(() => {
    cargarOrdenes();
  }, []);

  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ordenesAPI.getAll();
      setOrdenes(data);
    } catch (err) {
      setError('Error al cargar las órdenes: ' + err.message);
      console.error('Error cargando órdenes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar órdenes por estado
  const ordenesFiltradas = ordenes.filter(orden => {
    if (!filtroEstado) return true;
    return orden.estado === filtroEstado;
  });

  const getEstadoBadge = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'en proceso':
      case 'en_proceso':
        return <Badge bg="warning" className="px-3 py-2">En Proceso</Badge>;
      case 'listo':
        return <Badge bg="danger" className="px-3 py-2">Listo</Badge>;
      case 'entregado':
        return <Badge bg="success" className="px-3 py-2">Entregado</Badge>;
      case 'recibido':
        return <Badge bg="info" className="px-3 py-2">Recibido</Badge>;
      default:
        return <Badge bg="secondary" className="px-3 py-2">{estado}</Badge>;
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    try {
      return new Date(fecha).toLocaleDateString('es-CL');
    } catch (error) {
      return fecha;
    }
  };

  // Estadísticas
  const estadisticas = {
    total: ordenes.length,
    enProceso: ordenes.filter(o => o.estado?.toLowerCase() === 'en proceso' || o.estado === 'en_proceso').length,
    listas: ordenes.filter(o => o.estado?.toLowerCase() === 'listo').length,
    entregadas: ordenes.filter(o => o.estado?.toLowerCase() === 'entregado').length
  };

  return (
    <div className="main-content">
      <Container className="py-5">
        {/* Header */}
        <Row className="mb-5">
          <Col md={8}>
            <h1 className="text-primary mb-2 fw-bold">Órdenes de Trabajo</h1>
            <p className="text-muted fs-5">Gestiona y consulta todas las órdenes activas del taller</p>
          </Col>
          <Col md={4} className="text-end d-flex align-items-center justify-content-end">
            <Link to="/nueva-orden">
              <Button variant="danger" size="lg" className="px-4 py-3">
                <i className="fas fa-plus me-2"></i>
                NUEVA ORDEN
              </Button>
            </Link>
          </Col>
        </Row>

        {/* Estadísticas */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body className="py-4">
                <div className="display-6 fw-bold text-primary mb-2">{estadisticas.total}</div>
                <div className="text-muted">Total Órdenes</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body className="py-4">
                <div className="display-6 fw-bold text-warning mb-2">{estadisticas.enProceso}</div>
                <div className="text-muted">En Proceso</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body className="py-4">
                <div className="display-6 fw-bold text-danger mb-2">{estadisticas.listas}</div>
                <div className="text-muted">Listas</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body className="py-4">
                <div className="display-6 fw-bold text-success mb-2">{estadisticas.entregadas}</div>
                <div className="text-muted">Entregadas</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filtros */}
        <Row className="mb-4">
          <Col lg={4} md={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-3">
                <Form.Group className="mb-0">
                  <Form.Label className="fw-semibold text-danger">
                    <i className="fas fa-filter me-2"></i>
                    Filtrar por Estado
                  </Form.Label>
                  <Form.Select 
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="border-2"
                  >
                    <option value="">Todos los estados</option>
                    <option value="recibido">Recibido</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="listo">Listo</option>
                    <option value="entregado">Entregado</option>
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-3 d-flex align-items-center justify-content-center">
                <Button 
                  variant="outline-danger" 
                  onClick={cargarOrdenes}
                  disabled={loading}
                  className="px-4"
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Cargando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sync-alt me-2"></i>
                      Actualizar
                    </>
                  )}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Mensaje de Error */}
        {error && (
          <Row className="mb-4">
            <Col>
              <Alert variant="danger" className="border-0 shadow-sm">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Loading Spinner */}
        {loading && !error && (
          <Row className="mb-4">
            <Col className="text-center py-5">
              <Spinner animation="border" variant="danger" style={{ width: '3rem', height: '3rem' }} />
              <div className="mt-3 text-muted">Cargando órdenes...</div>
            </Col>
          </Row>
        )}

        {/* Tabla de Órdenes */}
        {!loading && !error && (
          <Row>
            <Col>
              <Card className="border-0 shadow">
                <Card.Header className="bg-danger text-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="fas fa-clipboard-list me-2"></i>
                      Lista de Órdenes ({ordenesFiltradas.length})
                    </h5>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  {ordenesFiltradas.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                      <h5 className="text-muted">No hay órdenes registradas</h5>
                      <p className="text-muted">
                        {filtroEstado ? 'No se encontraron órdenes con el filtro seleccionado.' : 'Comienza creando tu primera orden de trabajo.'}
                      </p>
                      {!filtroEstado && (
                        <Link to="/nueva-orden">
                          <Button variant="danger" className="mt-3">
                            <i className="fas fa-plus me-2"></i>
                            Crear Primera Orden
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <Table responsive className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="py-3 fw-semibold"># Orden</th>
                          <th className="py-3 fw-semibold">Cliente</th>
                          <th className="py-3 fw-semibold">Vehículo</th>
                          <th className="py-3 fw-semibold">Fecha Ingreso</th>
                          <th className="py-3 fw-semibold">Fecha Prometida</th>
                          <th className="py-3 fw-semibold">Estado</th>
                          <th className="py-3 fw-semibold text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordenesFiltradas.map((orden) => (
                          <tr key={orden.id || orden.numero_orden}>
                            <td className="py-3">
                              <strong className="text-danger">#{orden.numero_orden}</strong>
                            </td>
                            <td className="py-3">
                              <div>
                                <strong>{orden.cliente_nombre || 'Cliente no especificado'}</strong>
                              </div>
                            </td>
                            <td className="py-3">
                              <div>
                                <strong>{orden.vehiculo_info || `${orden.vehiculo_marca || ''} ${orden.vehiculo_modelo || ''}`.trim()}</strong>
                                <br />
                                <small className="text-muted">{orden.vehiculo_patente}</small>
                              </div>
                            </td>
                            <td className="py-3">{formatearFecha(orden.fecha_ingreso)}</td>
                            <td className="py-3">{formatearFecha(orden.fecha_prometida)}</td>
                            <td className="py-3">{getEstadoBadge(orden.estado)}</td>
                            <td className="py-3 text-center">
                              <div className="d-flex gap-2 justify-content-center">
                                <Button variant="outline-primary" size="sm" title="Ver detalles">
                                  <i className="fas fa-eye"></i>
                                </Button>
                                <Button variant="outline-success" size="sm" title="Editar">
                                  <i className="fas fa-edit"></i>
                                </Button>
                                <Button variant="outline-danger" size="sm" title="Generar PDF">
                                  <i className="fas fa-file-pdf"></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ListaOrdenes;