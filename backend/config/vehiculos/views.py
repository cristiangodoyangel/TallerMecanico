from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Vehiculo
from .serializers import VehiculoSerializer

class VehiculoViewSet(viewsets.ModelViewSet):
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer
    
    @action(detail=False, methods=['get'])
    def buscar(self, request):
        """
        Buscar vehículos por patente, marca o modelo
        """
        query = request.query_params.get('q', '')
        
        if not query:
            return Response({'error': 'Parámetro de búsqueda requerido'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Buscar en múltiples campos
        vehiculos = Vehiculo.objects.filter(
            Q(patente__icontains=query) |
            Q(marca__icontains=query) |
            Q(modelo__icontains=query)
        ).select_related('cliente')
        
        serializer = self.get_serializer(vehiculos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def por_patente(self, request):
        """
        Buscar vehículo específico por patente
        """
        patente = request.query_params.get('patente', '')
        
        if not patente:
            return Response({'error': 'Patente requerida'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            vehiculo = Vehiculo.objects.select_related('cliente').get(patente=patente)
            serializer = self.get_serializer(vehiculo)
            return Response(serializer.data)
        except Vehiculo.DoesNotExist:
            return Response({'error': 'Vehículo no encontrado'}, 
                          status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def por_cliente(self, request):
        """
        Obtener vehículos de un cliente específico
        """
        cliente_id = request.query_params.get('cliente_id', '')
        
        if not cliente_id:
            return Response({'error': 'ID de cliente requerido'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        vehiculos = Vehiculo.objects.filter(cliente_id=cliente_id)
        serializer = self.get_serializer(vehiculos, many=True)
        return Response(serializer.data)
