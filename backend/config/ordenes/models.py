from django.db import models
from django.core.validators import MinValueValidator
from clientes.models import Cliente
from vehiculos.models import Vehiculo
import uuid

class OrdenTrabajo(models.Model):
    ESTADO_CHOICES = [
        ('ingresado', 'Ingresado'),
        ('en_proceso', 'En Proceso'),
        ('esperando_repuestos', 'Esperando Repuestos'),
        ('listo', 'Listo'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
    ]
    
    PRIORIDAD_CHOICES = [
        ('baja', 'Baja'),
        ('normal', 'Normal'),
        ('alta', 'Alta'),
        ('urgente', 'Urgente'),
    ]
    
    # Identificación única
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    numero_orden = models.CharField(max_length=10, unique=True, verbose_name="Número de Orden")
    
    # Relaciones
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='ordenes')
    vehiculo = models.ForeignKey(Vehiculo, on_delete=models.CASCADE, related_name='ordenes')
    
    # Fechas
    fecha_ingreso = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Ingreso")
    fecha_prometida = models.DateField(verbose_name="Fecha Prometida de Entrega")
    fecha_entrega_real = models.DateTimeField(blank=True, null=True, verbose_name="Fecha Real de Entrega")
    
    # Estado y prioridad
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='ingresado', verbose_name="Estado")
    prioridad = models.CharField(max_length=10, choices=PRIORIDAD_CHOICES, default='normal', verbose_name="Prioridad")
    
    # Descripción del trabajo
    descripcion_trabajo = models.TextField(verbose_name="Descripción del Trabajo Solicitado")
    observaciones_cliente = models.TextField(blank=True, null=True, verbose_name="Observaciones del Cliente")
    observaciones_tecnico = models.TextField(blank=True, null=True, verbose_name="Observaciones del Técnico")
    trabajos_realizados = models.TextField(blank=True, null=True, verbose_name="Trabajos Realizados")
    
    # Información financiera
    precio_mano_obra = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)],
        verbose_name="Precio Mano de Obra"
    )
    precio_repuestos = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)],
        verbose_name="Precio Repuestos"
    )
    precio_total = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)],
        verbose_name="Precio Total"
    )
    
    # Imágenes y firmas (almacenadas como base64)
    imagen_danos = models.TextField(blank=True, null=True, verbose_name="Imagen con Daños Marcados")
    firma_cliente = models.TextField(blank=True, null=True, verbose_name="Firma del Cliente")
    firma_tecnico = models.TextField(blank=True, null=True, verbose_name="Firma del Técnico")
    
    # Personal responsable
    recepcionista = models.CharField(max_length=100, verbose_name="Recepcionista")
    tecnico_asignado = models.CharField(max_length=100, blank=True, null=True, verbose_name="Técnico Asignado")
    
    # Metadatos
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Creación")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Última Actualización")
    
    class Meta:
        verbose_name = "Orden de Trabajo"
        verbose_name_plural = "Órdenes de Trabajo"
        ordering = ['-fecha_ingreso']
    
    def __str__(self):
        return f"Orden #{self.numero_orden} - {self.cliente.nombre_completo}"
    
    def save(self, *args, **kwargs):
        # Generar número de orden automáticamente
        if not self.numero_orden:
            # Obtener el último número de orden
            ultima_orden = OrdenTrabajo.objects.filter(
                numero_orden__startswith='OT'
            ).order_by('-numero_orden').first()
            
            if ultima_orden:
                # Extraer el número y sumar 1
                ultimo_numero = int(ultima_orden.numero_orden[2:])
                nuevo_numero = ultimo_numero + 1
            else:
                nuevo_numero = 1
            
            self.numero_orden = f"OT{nuevo_numero:05d}"  # Formato: OT00001
        
        # Calcular precio total
        self.precio_total = self.precio_mano_obra + self.precio_repuestos
        
        super().save(*args, **kwargs)
    
    def get_estado_display_class(self):
        """Retorna la clase CSS para el estado"""
        estado_classes = {
            'ingresado': 'badge-primary',
            'en_proceso': 'badge-warning',
            'esperando_repuestos': 'badge-info',
            'listo': 'badge-success',
            'entregado': 'badge-secondary',
            'cancelado': 'badge-danger',
        }
        return estado_classes.get(self.estado, 'badge-secondary')
    
    def is_atrasado(self):
        """Verifica si la orden está atrasada"""
        from datetime import date
        return (self.estado not in ['entregado', 'cancelado'] and 
                self.fecha_prometida < date.today())
    
    def dias_en_taller(self):
        """Calcula los días que lleva en el taller"""
        from datetime import date
        return (date.today() - self.fecha_ingreso.date()).days
