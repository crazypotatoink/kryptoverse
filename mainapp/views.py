from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import authenticate, login, logout
from .models import User, Profile, ChatMessage, DepositWallets
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse_lazy
from django.contrib.auth.views import PasswordResetView
from django.contrib.messages.views import SuccessMessageMixin
from django.core.mail import EmailMessage
from utils.cloudinary_utils import upload_image, delete_file
from django.contrib import messages
import os
import re
from django.db.models import Q
from django.core.paginator import Paginator
def is_admin(user):
    return user.is_staff


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


# Create your views here.
def hero(request):
    return render(request, 'index.html')

def login_view(request):
    if request.method == 'POST':
        identifier = request.POST.get('username')
        password = request.POST.get('password')

        # Authentication is securely handled by our single-query custom backend
        user = authenticate(request, username=identifier, password=password)

        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            return render(request, 'login.html', {'error': 'Invalid credentials'})

    return render(request, 'login.html')

def signup_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        full_name = request.POST['fullName']
        country = request.POST['country']
        phone_number = request.POST['phoneNumber']
        gender = request.POST['gender']
        email = request.POST['email']
        image = request.FILES.get('profilePicture')
        password = request.POST['password']
        confirm_password = request.POST['confirmPassword']

        if password != confirm_password:
            return render(request, 'signup.html', {'error': 'Passwords do not match'})
        if User.objects.filter(username=username).exists():
            return render(request, 'signup.html', {'error': 'Username is already taken'})
        if User.objects.filter(email=email).exists():
            return render(request, 'signup.html', {'error': 'Email is already taken'})
        user = User.objects.create_user(username=username, email=email, password=password)
        
        user.profile.full_name = full_name
        user.profile.gender = gender
        user.profile.phone_number = phone_number
        user.profile.country = country

        # Handle profile picture update
        if image:
            # Upload new image
            try:
                image_url = upload_image(image, folder='profile_pics', public_id=f"profile_{user.username}")
                user.profile.profile_picture = image_url
            except Exception as e:
                messages.error(request, f"Image upload failed: {e}")

        user.profile.save()
        
        login(request, user)
        return redirect('home')
    return render(request, 'signup.html')

def contact_view(request):
    return render(request, 'contact.html')

def terms_view(request):
    return render(request, 'terms.html')

def privacy_view(request):
    return render(request, 'privacy.html')

@login_required
def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
def home(request):
    profile = request.user.profile
    return render(request, 'overview.html', {'user': request.user, 'profile': profile})

@login_required
def deposit(request):
    wallets = DepositWallets.objects.first()
    return render(request, 'deposit.html', {'wallets':wallets})

@login_required
def verification(request):
    if request.method == "POST":
        # ... verification logic ...
        failed = True
        if failed:
            return render(request, "verification.html", {
                "verification_failed": True
            })
    return render(request, 'verification.html')

@login_required
def withdraw(request):
    return render(request, 'withdraw.html')

@login_required
def withdraw_btc(request):
    return render(request, 'withdraw-btc.html')

@login_required
def withdraw_bank(request):
    return render(request, 'withdraw-bank.html')

@login_required
def upgrade(request):
    return render(request, 'upgrade.html')

@login_required
def accounts(request):
    profile_tier = request.user.profile.tier
    return render(request, 'accounts.html', {'tier': profile_tier})

@login_required
def settings(request):
    user = request.user
    profile = get_object_or_404(Profile, user=user)

    if request.method == 'POST':
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        full_name = request.POST.get('fullName')
        country = request.POST.get('country')
        gender = request.POST.get('gender')
        image = request.FILES.get('profilePicture')

        user.email = email or user.email
        profile.phone_number = phone or profile.phone_number
        profile.full_name = full_name or profile.full_name
        profile.country = country or profile.country
        profile.gender = gender or profile.gender

        # Handle profile picture update
        if image:
            # Delete previous image if it exists
            if profile.profile_picture:
                try:
                    # Extract public_id from the URL
                    public_id = os.path.splitext(os.path.basename(profile.profile_picture.url))[0]
                    delete_file(public_id)
                except Exception as e:
                    messages.warning(request, f"Could not delete old image: {e}")

            # Upload new image
            try:
                image_url = upload_image(image, folder='profile_pics', public_id=f"profile_{user.username}")
                profile.profile_picture = image_url
            except Exception as e:
                messages.error(request, f"Image upload failed: {e}")

        user.save()
        profile.save()
        messages.success(request, "Profile updated successfully.")
        return redirect('settings')

    return render(request, 'settings.html', {'user': user, 'profile': profile})

