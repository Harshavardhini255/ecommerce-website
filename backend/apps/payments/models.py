from django.db import models
from django.contrib.auth import get_user_model
from apps.orders.models import Order

User = get_user_model()


class Payment(models.Model):
    """Payment model."""
    
    PAYMENT_METHOD_CHOICES = (
        ('stripe', 'Stripe'),
        ('paypal', 'PayPal'),
        ('cash', 'Cash on Delivery'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('succeeded', 'Succeeded'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    )
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='INR')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Stripe specific fields
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True)
    stripe_charge_id = models.CharField(max_length=255, blank=True)
    stripe_customer_id = models.CharField(max_length=255, blank=True)
    
    # PayPal specific fields
    paypal_order_id = models.CharField(max_length=255, blank=True)
    paypal_payer_id = models.CharField(max_length=255, blank=True)
    
    error_message = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'
    
    def __str__(self):
        return f"Payment for Order {self.order.order_number} - {self.status}"


class Refund(models.Model):
    """Refund model."""
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('succeeded', 'Succeeded'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    )
    
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='refunds')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='refunds')
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    stripe_refund_id = models.CharField(max_length=255, blank=True)
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Refund'
        verbose_name_plural = 'Refunds'
    
    def __str__(self):
        return f"Refund for Order {self.order.order_number} - {self.amount}"
