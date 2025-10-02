// Configuración base para las llamadas a la API
const API_BASE_URL = 'http://localhost:8000/api';

// Configuración de Axios
const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// Función helper para manejar errores
const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    // El servidor respondió con un código de error
    throw new Error(error.response.data.message || 'Error en el servidor');
  } else if (error.request) {
    // La request fue hecha pero no hubo respuesta
    throw new Error('No se pudo conectar con el servidor');
  } else {
    // Algo más causó el error
    throw new Error('Error inesperado');
  }
};

// Función helper para hacer requests
const makeRequest = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...apiConfig,
      ...options,
      headers: {
        ...apiConfig.headers,
        ...options.headers,
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// API para Clientes
export const clientesAPI = {
  // Obtener todos los clientes
  getAll: () => makeRequest('/clientes/'),
  
  // Obtener cliente por ID
  getById: (id) => makeRequest(`/clientes/${id}/`),
  
  // Buscar cliente por RUT
  buscarPorRut: (rut) => makeRequest(`/clientes/buscar/?rut=${rut}`),
  
  // Crear nuevo cliente
  create: (clienteData) => makeRequest('/clientes/', {
    method: 'POST',
    body: JSON.stringify(clienteData),
  }),
  
  // Actualizar cliente
  update: (id, clienteData) => makeRequest(`/clientes/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(clienteData),
  }),
  
  // Eliminar cliente
  delete: (id) => makeRequest(`/clientes/${id}/`, {
    method: 'DELETE',
  }),
};

// API para Vehículos
export const vehiculosAPI = {
  // Obtener todos los vehículos
  getAll: () => makeRequest('/vehiculos/'),
  
  // Obtener vehículo por ID
  getById: (id) => makeRequest(`/vehiculos/${id}/`),
  
  // Buscar vehículo por patente
  buscarPorPatente: (patente) => makeRequest(`/vehiculos/buscar/?patente=${patente}`),
  
  // Obtener vehículos de un cliente
  getByCliente: (clienteId) => makeRequest(`/vehiculos/?cliente=${clienteId}`),
  
  // Crear nuevo vehículo
  create: (vehiculoData) => makeRequest('/vehiculos/', {
    method: 'POST',
    body: JSON.stringify(vehiculoData),
  }),
  
  // Actualizar vehículo
  update: (id, vehiculoData) => makeRequest(`/vehiculos/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(vehiculoData),
  }),
  
  // Eliminar vehículo
  delete: (id) => makeRequest(`/vehiculos/${id}/`, {
    method: 'DELETE',
  }),
};

// API para Órdenes de Trabajo
export const ordenesAPI = {
  // Obtener todas las órdenes
  getAll: () => makeRequest('/ordenes/'),
  
  // Obtener orden por ID
  getById: (id) => makeRequest(`/ordenes/${id}/`),
  
  // Obtener orden por número
  getByNumero: (numero) => makeRequest(`/ordenes/buscar/?numero=${numero}`),
  
  // Crear nueva orden
  create: (ordenData) => makeRequest('/ordenes/', {
    method: 'POST',
    body: JSON.stringify(ordenData),
  }),
  
  // Actualizar orden
  update: (id, ordenData) => makeRequest(`/ordenes/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(ordenData),
  }),
  
  // Actualizar estado de orden
  updateEstado: (id, estado) => makeRequest(`/ordenes/${id}/estado/`, {
    method: 'PATCH',
    body: JSON.stringify({ estado }),
  }),
  
  // Eliminar orden
  delete: (id) => makeRequest(`/ordenes/${id}/`, {
    method: 'DELETE',
  }),
  
  // Generar PDF
  generatePDF: (id) => makeRequest(`/ordenes/${id}/pdf/`),
  
  // Enviar por email
  sendEmail: (id, email) => makeRequest(`/ordenes/${id}/email/`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
};

// API para búsquedas generales
export const busquedaAPI = {
  // Búsqueda general por término
  buscarGeneral: (termino) => makeRequest(`/buscar/?q=${encodeURIComponent(termino)}`),
  
  // Búsqueda por RUT
  buscarPorRut: (rut) => makeRequest(`/buscar/rut/?rut=${rut}`),
  
  // Búsqueda por patente
  buscarPorPatente: (patente) => makeRequest(`/buscar/patente/?patente=${patente}`),
  
  // Búsqueda por nombre
  buscarPorNombre: (nombre) => makeRequest(`/buscar/nombre/?nombre=${encodeURIComponent(nombre)}`),
};

// Función helper para crear una orden completa (cliente + vehículo + orden)
export const crearOrdenCompleta = async (datosCompletos) => {
  try {
    // 1. Buscar o crear cliente
    let cliente;
    try {
      cliente = await clientesAPI.buscarPorRut(datosCompletos.cliente.rut);
    } catch (error) {
      // Si no existe, crear nuevo cliente
      cliente = await clientesAPI.create(datosCompletos.cliente);
    }
    
    // 2. Buscar o crear vehículo
    let vehiculo;
    try {
      vehiculo = await vehiculosAPI.buscarPorPatente(datosCompletos.vehiculo.patente);
    } catch (error) {
      // Si no existe, crear nuevo vehículo
      vehiculo = await vehiculosAPI.create({
        ...datosCompletos.vehiculo,
        cliente: cliente.id
      });
    }
    
    // 3. Crear orden de trabajo
    const orden = await ordenesAPI.create({
      ...datosCompletos.orden,
      cliente: cliente.id,
      vehiculo: vehiculo.id
    });
    
    return {
      cliente,
      vehiculo,
      orden
    };
  } catch (error) {
    throw new Error(`Error al crear orden completa: ${error.message}`);
  }
};

export default {
  clientesAPI,
  vehiculosAPI,
  ordenesAPI,
  busquedaAPI,
  crearOrdenCompleta
};