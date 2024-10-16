from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
from .models import Medicine, Logs, PatientMetadata, Contacts  # Make sure to import your Log model
from mysite.symptom_locator import get_symptoms, process_symptoms_with_gemini
from django.db import connections
from django.forms.models import model_to_dict

# Create your views here.

@require_http_methods(["GET"])
def get_medicine_by_name(request):
    name = request.GET.get('name')
    medicine = get_object_or_404(Medicine, name=name)
    return JsonResponse({'id': str(medicine.id)})

@require_http_methods(["GET"])
def get_medicine_by_guid(request, guid):
    medicine = get_object_or_404(Medicine, id=guid)
    
    # Get the patient metadata
    patient_metadata = PatientMetadata.objects.first()
    
    # Parse the medicine field from text to list
    patient_medicines = json.loads(patient_metadata.medicine) if patient_metadata else []
    
    # Check if the current medicine is in the patient's medicines
    is_patient_medicine = str(medicine.id) in patient_medicines
    
    return JsonResponse({
        'id': str(medicine.id),
        'name': medicine.name,
        'symptoms': medicine.symptoms,
        'last_updated': medicine.last_updated,
        'is_patient_medicine': is_patient_medicine
    })

@csrf_exempt
@require_http_methods(["POST"])
def create_medicine(request):
    data = json.loads(request.body)
    name = data.get('name')

    if not name:
        return JsonResponse({'error': 'Medicine name is required'}, status=400)

    # Check if medicine with the same name already exists
    existing_medicine = Medicine.objects.filter(name=name).first()
    if existing_medicine:
        return JsonResponse({'id': str(existing_medicine.id), 'message': 'Medicine already exists'})

    # Generate symptoms using the symptom locator script
    symptom_data = get_symptoms(name)
    processed_symptoms = process_symptoms_with_gemini(name, symptom_data)

    # Check if processed_symptoms is empty
    if not processed_symptoms:
        return JsonResponse({'error': 'Unable to generate symptoms for this medicine'}, status=400)

    # Create medicine with generated symptoms
    medicine = Medicine.objects.create(name=name, symptoms=processed_symptoms)

    return JsonResponse({'id': str(medicine.id), 'message': 'Medicine created successfully'})

@csrf_exempt
@require_http_methods(["PUT"])
def update_medicine(request, guid):
    medicine = get_object_or_404(Medicine, id=guid)
    data = json.loads(request.body)
    medicine.name = data.get('name', medicine.name)
    
    # Update symptoms using symptom_locator if name has changed
    if 'name' in data and data['name'] != medicine.name:
        from mysite.symptom_locator import get_symptoms, process_symptoms_with_gemini
        symptom_data = get_symptoms(data['name'])
        medicine.symptoms = process_symptoms_with_gemini(data['name'], symptom_data)
    
    medicine.save()
    return JsonResponse({'id': str(medicine.id)})

@csrf_exempt
@require_http_methods(["POST"])
def create_log(request):
    try:
        data = json.loads(request.body)
        medicine_ids = data.get('medicine_ids', [])
        symptoms = data.get('symptoms', [])

        # Validate the symptoms format
        if not isinstance(symptoms, list):
            return JsonResponse({"error": "Invalid symptoms format. Expected a list."}, status=400)

        for symptom in symptoms:
            if not isinstance(symptom, list) or len(symptom) != 3:
                return JsonResponse({"error": "Invalid symptom format. Expected a list with 3 elements."}, status=400)

        # Convert symptoms to JSON string
        symptoms_json = json.dumps(symptoms)

        # Create a new Log instance
        log = Logs.objects.create(symptoms=symptoms_json)
        log.set_medicine_ids(medicine_ids)
        log.save()

        # Return the created log's ID
        return JsonResponse({"id": str(log.id)}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@require_http_methods(["GET"])
def get_log_by_id(request, guid):
    try:
        log = Logs.objects.get(id=guid)
        medicine_ids = log.get_medicine_ids()
        symptoms = json.loads(log.symptoms)
        return JsonResponse({
            'id': str(log.id),
            'date': log.date.isoformat(),
            'medicine_ids': medicine_ids,
            'symptoms': symptoms
        })
    except Logs.DoesNotExist:
        return JsonResponse({"error": "Log not found"}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid data"}, status=500)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@require_http_methods(["GET"])
def get_all_logs(request):
    logs = Logs.objects.all()
    return JsonResponse({'logs': [
        {
            'id': str(log.id),
            'date': log.date.isoformat(),
            'medicine': log.get_medicine_ids(),
            'symptoms': json.loads(log.symptoms)
        } for log in logs
    ]})

@require_http_methods(["GET"])
def get_logs_by_date_range(request):
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    logs = Logs.objects.filter(date__range=[start_date, end_date])
    return JsonResponse({'logs': [
        {
            'id': str(log.id),
            'date': log.date.isoformat(),
            'medicine': log.get_medicine_ids(),
            'symptoms': json.loads(log.symptoms)
        } for log in logs
    ]})

@require_http_methods(["GET"])
def get_patient_medicines(request):
    patient_metadata = PatientMetadata.objects.first()
    if patient_metadata and patient_metadata.medicine:
        medicine_ids = json.loads(patient_metadata.medicine)
        medicines = Medicine.objects.filter(id__in=medicine_ids).values('id', 'name')
        return JsonResponse({'medicines': list(medicines)})
    return JsonResponse({'medicines': []})

@csrf_exempt
@require_http_methods(["PUT"])
def update_patient_medicines(request):
    data = json.loads(request.body)
    patient_metadata, created = PatientMetadata.objects.get_or_create(defaults={'medicine': '[]'})
    if 'medicine' in data:
        patient_metadata.medicine = json.dumps(data['medicine'])
        patient_metadata.save()
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'error': 'No medicine data provided'}, status=400)

