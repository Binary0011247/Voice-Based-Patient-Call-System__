from fastapi import UploadFile,Form,FastAPI,File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from audio_to_text.speect_to_text_using_azure import audio_to_text
import shutil
import os
from Urgency_classifier.prediction import UrgencyClassifier
from Urgency_classifier.keyword_identifier import keywordindentifier

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with specific domain for production
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/audio_to_text/")
def audio_convertor(audio_file: UploadFile = File(...), language: str= Form(...)):

    try:
        print("enterd")

# Check if the folder exists
        if not os.path.exists("audio"):
            # Create the folder
            os.makedirs("audio")
            print(f"Folder 'audio' created.")
        else:
            print(f"Folder audio already exists.")

        audio_path = f"audio/temp_{audio_file.filename}"
        print(audio_path)
        with open(audio_path, "wb") as buffer:
            shutil.copyfileobj(audio_file.file, buffer)
        print("calling function")
        result=audio_to_text.convertor(audio_path,language)

        shutil.rmtree("audio")

        if result:
            return JSONResponse(content={
                "success":True,
                "text":result
            },
            status_code=200
            )
        else:
            return JSONResponse(content={
                "success":False,
                "error":"audio not found"
            },
            status_code=500
            )
        
    except Exception as e:
        return JSONResponse(content={
            "success":True,
            "error": str(e)
        },
        status_code=400
        )
    
@app.post("/urgency_classifier/")
def classifier(text: str= Form(...)):

    try:
        print(text)


        result, word= UrgencyClassifier.classifier(text)
        print(result)
        # word=keywordindentifier.indentifier(text)
        print(word)

        if result:
            return JSONResponse(content={
                "success":True,
                "priority":result[0],
                "problem":word
            },
            status_code=200
            )
        else:
            return JSONResponse(content={
                "success":False,
                "error":"text not found"
            },
            status_code=500
            )
        
    except Exception as e:
        return JSONResponse(content={
            "success":True,
            "error": str(e)
        },
        status_code=400
        )