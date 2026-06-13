from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Address


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin interface for User model."""
    
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_staff', 'created_at')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'created_at')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone', 'avatar')}),
        ('Address', {'fields': ('address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'last_login', 'date_joined')


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    """Admin interface for Address model."""
    
    list_display = ('user', 'full_name', 'address_type', 'city', 'country', 'is_default', 'created_at')
    list_filter = ('address_type', 'is_default', 'country', 'created_at')
    search_fields = ('user__email', 'full_name', 'city', 'postal_code')
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {'fields': ('user', 'address_type', 'is_default')}),
        ('Contact', {'fields': ('full_name', 'phone')}),
        ('Address', {'fields': ('address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country')}),
    )
