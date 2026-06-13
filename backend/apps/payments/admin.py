from django.contrib import admin
from .models import Payment, Refund


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Admin interface for Payment model."""
    
    list_display = (
        'order', 'user', 'payment_method', 'amount',
        'currency', 'status', 'created_at'
    )
    list_filter = ('payment_method', 'status', 'created_at')
    search_fields = (
        'order__order_number', 'user__email',
        'stripe_payment_intent_id', 'stripe_charge_id'
    )
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Payment Information', {
            'fields': ('order', 'user', 'payment_method', 'amount', 'currency', 'status')
        }),
        ('Stripe Details', {
            'fields': ('stripe_payment_intent_id', 'stripe_charge_id', 'stripe_customer_id')
        }),
        ('PayPal Details', {
            'fields': ('paypal_order_id', 'paypal_payer_id')
        }),
        ('Additional Information', {
            'fields': ('error_message', 'metadata', 'created_at', 'updated_at')
        }),
    )


@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    """Admin interface for Refund model."""
    
    list_display = ('order', 'payment', 'amount', 'status', 'created_by', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('order__order_number', 'reason', 'stripe_refund_id')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
