from rest_framework import serializers
from .models import Cart, CartItem
from apps.products.serializers import ProductListSerializer


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for cart items."""
    
    product_details = ProductListSerializer(source='product', read_only=True)
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = CartItem
        fields = ('id', 'product', 'product_details', 'quantity', 'total_price', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class CartSerializer(serializers.ModelSerializer):
    """Serializer for shopping cart."""
    
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    subtotal = serializers.ReadOnlyField()
    total = serializers.ReadOnlyField()
    
    class Meta:
        model = Cart
        fields = ('id', 'user', 'items', 'total_items', 'subtotal', 'total', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')


class AddToCartSerializer(serializers.Serializer):
    """Serializer for adding items to cart."""
    
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class UpdateCartItemSerializer(serializers.Serializer):
    """Serializer for updating cart item quantity."""
    
    quantity = serializers.IntegerField(min_value=0)
