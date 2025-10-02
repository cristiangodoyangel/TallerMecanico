import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ProgressBar, Alert } from 'react-bootstrap';

const NuevaOrden = () => {
  const [currentStep, setCurrentStep] = useState(2); // Empezamos en paso 2 como en la imagen
  const [formData, setFormData] = useState({
    // Datos del Cliente
    nombre: '',
    rut: '',
    telefono: '',
    comuna: '',
    direccion: '',
    contactoAdicional: '',
    email: '',
    
    // Datos del Vehículo
    marca: '',
    modelo: '',
    año: '',
    patente: '',
    color: '',
    kilometraje: '',
    cilindrada: '',
    combustible: '',
    
    // Trabajos y observaciones
    trabajos: '',
    observaciones: ''
  });

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <div className="text-center mb-4">
              <h4 className="text-primary mb-3">Información del Cliente</h4>
            </div>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre Completo <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ingresa el nombre completo"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>RUT <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="rut"
                    value={formData.rut}
                    onChange={handleInputChange}
                    placeholder="12345678-9"
                    required
                  />
                  <Form.Text className="text-muted">Formato: 12345678-9</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="+56912345678"
                    required
                  />
                  <Form.Text className="text-muted">Formato: +56912345678</Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Comuna <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="comuna"
                    value={formData.comuna}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecciona una comuna</option>
                    <option value="Antofagasta">Antofagasta</option>
                    <option value="Calama">Calama</option>
                    <option value="Tocopilla">Tocopilla</option>
                    <option value="Mejillones">Mejillones</option>
                    <option value="Taltal">Taltal</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Dirección <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Ingresa la dirección completa"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contacto Adicional</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactoAdicional"
                    value={formData.contactoAdicional}
                    onChange={handleInputChange}
                    placeholder="Nombre de contacto adicional (opcional)"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="correo@ejemplo.com (opcional)"
                  />
                  <Form.Text className="text-muted">Para envío automático del PDF de la orden</Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </div>
        );
      
      case 2:
        return (
          <div>
            <div className="text-center mb-4">
              <h4 className="text-danger mb-3">Datos del Vehículo</h4>
              <p className="text-muted">Paso 2 - En desarrollo</p>
            </div>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Marca <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleInputChange}
                    placeholder="Ej: Toyota, Nissan, Chevrolet"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Modelo <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleInputChange}
                    placeholder="Ej: Corolla, Sentra, Spark"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Año <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="año"
                    value={formData.año}
                    onChange={handleInputChange}
                    placeholder="2020"
                    min="1980"
                    max="2025"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Patente <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="patente"
                    value={formData.patente}
                    onChange={handleInputChange}
                    placeholder="AB1234"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="Blanco, Negro, etc."
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Kilometraje</Form.Label>
                  <Form.Control
                    type="number"
                    name="kilometraje"
                    value={formData.kilometraje}
                    onChange={handleInputChange}
                    placeholder="150000"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Cilindrada</Form.Label>
                  <Form.Control
                    type="text"
                    name="cilindrada"
                    value={formData.cilindrada}
                    onChange={handleInputChange}
                    placeholder="1.6L, 2.0L"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Combustible</Form.Label>
                  <Form.Select
                    name="combustible"
                    value={formData.combustible}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecciona</option>
                    <option value="gasolina">Gasolina</option>
                    <option value="diesel">Diesel</option>
                    <option value="gas">Gas</option>
                    <option value="electrico">Eléctrico</option>
                    <option value="hibrido">Híbrido</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </div>
        );
      
      case 3:
        return (
          <div className="text-center">
            <h4 className="text-danger mb-3">Marcado de Daños</h4>
            <p className="text-muted">Paso 3 - En desarrollo</p>
            <p>Aquí se implementará el canvas interactivo para marcar daños en el vehículo</p>
          </div>
        );
      
      case 4:
        return (
          <div className="text-center">
            <h4 className="text-danger mb-3">Firmas Digitales</h4>
            <p className="text-muted">Paso 4 - En desarrollo</p>
            <p>Aquí se implementarán los canvas para las firmas del cliente y recepcionista</p>
          </div>
        );
      
      case 5:
        return (
          <div className="text-center">
            <h4 className="text-danger mb-3">Resumen y Confirmación</h4>
            <p className="text-muted">Paso 5 - En desarrollo</p>
            <p>Aquí se mostrará el resumen completo de la orden antes de guardar</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    }}>
      <Container>
        {/* Header */}
        <Row className="text-center mb-4">
          <Col>
            <div className="bg-primary text-white rounded p-4 mb-4 shadow-lg">
              <h2 className="mb-2 fw-bold">Nueva Orden de Trabajo</h2>
              <p className="mb-0 fs-5">Se generará automáticamente el número correlativo</p>
            </div>
          </Col>
        </Row>

        {/* Progress Bar */}
        <Row className="mb-4">
          <Col>
            <Card className="border-start border-danger border-5 shadow">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0 fw-bold">
                    {currentStep === 1 && 'Datos del Cliente'}
                    {currentStep === 2 && 'Datos del Vehículo'}
                    {currentStep === 3 && 'Marcado de Daños'}
                    {currentStep === 4 && 'Firmas Digitales'}
                    {currentStep === 5 && 'Resumen y Confirmación'}
                  </h6>
                  <span className="text-muted fw-semibold">Paso {currentStep} de {totalSteps}</span>
                </div>
                <ProgressBar 
                  now={progressPercentage} 
                  variant="primary"
                  style={{height: '10px'}}
                  className="rounded"
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Form Content */}
        <Row>
          <Col>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                  <Button 
                    variant="outline-secondary" 
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    size="lg"
                    className="px-4"
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Anterior
                  </Button>
                  
                  <Button 
                    variant="danger" 
                    onClick={nextStep}
                    disabled={currentStep === totalSteps}
                    size="lg"
                    className="px-4"
                  >
                    {currentStep === totalSteps ? (
                      <>
                        <i className="fas fa-check me-2"></i>
                        Finalizar
                      </>
                    ) : (
                      <>
                        Siguiente
                        <i className="fas fa-arrow-right ms-2"></i>
                      </>
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NuevaOrden;