import requests
from setting import *


class speech_to_text:

    def __init__(self):
        self.speech_key = SPEECH_KEY
        self.region = REGION
        self.endpoint = ENDPOINT

        self.headers = {
            "Ocp-Apim-Subscription-Key": self.speech_key,
            "Content-Type": "audio/wav",
            "Accept": "application/json"
        }
        self.params_english = {
            "language": "en-US"
        }
        self.params_hindi = {
            "language": "hi-IN"  # Set the language to Hindi
        }

    def convertor(self,audio,language):
        print(audio)
        with open(audio, "rb") as audio_file:
            audio_data = audio_file.read()

        response=""
        # Send POST request
        if language=="hindi":
            response = requests.post(self.endpoint, headers=self.headers, params=self.params_hindi, data=audio_data)
        elif language=="english":
            response = requests.post(self.endpoint, headers=self.headers, params=self.params_english, data=audio_data)

        # Process response
        print(response)

        if response.status_code == 200:
            # print("Response:", response.json())
            response_data=response.json()
            # print(response_data['DisplayText'])
            return response_data['DisplayText']
        else:
            print(f"Error: {response.status_code}, Message: {response.text}")


audio_to_text=speech_to_text()

# audio_to_text.convertor("/home/rahulladaniya/Downloads/बंगाल की खाड़ी के शी.wav","hindi")
