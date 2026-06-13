from rest_framework import serializers
from .models import Category, Product, ProductImage, Review


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for category."""
    
    children = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = (
            'id', 'name', 'slug', 'description', 'image',
            'parent', 'children', 'product_count', 'is_active',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'slug', 'created_at', 'updated_at')
    
    def get_children(self, obj):
        if obj.children.exists():
            return CategorySerializer(obj.children.filter(is_active=True), many=True).data
        return []
    
    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for product images."""
    
    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'alt_text', 'is_primary', 'order', 'created_at')
        read_only_fields = ('id', 'created_at')


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for product reviews."""
    
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_avatar = serializers.ImageField(source='user.avatar', read_only=True)
    
    class Meta:
        model = Review
        fields = (
            'id', 'product', 'user', 'user_name', 'user_avatar',
            'rating', 'title', 'comment', 'is_verified_purchase',
            'helpful_count', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'user', 'is_verified_purchase', 'helpful_count', 'created_at', 'updated_at')


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for product list view."""
    
    category_name = serializers.CharField(source='category.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'short_description', 'category',
            'category_name', 'price', 'compare_price', 'discount_percentage',
            'primary_image', 'is_in_stock', 'is_featured',
            'average_rating', 'review_count'
        )
    
    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            return ProductImageSerializer(primary).data
        first_image = obj.images.first()
        if first_image:
            return ProductImageSerializer(first_image).data
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer for product detail view."""
    
    category_name = serializers.CharField(source='category.name', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()
    is_in_stock = serializers.ReadOnlyField()
    is_low_stock = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'description', 'short_description',
            'category', 'category_name', 'price', 'compare_price',
            'discount_percentage', 'sku', 'stock_quantity',
            'is_in_stock', 'is_low_stock', 'weight', 'is_featured',
            'images', 'reviews', 'average_rating', 'review_count',
            'views_count', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'slug', 'views_count', 'created_at', 'updated_at')


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating products."""
    
    class Meta:
        model = Product
        fields = (
            'name', 'description', 'short_description', 'category',
            'price', 'compare_price', 'cost_price', 'sku', 'barcode',
            'stock_quantity', 'low_stock_threshold', 'weight',
            'is_active', 'is_featured'
        )
