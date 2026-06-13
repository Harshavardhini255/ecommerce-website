from rest_framework import serializers
from .models import Payment, Refund


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for payments."""
    
    class Meta:
        model = Payment
        fields = (
            'id', 'order', 'user', 'payment_method', 'amount', 'currency',
            'status', 'stripe_payment_intent_id', 'error_message',
            'created_at', 'updated_at'
        )
        read_only_fields = (
            'id', 'user', 'stripe_payment_intent_id', 'status',
            'error_message', 'created_at', 'updated_at'
        )


class CreatePaymentIntentSerializer(serializers.Serializer):
    """Serializer for creating Stripe payment intent."""
    
    order_id = serializers.IntegerField()


class ConfirmPaymentSerializer(serializers.Serializer):
    """Serializer for confirming payment."""
    
    payment_intent_id = serializers.CharField()


class RefundSerializer(serializers.ModelSerializer):
    """Serializer for refunds."""
    
    class Meta:
        model = Refund
        fields = (
            'id', 'payment', 'order', 'amount', 'reason', 'status',
            'created_by', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_by', 'status', 'created_at', 'updated_at')


class CreateRefundSerializer(serializers.Serializer):
    """Serializer for creating refund."""
    
    payment_id = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    reason = serializers.CharField()