@login_required
def withdrawal_history(request):
    return render(request, 'withdrawal-history.html')

@login_required
def support(request):
    return render(request, 'support.html')


@login_required
@user_passes_test(is_admin)
def admin_users(request):
    profiles = Profile.objects.select_related('user')  # Avoid N+1 queries

    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        if name:
            profiles = profiles.filter(
                Q(user__username__icontains=name) |
                Q(user__email__icontains=name)
            )

    profiles = profiles.order_by('-user__date_joined')
    return render(request, 'admin/users.html', {
        'profiles': profiles
    })


@login_required
@user_passes_test(is_admin)
def admin_edit_user(request, user_id):
    target_user = get_object_or_404(User, id=user_id)
    profile, created = Profile.objects.get_or_create(user=target_user)

    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        is_active = request.POST.get('is_active') == 'on'
        is_verified = request.POST.get('is_verified') == 'on'
        tier = request.POST.get('selected_plan', '').strip()

        if not username or not email or not tier:
            return render(request, 'admin/edit_user.html', {
                'target_user': target_user,
                'user': request.user,
                'profile': profile,
                'error': 'All fields are required.'
            })

        if User.objects.filter(username=username).exclude(id=target_user.id).exists():
            return render(request, 'admin/edit_user.html', {
                'target_user': target_user,
                'user': request.user,
                'profile': profile,
                'error': 'Username already exists.'
            })

        target_user.username = username
        target_user.email = email
        target_user.is_active = is_active
        profile.tier = tier
        profile.is_verified = is_verified

        target_user.save()
        profile.save()

        return redirect('admin_users')

    return render(request, 'admin/edit_user.html', {
        'target_user': target_user,
        'user': request.user,
        'profile': profile
    })

@login_required
@user_passes_test(is_admin)
def admin_toggle_user(request, user_id):
    if request.method == 'POST':
        user = User.objects.get(id=user_id)
        user.is_active = not user.is_active
        user.save()
    return redirect('admin_users')

@login_required
@user_passes_test(is_admin)
def admin_delete_user(request, user_id):
    if request.method == 'POST':
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
        
        # Delete the user's profile picture if it exists
        if profile.profile_picture:
            try:
                public_id = os.path.splitext(os.path.basename(profile.profile_picture.url))[0]
                delete_file(public_id)
            except Exception as e:
                messages.warning(request, f"Could not delete profile picture: {e}")

        user.delete()
        return redirect('admin_users')
    
    return render(request, 'admin/delete_user.html', {'user_id': user_id})

@login_required
@user_passes_test(is_admin)
def admin_edit_user_finances(request, user_id):
    user = User.objects.get(id=user_id)
    profile = user.profile
    
    if request.method == 'POST':
        try:
            profile.invested = float(request.POST.get('invested', 0))
            profile.profit = float(request.POST.get('profit', 0))
            profile.bonus = float(request.POST.get('bonus', 0))
            profile.balance = float(request.POST.get('balance', 0))
            profile.save()
            
            return render(request, 'admin/edit_user_finances.html', {
                'user': user,
                'profile': profile,
                'success_message': 'Financial details updated successfully!'
            })
        except ValueError:
            return render(request, 'admin/edit_user_finances.html', {
                'user': user,
                'profile': profile,
                'error_message': 'Please enter valid numbers for all fields.'
            })
    
    return render(request, 'admin/edit_user_finances.html', {
        'user': user,
        'profile': profile
    })

