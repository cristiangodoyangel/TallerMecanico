from django.db import models
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator
from clientes.models import Cliente

class Vehiculo(models.Model):
    TIPO_VEHICULO_CHOICES = [
        ('auto', 'Automóvil'),
        ('camioneta', 'Camioneta'),
        ('suv', 'SUV'),
        ('pickup', 'Pickup'),
        ('van', 'Van'),
        ('camion', 'Camión'),
        ('moto', 'Motocicleta'),
        ('otro', 'Otro'),
    ]
    
    COMBUSTIBLE_CHOICES = [
        ('gasolina', 'Gasolina'),
        ('diesel', 'Diésel'),
        ('gas', 'Gas'),
        ('electrico', 'Eléctrico'),
        ('hibrido', 'Híbrido'),
    ]
    
    COLOR_CHOICES = [
        ('blanco', 'Blanco'),
        ('negro', 'Negro'),
        ('gris', 'Gris'),
        ('plata', 'Plata'),
        ('rojo', 'Rojo'),
        ('azul', 'Azul'),
        ('verde', 'Verde'),
        ('amarillo', 'Amarillo'),
        ('cafe', 'Café'),
        ('otro', 'Otro'),
    ]
    
    # Relación con cliente
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='vehiculos')
    
    # Información del vehículo
    marca = models.CharField(max_length=50, verbose_name="Marca")
    modelo = models.CharField(max_length=50, verbose_name="Modelo")
    año = models.IntegerField(
        validators=[
            MinValueValidator(1900),
            MaxValueValidator(2030)
        ],
        verbose_name="Año"
    )
    
    # Identificación
    patente = models.CharField(
        max_length=8,
        unique=True,
        validators=[RegexValidator(
            regex=r'^[A-Z]{2}\d{4}$|^[A-Z]{4}\d{2}$',
            message='Formato de patente inválido. Use: AB1234 o ABCD12'
        )],
        verbose_name="Patente"
    )
    
    # Características
    color = models.CharField(max_length=20, choices=COLOR_CHOICES, verbose_name="Color")
    tipo_vehiculo = models.CharField(max_length=20, choices=TIPO_VEHICULO_CHOICES, verbose_name="Tipo de Vehículo")
    combustible = models.CharField(max_length=20, choices=COMBUSTIBLE_CHOICES, verbose_name="Combustible")
    
    # Especificaciones técnicas
    kilometraje = models.PositiveIntegerField(verbose_name="Kilometraje", help_text="Kilometraje actual del vehículo")
    numero_motor = models.CharField(max_length=50, blank=True, null=True, verbose_name="Número de Motor")
    numero_chasis = models.CharField(max_length=50, blank=True, null=True, verbose_name="Número de Chasis")
    cilindrada = models.CharField(max_length=20, blank=True, null=True, verbose_name="Cilindrada")
    
    # Metadatos
    fecha_registro = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Última Actualización")
    activo = models.BooleanField(default=True, verbose_name="Activo")
    
    # Observaciones
    observaciones = models.TextField(blank=True, null=True, verbose_name="Observaciones")
    
    class Meta:
        verbose_name = "Vehículo"
        verbose_name_plural = "Vehículos"
        ordering = ['marca', 'modelo', 'año']
    
    def __str__(self):
        return f"{self.marca} {self.modelo} {self.año} - {self.patente}"
    
    def get_nombre_completo(self):
        return f"{self.marca} {self.modelo} {self.año}"
    
    def clean(self):
        from django.core.exceptions import ValidationError
        
        # Validar que la patente esté en mayúsculas
        if self.patente:
            self.patente = self.patente.upper()
