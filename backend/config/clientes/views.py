from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Cliente
from .serializers import ClienteSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    
    @action(detail=False, methods=['get'])
    def buscar(self, request):
        """
        Buscar clientes por RUT, nombre o teléfono
        """
        query = request.query_params.get('q', '')
        
        if not query:
            return Response({'error': 'Parámetro de búsqueda requerido'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Buscar en múltiples campos
        clientes = Cliente.objects.filter(
            Q(rut__icontains=query) |
            Q(nombre__icontains=query) |
            Q(telefono__icontains=query)
        )
        
        serializer = self.get_serializer(clientes, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def por_rut(self, request):
        """
        Buscar cliente específico por RUT
        """
        rut = request.query_params.get('rut', '')
        
        if not rut:
            return Response({'error': 'RUT requerido'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            cliente = Cliente.objects.get(rut=rut)
            serializer = self.get_serializer(cliente)
            return Response(serializer.data)
        except Cliente.DoesNotExist:
            return Response({'error': 'Cliente no encontrado'}, 
                          status=status.HTTP_404_NOT_FOUND)