def get_messages(request):
    messages = ChatMessage.objects.filter(user=request.user).order_by('-timestamp')[:50]
    messages = reversed(messages)  # to show oldest first
    return JsonResponse({
        'messages': [
            {'sender': msg.user.username, 'text': msg.text, 'timestamp': msg.timestamp.strftime('%H:%M:%S'), 'admin':msg.admin}
            for msg in messages
        ]
    })

@csrf_exempt
@login_required
def send_message(request):
    if request.method == "POST":
        text = request.POST.get('message')
        if text:
            ChatMessage.objects.create(user=request.user, text=text, admin='me')
            return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'error'})

@login_required
def admin_messages(request):
    messages_list = ChatMessage.objects.all().order_by('-timestamp')
    paginator = Paginator(messages_list, 20)  # Show 20 messages per page
    
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'admin/messages.html', {
        'messages': page_obj
    })

@login_required
def send_admin_message(request, user_id):
    if request.method == "POST":
        text = request.POST.get('message')
        if text:
            user = User.objects.get(id=user_id)
            ChatMessage.objects.create(user=user, text=text)
            return JsonResponse({'status': 'ok'})
    return render(request, 'admin/admin_support.html', {
        'user': User.objects.get(id=user_id)
    })

def get_admin_messages(request, user_id):
    messages = ChatMessage.objects.filter(user=user_id).order_by('-timestamp')[:50]
    messages = reversed(messages)  # to show oldest first
    return JsonResponse({
        'messages': [
            {'sender': msg.user.username, 'text': msg.text, 'timestamp': msg.timestamp.strftime('%H:%M:%S'), 'admin':msg.admin}
            for msg in messages
        ]
    })

@login_required
def edit_variables(request):
    if request.method == 'POST':
        btc = request.POST.get('btc')
        eth = request.POST.get('eth')
        usdt = request.POST.get('usdt')
        ltc = request.POST.get('ltc')
        wallets = DepositWallets.objects.first()
        wallets.btc = btc
        wallets.eth = eth
        wallets.usdt = usdt
        wallets.ltc = ltc
        wallets.save()
        return redirect('edit_variables')
    wallets = DepositWallets.objects.first()
    return render(request, 'admin/edit_variables.html', {
        'wallets': wallets
    })

@login_required
def confirm_payments(request):
    if request.method == 'POST':
        # Get the uploaded file and description from the form
        photo = request.FILES.get('uploaded_file')
        description = request.POST.get('description')
        user_email = request.user.email
        username = request.user.username

        # Construct the email subject and message
        subject = f'Payment Confirmation from {username}'
        message = (
            f"Hello Admin,\n\n"
            f"A user has submitted a payment confirmation with the following details:\n\n"
            f"Username: {username}\n"
            f"Email: {user_email}\n\n"
            f"Description: {description}\n\n"
            "Please find the attached file with the payment proof.\n\n"
            "Best regards,\nKryptoVerse Team"
        )

        # Admin email address (could be configured in settings.py)
        admin_email = 'help.kryptoverse@gmail.com'

        # Create the email message
        email = EmailMessage(
            subject=subject,
            body=message,
            from_email='KryptoVerse Payment Confirmation',
            to=[admin_email],
        )

        # Attach the uploaded file if it exists
        if photo:
            email.attach(photo.name, photo.read(), photo.content_type)

        # Send the email to the admin
        email.send(fail_silently=False)

        # Redirect user to the home page after successful email send
        return redirect('home')

    # If GET request, render the payment confirmation form
    return render(request, 'confirm_payment.html')

class ResetPasswordView(SuccessMessageMixin, PasswordResetView):
    template_name = 'password_reset/password_reset.html'
    email_template_name = 'password_reset/password_reset_email.html'
    subject_template_name = 'password_reset/password_reset_subject.txt'
    success_message = "We've emailed you instructions for setting your password, " \
                      "if an account exists with the email you entered. You should receive them shortly." \
                      " If you don't receive an email, " \
                      "please make sure you've entered the address you registered with, and check your spam folder."
    success_url = reverse_lazy('login')
