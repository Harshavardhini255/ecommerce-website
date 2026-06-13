from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.conf import settings
import stripe

from .models import Payment, Refund
from apps.orders.models import Order
from .serializers import (
    PaymentSerializer,
    CreatePaymentIntentSerializer,
    ConfirmPaymentSerializer,
    RefundSerializer,
    CreateRefundSerializer
)

stripe.api_key = settings.STRIPE_SECRET_KEY


class PaymentViewSet(viewsets.ModelViewSet):
    """API endpoint for payments."""
    
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Payment.objects.all()
        return Payment.objects.filter(user=user)
    
    @action(detail=False, methods=['post'])
    def create_payment_intent(self, request):
        """Create Stripe payment intent."""
        serializer = CreatePaymentIntentSerializer(data=request.data)
        if serializer.is_valid():
            order_id = serializer.validated_data['order_id']
            order = get_object_or_404(Order, id=order_id, user=request.user)
            
            if order.payment_status == 'paid':
                return Response(
                    {'error': 'Order already paid'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                # Create Stripe payment intent
                intent = stripe.PaymentIntent.create(
                    amount=int(order.total * 100),  # Convert to cents
                    currency='usd',
                    metadata={
                        'order_id': order.id,
                        'order_number': order.order_number,
                    },
                    automatic_payment_methods={'enabled': True},
                )
                
                # Create payment record
                payment = Payment.objects.create(
                    order=order,
                    user=request.user,
                    payment_method='stripe',
                    amount=order.total,
                    currency='USD',
                    stripe_payment_intent_id=intent.id,
                    status='pending'
                )
                
                return Response({
                    'client_secret': intent.client_secret,
                    'payment_id': payment.id,
                    'publishable_key': settings.STRIPE_PUBLISHABLE_KEY
                })
            
            except stripe.error.StripeError as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def confirm_payment(self, request):
        """Confirm payment after successful Stripe payment."""
        serializer = ConfirmPaymentSerializer(data=request.data)
        if serializer.is_valid():
            payment_intent_id = serializer.validated_data['payment_intent_id']
            
            try:
                # Retrieve payment intent from Stripe
                intent = stripe.PaymentIntent.retrieve(payment_intent_id)
                
                # Get payment record
                payment = get_object_or_404(
                    Payment,
                    stripe_payment_intent_id=payment_intent_id,
                    user=request.user
                )
                
                if intent.status == 'succeeded':
                    payment.status = 'succeeded'
                    payment.stripe_charge_id = intent.charges.data[0].id if intent.charges.data else ''
                    payment.save()
                    
                    # Update order payment status
                    order = payment.order
                    order.payment_status = 'paid'
                    order.status = 'processing'
                    order.save()
                    
                    return Response({
                        'status': 'Payment confirmed',
                        'order_number': order.order_number
                    })
                else:
                    payment.status = 'failed'
                    payment.error_message = f"Payment intent status: {intent.status}"
                    payment.save()
                    
                    return Response(
                        {'error': 'Payment not successful'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            except stripe.error.StripeError as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='webhook')
    def stripe_webhook(self, request):
        """Handle Stripe webhooks."""
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        # Handle the event
        if event.type == 'payment_intent.succeeded':
            payment_intent = event.data.object
            # Update payment status
            try:
                payment = Payment.objects.get(
                    stripe_payment_intent_id=payment_intent.id
                )
                payment.status = 'succeeded'
                payment.save()
                
                order = payment.order
                order.payment_status = 'paid'
                order.status = 'processing'
                order.save()
            except Payment.DoesNotExist:
                pass
        
        elif event.type == 'payment_intent.payment_failed':
            payment_intent = event.data.object
            try:
                payment = Payment.objects.get(
                    stripe_payment_intent_id=payment_intent.id
                )
                payment.status = 'failed'
                payment.error_message = payment_intent.last_payment_error.message if payment_intent.last_payment_error else ''
                payment.save()
            except Payment.DoesNotExist:
                pass
        
        return Response({'status': 'success'})


class RefundViewSet(viewsets.ModelViewSet):
    """API endpoint for refunds."""
    
    permission_classes = [IsAuthenticated]
    serializer_class = RefundSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Refund.objects.all()
        return Refund.objects.filter(order__user=user)
    
    def create(self, request):
        """Create refund (admin only)."""
        if not request.user.is_staff:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = CreateRefundSerializer(data=request.data)
        if serializer.is_valid():
            payment_id = serializer.validated_data['payment_id']
            amount = serializer.validated_data['amount']
            reason = serializer.validated_data['reason']
            
            payment = get_object_or_404(Payment, id=payment_id)
            
            if payment.status != 'succeeded':
                return Response(
                    {'error': 'Can only refund successful payments'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                # Create Stripe refund
                refund = stripe.Refund.create(
                    payment_intent=payment.stripe_payment_intent_id,
                    amount=int(amount * 100),  # Convert to cents
                )
                
                # Create refund record
                refund_obj = Refund.objects.create(
                    payment=payment,
                    order=payment.order,
                    amount=amount,
                    reason=reason,
                    status='succeeded',
                    stripe_refund_id=refund.id,
                    created_by=request.user
                )
                
                # Update payment and order status
                payment.status = 'refunded'
                payment.save()
                
                order = payment.order
                order.payment_status = 'refunded'
                order.status = 'refunded'
                order.save()
                
                return Response(
                    RefundSerializer(refund_obj).data,
                    status=status.HTTP_201_CREATED
                )
            
            except stripe.error.StripeError as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
