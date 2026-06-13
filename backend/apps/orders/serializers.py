from rest_framework import serializers
from .models import Order, OrderItem, OrderStatusHistory
from apps.products.serializers import ProductListSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for order items."""
    
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = OrderItem
        fields = (
            'id', 'product', 'product_name', 'product_sku',
            'product_price', 'quantity', 'total_price', 'created_at'
        )
        read_only_fields = ('id', 'created_at')


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    """Serializer for order status history."""
    
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    
    class Meta:
        model = OrderStatusHistory
        fields = ('id', 'status', 'notes', 'created_by', 'created_by_name', 'created_at')
        read_only_fields = ('id', 'created_by', 'created_at')


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for orders."""
    
    items = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = (
            'id', 'order_number', 'user', 'status', 'payment_status', 'payment_method',
            'shipping_full_name', 'shipping_phone', 'shipping_address_line1',
            'shipping_address_line2', 'shipping_city', 'shipping_state',
            'shipping_postal_code', 'shipping_country',
            'billing_full_name', 'billing_phone', 'billing_address_line1',
            'billing_address_line2', 'billing_city', 'billing_state',
            'billing_postal_code', 'billing_country',
            'subtotal', 'shipping_cost', 'tax', 'discount', 'total',
            'notes', 'tracking_number', 'carrier',
            'items', 'status_history', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'order_number', 'user', 'created_at', 'updated_at')


class OrderListSerializer(serializers.ModelSerializer):
    """Serializer for order list view."""
    
    items_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = (
            'id', 'order_number', 'status', 'payment_status',
            'total', 'items_count', 'created_at'
        )
    
    def get_items_count(self, obj):
        return obj.items.count()


class CreateOrderSerializer(serializers.Serializer):
    """Serializer for creating orders."""
    
    shipping_full_name = serializers.CharField(max_length=255)
    shipping_phone = serializers.CharField(max_length=20)
    shipping_address_line1 = serializers.CharField(max_length=255)
    shipping_address_line2 = serializers.CharField(max_length=255, required=False, allow_blank=True)
    shipping_city = serializers.CharField(max_length=100)
    shipping_state = serializers.CharField(max_length=100)
    shipping_postal_code = serializers.CharField(max_length=20)
    shipping_country = serializers.CharField(max_length=100)
    
    billing_same_as_shipping = serializers.BooleanField(default=True)
    billing_full_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    billing_phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    billing_address_line1 = serializers.CharField(max_length=255, required=False, allow_blank=True)
    billing_address_line2 = serializers.CharField(max_length=255, required=False, allow_blank=True)
    billing_city = serializers.CharField(max_length=100, required=False, allow_blank=True)
    billing_state = serializers.CharField(max_length=100, required=False, allow_blank=True)
    billing_postal_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    billing_country = serializers.CharField(max_length=100, required=False, allow_blank=True)
    
    payment_method = serializers.CharField(max_length=50)
    notes = serializers.CharField(required=False, allow_blank=True)
