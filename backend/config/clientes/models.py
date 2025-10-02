from django.db import models
from django.core.validators import RegexValidator

class Cliente(models.Model):
    # Información básica
    nombre_completo = models.CharField(max_length=200, verbose_name="Nombre Completo")
    rut = models.CharField(
        max_length=12, 
        unique=True,
        validators=[RegexValidator(
            regex=r'^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$',
            message='Formato de RUT inválido. Use: 12.345.678-9'
        )],
        verbose_name="RUT"
    )
    
    # Contacto
    telefono = models.CharField(
        max_length=15,
        validators=[RegexValidator(
            regex=r'^\+?56\d{8,9}$',
            message='Formato de teléfono inválido. Use: +56912345678'
        )],
        verbose_name="Teléfono"
    )
    email = models.EmailField(blank=True, null=True, verbose_name="Correo Electrónico")
    contacto_adicional = models.CharField(max_length=200, blank=True, null=True, verbose_name="Contacto Adicional")
    
    # Dirección
    direccion = models.CharField(max_length=300, verbose_name="Dirección")
    comuna = models.CharField(max_length=100, verbose_name="Comuna")
    
    # Metadatos
    fecha_registro = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Última Actualización")
    activo = models.BooleanField(default=True, verbose_name="Activo")
    
    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"
        ordering = ['nombre_completo']
    
    def __str__(self):
        return f"{self.nombre_completo} - {self.rut}"
    
    def clean(self):
        # Validar dígito verificador del RUT
        from django.core.exceptions import ValidationError
        import re
        
        if self.rut:
            # Limpiar formato
            rut_clean = re.sub(r'[^\dkK]', '', self.rut)
            if len(rut_clean) < 2:
                raise ValidationError({'rut': 'RUT inválido'})
            
            # Separar número y dígito verificador
            numero = rut_clean[:-1]
            dv = rut_clean[-1].upper()
            
            # Calcular dígito verificador
            suma = 0
            multiplo = 2
            for i in reversed(numero):
                suma += int(i) * multiplo
                multiplo += 1
                if multiplo == 8:
                    multiplo = 2
            
            resto = suma % 11
            dv_calculado = 'K' if resto == 1 else ('0' if resto == 0 else str(11 - resto))
            
            if dv != dv_calculado:
                raise ValidationError({'rut': 'RUT inválido - dígito verificador incorrecto'})
