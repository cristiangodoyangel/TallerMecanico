from rest_framework import serializers
from .models import Cliente

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'
        
    def validate_rut(self, value):
        """
        Validar formato de RUT chileno
        """
        if not value:
            return value
            
        # Remover puntos y guiones
        rut_clean = value.replace('.', '').replace('-', '')
        
        # Verificar que tenga al menos 8 caracteres (7 números + dígito verificador)
        if len(rut_clean) < 8:
            raise serializers.ValidationError("RUT debe tener al menos 8 caracteres")
            
        # Verificar que los primeros caracteres sean números
        rut_numbers = rut_clean[:-1]
        if not rut_numbers.isdigit():
            raise serializers.ValidationError("RUT debe contener solo números antes del dígito verificador")
            
        return value.upper()  # Convertir a mayúsculas