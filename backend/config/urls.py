"""URL configuration for e-commerce project."""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

def setup_admin(request):
    User = get_user_model()
    if User.objects.filter(is_superuser=True).exists():
        return JsonResponse({'error': 'Superuser already exists'}, status=400)
    email = 'admin@dharshaa.com'
    password = 'Admin@123'
    User.objects.create_superuser(email=email, username='admin', password=password)
    return JsonResponse({'message': 'Superuser created', 'email': email, 'password': password})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/setup-admin/', setup_admin, name='setup-admin'),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # API endpoints
    path('api/users/', include('apps.users.urls')),
    path('api/products/', include('apps.products.urls')),
    path('api/cart/', include('apps.cart.urls')),
    path('api/orders/', include('apps.orders.urls')),
    path('api/payments/', include('apps.payments.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
