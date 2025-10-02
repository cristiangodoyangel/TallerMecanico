from rest_framework import serializers
from .models import Vehiculo
from clientes.serializers import ClienteSerializer

class VehiculoSerializer(serializers.ModelSerializer):
    cliente_info = ClienteSerializer(source='cliente', read_only=True)
    
    class Meta:
        model = Vehiculo
        fields = '__all__'
        
    def validate_patente(self, value):
        """
        Validar formato de patente chilena
        """
        if not value:
            return value
            
        # Convertir a mayúsculas y remover espacios
        patente_clean = value.upper().replace(' ', '')
        
        # Verificar formatos válidos
        # Formato antiguo: LLLL00 o Formato nuevo: LL0000
        import re
        
        patron_antiguo = r'^[A-Z]{4}\d{2}$'  # ABCD12
        patron_nuevo = r'^[A-Z]{2}\d{4}$'    # AB1234
        
        if not (re.match(patron_antiguo, patente_clean) or re.match(patron_nuevo, patente_clean)):
            raise serializers.ValidationError(
                "Patente debe tener formato ABCD12 o AB1234"
            )
            
        return patente_clean