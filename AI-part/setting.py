import os 
import dotenv

dotenv.load_dotenv()

SPEECH_KEY=os.getenv("speech_key")
REGION=os.getenv("region")
ENDPOINT=os.getenv("endpoint")