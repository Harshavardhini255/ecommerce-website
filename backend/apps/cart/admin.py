from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ('total_price',)


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    """Admin interface for Cart model."""
    
    list_display = ('user', 'total_items', 'subtotal', 'created_at', 'updated_at')
    search_fields = ('user__email',)
    readonly_fields = ('total_items', 'subtotal', 'total', 'created_at', 'updated_at')
    inlines = [CartItemInline]


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    """Admin interface for CartItem model."""
    
    list_display = ('cart', 'product', 'quantity', 'total_price', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('cart__user__email', 'product__name')
    readonly_fields = ('total_price', 'created_at', 'updated_at')
