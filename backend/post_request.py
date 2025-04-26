import requests
import json

# Define the URL of your agent's REST endpoint
url = "http://127.0.0.1:8000/start_roundtable"

# Define the data you want to send in the POST request
payload = {
    "message": "how are u"
}

# Send the POST request with the payload as JSON
response = requests.post(url, json=payload)

# Print the response from the agent
if response.status_code == 200:
    print("Response:", response.json())  # Will print the response as a Python dictionary
else:
    print("Error:", response.status_code)