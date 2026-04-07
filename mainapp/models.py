from django.db import models
from django.contrib.auth.models import User

# # Create your models here.
# class User(User):
#     username = models.CharField(max_length=150, unique=True)
#     email = models.EmailField(unique=True)
#     password = models.CharField(max_length=128)
#     date_joined = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.username


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    phone_number = models.CharField(max_length=15, blank=True)
    full_name = models.CharField(max_length=150, blank=True)
    country = models.CharField(max_length=100, blank=True)
    gender = models.CharField(max_length=10, blank=True)
    profile_picture = models.URLField(blank=True)
    invested = models.FloatField(default=0.00)
    profit = models.FloatField(default=0.00)
    bonus = models.FloatField(default=0.00)
    balance = models.FloatField(default=0.00)
    tier = models.CharField(max_length=50, default="Basic")
    is_verified = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"


class ChatMessage(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_messages"
    )
    admin = models.CharField(max_length=150, default="admin")
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text[:20]


class DepositWallets(models.Model):
    btc = models.CharField(max_length=100)
    eth = models.CharField(max_length=100)
    usdt = models.CharField(max_length=100)
    ltc = models.CharField(max_length=100)

    def __str__(self):
        return self.btc
