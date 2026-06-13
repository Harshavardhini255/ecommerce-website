from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Order, OrderItem, OrderStatusHistory
from apps.cart.models import Cart
from .serializers import (
    OrderSerializer,
    OrderListSerializer,
    CreateOrderSerializer,
    OrderStatusHistorySerializer
)


class OrderViewSet(viewsets.ModelViewSet):
    """API endpoint for orders."""
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=user)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return OrderListSerializer
        elif self.action == 'create':
            return CreateOrderSerializer
        return OrderSerializer
    
    @transaction.atomic
    def create(self, request):
        """Create order from cart."""
        serializer = CreateOrderSerializer(data=request.data)
        if serializer.is_valid():
            # Get user's cart
            cart = get_object_or_404(Cart, user=request.user)
            
            if not cart.items.exists():
                return Response(
                    {'error': 'Cart is empty'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check stock for all items
            for cart_item in cart.items.all():
                if cart_item.product.stock_quantity < cart_item.quantity:
                    return Response(
                        {'error': f'Insufficient stock for {cart_item.product.name}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Create order
            order_data = serializer.validated_data
            
            # Handle billing address
            if order_data.get('billing_same_as_shipping', True):
                order_data['billing_full_name'] = order_data['shipping_full_name']
                order_data['billing_phone'] = order_data['shipping_phone']
                order_data['billing_address_line1'] = order_data['shipping_address_line1']
                order_data['billing_address_line2'] = order_data.get('shipping_address_line2', '')
                order_data['billing_city'] = order_data['shipping_city']
                order_data['billing_state'] = order_data['shipping_state']
                order_data['billing_postal_code'] = order_data['shipping_postal_code']
                order_data['billing_country'] = order_data['shipping_country']
            
            order_data.pop('billing_same_as_shipping', None)
            
            # Calculate totals
            subtotal = cart.subtotal
            shipping_cost = 10.00  # Fixed shipping for now
            tax = subtotal * 0.1  # 10% tax
            total = subtotal + shipping_cost + tax
            
            order = Order.objects.create(
                user=request.user,
                subtotal=subtotal,
                shipping_cost=shipping_cost,
                tax=tax,
                total=total,
                **order_data
            )
            
            # Create order items and update stock
            for cart_item in cart.items.all():
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    product_name=cart_item.product.name,
                    product_sku=cart_item.product.sku,
                    product_price=cart_item.product.price,
                    quantity=cart_item.quantity
                )
                
                # Update product stock
                cart_item.product.stock_quantity -= cart_item.quantity
                cart_item.product.save()
            
            # Create initial status history
            OrderStatusHistory.objects.create(
                order=order,
                status='pending',
                notes='Order created',
                created_by=request.user
            )
            
            # Clear cart
            cart.items.all().delete()
            
            return Response(
                OrderSerializer(order).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an order."""
        order = self.get_object()
        
        if order.status in ['delivered', 'cancelled', 'refunded']:
            return Response(
                {'error': 'Cannot cancel this order'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Restore stock
        for item in order.items.all():
            if item.product:
                item.product.stock_quantity += item.quantity
                item.product.save()
        
        order.status = 'cancelled'
        order.save()
        
        OrderStatusHistory.objects.create(
            order=order,
            status='cancelled',
            notes=request.data.get('notes', 'Order cancelled by customer'),
            created_by=request.user
        )
        
        return Response({'status': 'Order cancelled'})
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update order status (admin only)."""
        if not request.user.is_staff:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        order = self.get_object()
        new_status = request.data.get('status')
        notes = request.data.get('notes', '')
        
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        
        # Update tracking info if provided
        if 'tracking_number' in request.data:
            order.tracking_number = request.data['tracking_number']
        if 'carrier' in request.data:
            order.carrier = request.data['carrier']
        
        order.save()
        
        OrderStatusHistory.objects.create(
            order=order,
            status=new_status,
            notes=notes,
            created_by=request.user
        )
        
        return Response(OrderSerializer(order).data)
