from rest_framework import serializers
from .models import OrdenTrabajo
from clientes.serializers import ClienteSerializer
from vehiculos.serializers import VehiculoSerializer

class OrdenTrabajoSerializer(serializers.ModelSerializer):
    cliente_info = ClienteSerializer(source='cliente', read_only=True)
    vehiculo_info = VehiculoSerializer(source='vehiculo', read_only=True)
    
    class Meta:
        model = OrdenTrabajo
        fields = '__all__'
        
    def validate(self, data):
        """
        Validar que la fecha prometida sea posterior a la fecha de ingreso
        """
        fecha_ingreso = data.get('fecha_ingreso')
        fecha_prometida = data.get('fecha_prometida')
        
        if fecha_ingreso and fecha_prometida:
            if fecha_prometida < fecha_ingreso:
                raise serializers.ValidationError(
                    "La fecha prometida debe ser posterior a la fecha de ingreso"
                )
                
        return data

class OrdenTrabajoCreateSerializer(serializers.ModelSerializer):
    """
    Serializer específico para crear órdenes de trabajo
    """
    class Meta:
        model = OrdenTrabajo
        fields = ['cliente', 'vehiculo', 'fecha_prometida', 'observaciones_cliente', 
                 'trabajos_solicitados', 'firma_cliente', 'firma_tecnico', 'imagen_danos']