@require_http_methods(["GET"])
def get_last_logged_in(request):
    patient_metadata = PatientMetadata.objects.first()
    return JsonResponse({'last_logged_in': patient_metadata.last_logged_in})

@csrf_exempt
@require_http_methods(["PUT"])
def update_last_logged_in(request):
    patient_metadata = PatientMetadata.objects.first()
    patient_metadata.save()  # This will automatically update the last_logged_in field
    return JsonResponse({'success': True})

@csrf_exempt
@require_http_methods(["PUT"])
def update_streak_count(request):
    data = json.loads(request.body)
    patient_metadata = PatientMetadata.objects.first()
    patient_metadata.streak_count = data['streak_count']
    patient_metadata.save()
    return JsonResponse({'success': True})

@csrf_exempt
@require_http_methods(["POST"])
def create_contact(request):
    data = json.loads(request.body)
    name = data.get('name')
    phone_number = data.get('phone_number')
    email = data.get('email')

    # Check if contact with the same name already exists
    existing_contact = Contacts.objects.filter(name=name).first()
    if existing_contact:
        return JsonResponse({'id': str(existing_contact.id), 'message': 'Contact already exists'})

    contact = Contacts.objects.create(name=name, phone_number=phone_number, email=email)
    return JsonResponse({'id': str(contact.id)})

@require_http_methods(["GET"])
def get_contact_by_name(request):
    name = request.GET.get('name')
    contact = get_object_or_404(Contacts, name=name)
    return JsonResponse({
        'id': str(contact.id),
        'name': contact.name,
        'email': contact.email,
        'phone_number': contact.phone_number
    })

@csrf_exempt
@require_http_methods(["GET", "POST", "PUT"])
def patient_metadata(request):
    if request.method == "GET":
        patient_metadata = PatientMetadata.objects.first()
        if patient_metadata:
            metadata = {
                'id': str(patient_metadata.id),
                'streak_count': patient_metadata.streak_count,
                'last_logged_in': patient_metadata.last_logged_in.isoformat(),
                'name': patient_metadata.name,
                'medicine': json.loads(patient_metadata.medicine)
            }
            return JsonResponse(metadata)
        return JsonResponse({'error': 'No patient metadata found'}, status=404)
    
    elif request.method in ["POST", "PUT"]:
        data = json.loads(request.body)
        patient_metadata, created = PatientMetadata.objects.get_or_create(pk=1)
        
        if 'medicine' in data:
            patient_metadata.medicine = json.dumps(data['medicine'])
        
        for field in ['streak_count', 'name']:
            if field in data:
                setattr(patient_metadata, field, data[field])
        
        if request.method == "POST":
            patient_metadata.last_logged_in = timezone.now()
        
        patient_metadata.save()
        
        response_data = {
            'id': str(patient_metadata.id),
            'streak_count': patient_metadata.streak_count,
            'last_logged_in': patient_metadata.last_logged_in.isoformat() if patient_metadata.last_logged_in else None,
            'name': patient_metadata.name,
            'medicine': json.loads(patient_metadata.medicine)
        }
        
        return JsonResponse(response_data)

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
@require_http_methods(["POST"])
def check_symptom_medicines(request):
    data = json.loads(request.body)
    symptom = data.get('symptom', '').lower()  # Convert to lowercase
    patient_rating = data.get('patient_rating')
    medicine_guids = data.get('medicine_guids', [])

    print(f"Received request with symptom: {symptom}, patient_rating: {patient_rating}, medicine_guids: {medicine_guids}")

    if not symptom or not medicine_guids:
        return JsonResponse({'error': 'Missing required parameters'}, status=400)

    matching_medicines = []

    for guid in medicine_guids:
        try:
            medicine = Medicine.objects.get(id=guid)
            print(f"Checking medicine: {medicine.name} (ID: {medicine.id})")
            
            for med_symptom in medicine.symptoms:
                med_symptom_name = med_symptom[0].lower()  # Convert to lowercase
                med_symptom_severity = med_symptom[1]
                
                if med_symptom_name == symptom:
                    if patient_rating is not None:
                        if med_symptom_severity in [patient_rating, patient_rating - 1]:
                            print(f"Full match found: {medicine.name} for symptom {symptom}")
                            matching_medicines.append({
                                'name': medicine.name,
                                'id': str(medicine.id),
                                'symptom': med_symptom
                            })
                            break
                    else:
                        print(f"Match found: {medicine.name} for symptom {symptom}")
                        matching_medicines.append({
                            'name': medicine.name,
                            'id': str(medicine.id),
                            'symptom': med_symptom
                        })
                        break
        except Medicine.DoesNotExist:
            print(f"Medicine with ID {guid} not found")
            continue

    print(f"Matching medicines: {matching_medicines}")
    return JsonResponse({'matching_medicines': matching_medicines})

@csrf_exempt
@require_http_methods(["POST", "PUT"])
def update_patient_name(request):
    data = json.loads(request.body)
    name = data.get('name')
    
    if not name:
        return JsonResponse({'error': 'Name is required'}, status=400)
    
    patient_metadata, created = PatientMetadata.objects.get_or_create(id=1)
    patient_metadata.name = name
    patient_metadata.save()
    
    return JsonResponse({'success': True, 'name': name})
