"""
URL configuration for mysite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from backend import views

urlpatterns = [
    path('admin/', admin.site.urls),
    # Input: /api/medicine/name/?name=ibuprofen (returns id)
    path('api/medicine/name/', views.get_medicine_by_name, name='get_medicine_by_name'),
    # Input: /api/medicine/123e4567-e89b-12d3-a456-426614174000/ (returns all fields)
    path('api/medicine/<uuid:guid>/', views.get_medicine_by_guid, name='get_medicine_by_guid'),
    # Input: /api/medicine/create/
    path('api/medicine/create/', views.create_medicine, name='create_medicine'),
    # Input: /api/medicine/update/123e4567-e89b-12d3-a456-426614174000/ (returns all fields)
    path('api/medicine/update/<uuid:guid>/', views.update_medicine, name='update_medicine'),
    # Input: /api/log/create/ (returns id)
    path('api/log/create/', views.create_log, name='create_log'),
    # Input: /api/log/123e4567-e89b-12d3-a456-426614174000/ (returns all fields)
    path('api/log/<uuid:guid>/', views.get_log_by_id, name='get_log_by_id'),
    # Input: /api/logs/ (returns all fields)
    path('api/logs/', views.get_all_logs, name='get_all_logs'),
    # Input: /api/logs/date-range/?start_date=2024-01-01&end_date=2024-01-31 (returns all fields)
    path('api/logs/date-range/', views.get_logs_by_date_range, name='get_logs_by_date_range'),
    # Input: /api/patient/medicines/ (returns all fields)
    path('api/patient/medicines/', views.get_patient_medicines, name='get_patient_medicines'),
    # Input: /api/patient/medicines/update/ (returns all fields)
    path('api/patient/medicines/update/', views.update_patient_medicines, name='update_patient_medicines'),
    # Input: /api/patient/last-logged-in/ (returns all fields)
    path('api/patient/last-logged-in/', views.get_last_logged_in, name='get_last_logged_in'),
    # Input: /api/patient/last-logged-in/update/ (returns all fields)
    path('api/patient/last-logged-in/update/', views.update_last_logged_in, name='update_last_logged_in'),
    # Input: /api/patient/streak-count/update/ (returns all fields) 
    path('api/patient/streak-count/update/', views.update_streak_count, name='update_streak_count'),
    # Input: /api/contact/create/ (returns id)
    path('api/contact/create/', views.create_contact, name='create_contact'),
    # Input: /api/contact/name/?name=John%20Doe (returns all fields)
    path('api/contact/name/', views.get_contact_by_name, name='get_contact_by_name'),
    # Input: /api/patient/check-symptom-medicines/ (returns all fields)
    path('api/patient/check-symptom-medicines/', views.check_symptom_medicines, name='check_symptom_medicines'),
]
