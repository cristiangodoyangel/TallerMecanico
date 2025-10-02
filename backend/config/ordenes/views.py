from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from .models import OrdenTrabajo
from .serializers import OrdenTrabajoSerializer, OrdenTrabajoCreateSerializer

class OrdenTrabajoViewSet(viewsets.ModelViewSet):
    queryset = OrdenTrabajo.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrdenTrabajoCreateSerializer
        return OrdenTrabajoSerializer
    
    def get_queryset(self):
        return OrdenTrabajo.objects.select_related('cliente', 'vehiculo').order_by('-fecha_ingreso')
    
    @action(detail=False, methods=['get'])
    def buscar(self, request):
        """
        Buscar órdenes por número, cliente o vehículo
        """
        query = request.query_params.get('q', '')
        
        if not query:
            return Response({'error': 'Parámetro de búsqueda requerido'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Buscar en múltiples campos relacionados
        ordenes = OrdenTrabajo.objects.filter(
            Q(numero_orden__icontains=query) |
            Q(cliente__nombre__icontains=query) |
            Q(cliente__rut__icontains=query) |
            Q(vehiculo__patente__icontains=query) |
            Q(vehiculo__marca__icontains=query)
        ).select_related('cliente', 'vehiculo')
        
        serializer = self.get_serializer(ordenes, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def por_estado(self, request):
        """
        Filtrar órdenes por estado
        """
        estado = request.query_params.get('estado', '')
        
        if not estado:
            return Response({'error': 'Estado requerido'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        ordenes = OrdenTrabajo.objects.filter(estado=estado).select_related('cliente', 'vehiculo')
        serializer = self.get_serializer(ordenes, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def atrasadas(self, request):
        """
        Obtener órdenes atrasadas (fecha prometida pasada y estado no es 'entregado')
        """
        hoy = timezone.now().date()
        ordenes = OrdenTrabajo.objects.filter(
            fecha_prometida__lt=hoy,
            estado__in=['ingresado', 'en_proceso', 'esperando_repuestos', 'listo']
        ).select_related('cliente', 'vehiculo')
        
        serializer = self.get_serializer(ordenes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        """
        Cambiar el estado de una orden
        """
        orden = self.get_object()
        nuevo_estado = request.data.get('estado')
        
        # Validar que el estado sea válido
        estados_validos = [choice[0] for choice in OrdenTrabajo.ESTADOS_ORDEN]
        if nuevo_estado not in estados_validos:
            return Response({'error': 'Estado no válido'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        orden.estado = nuevo_estado
        orden.save()
        
        serializer = self.get_serializer(orden)
        return Response(serializer.data)
