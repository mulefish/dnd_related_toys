import requests

url = "http://localhost:5000/grid-params"
payload = {
    "viewportWidth": 1200,
    "viewportHeight": 800,
    "hexCols": 10,
    "hexRows": 8
}

response = requests.post(url, json=payload)
print("Status Code:", response.status_code)
print("Response JSON:", response.json())
