import json
import os
from dotenv import load_dotenv
import requests
from google.cloud import aiplatform
from google.protobuf import json_format
from google.protobuf.struct_pb2 import Value
import google.generativeai as genai
from google.oauth2 import service_account


def get_symptoms(medicine_name):
    # Construct the API URL with the medicine name
    api_url = f"https://api.fda.gov/drug/label.json?search=adverse_reactions:{medicine_name}"

    # Make the API request
    response = requests.get(api_url)
    data = response.json()

    symptom_data = []
    # Define the fields you want to extract from the JSON
    fields = ['adverse_reactions', 'warnings', 'information_for_patients', 'general_precautions', 'precautions']

    # Check if results exist in the API response
    if 'results' in data and len(data['results']) > 0:
        result = data['results'][0]
        for field in fields:
            if field in result:
                # Flatten the list if it's nested
                if isinstance(result[field], list):
                    symptom_data.extend(result[field])
                else:
                    symptom_data.append(result[field])
            else:
                print(f"Field '{field}' not found in the API response")
    else:
        print(f"No data found for {medicine_name}")

    # Join all the text into a single string
    return ' '.join(symptom_data)



def process_symptoms_with_gemini(medicine_name, symptom_data):
    # Set up the API key
    genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))

    # Set up the model
    model = genai.GenerativeModel('gemini-pro')

    # Prepare the prompt
    prompt = f"""
    Medicine: {medicine_name}
    Symptom Data: {symptom_data}

    Analyze the provided symptom data for the given medicine. Generate a list of tuples, each in the format ('symptom', severity_level, urgency_level), where:

    1. 'symptom' is the specific symptom or side effect.
    2. severity_level indicates the intensity of the symptom for the patient:
       0 - Mild: Noticeable but not interfering with daily activities
       1 - Moderate: Causing some interference with daily activities
       2 - Severe: Significantly impacting daily life or potentially dangerous

    3. urgency_level represents how quickly medical attention may be needed:
       0 - Routine: Can be addressed at next regular check-up
       1 - Soon: Should be evaluated within a few days
       2 - Urgent: Requires prompt medical attention
       3 - Emergency: Immediate medical care needed

    Use the context provided in the symptom data to determine appropriate severity and urgency levels for each symptom. Present the list in order of decreasing urgency and severity.
    """

    max_attempts = 3
    for attempt in range(max_attempts):
        try:
            # Generate content
            response = model.generate_content(prompt)

            # Extract the content from the response
            result = response.text

            # Convert the response text to an array of tuples
            result_array = []
            for line in result.split('\n'):
                if line.startswith('- '):
                    # Remove the leading '- ' and parse the tuple
                    tuple_str = line[2:].strip('()')
                    parts = tuple_str.split(',')
                    if len(parts) != 3:
                        continue  # Skip malformed lines
                    symptom = parts[0].strip().strip("'")
                    try:
                        severity = int(parts[1].strip())
                        concern = int(parts[2].strip())
                    except ValueError:
                        continue  # Skip if severity or concern is not a valid integer
                    result_array.append((symptom, severity, concern))

            if result_array:
                return result_array
            else:
                print(f"Attempt {attempt + 1}: Empty result array. Retrying...")
        except Exception as e:
            print(f"Attempt {attempt + 1}: Error occurred: {str(e)}. Retrying...")

    print("Max attempts reached. Returning empty array.")
    return []



def main(medicine_name):
    # Load environment variables from .env file
    load_dotenv()

    # Ensure the GOOGLE_CLOUD_PROJECT environment variable is set
    if not os.getenv('GOOGLE_CLOUD_PROJECT'):
        raise ValueError("GOOGLE_CLOUD_PROJECT not set in .env file")

    symptom_data = get_symptoms(medicine_name)
    result = process_symptoms_with_gemini(medicine_name, symptom_data)
    print(result)

if __name__ == "__main__":
    main("ibuprofen")




