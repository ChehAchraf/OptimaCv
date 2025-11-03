import fitz

import os

from dotenv import load_dotenv

import google.generativeai as genai

from fastapi import FastAPI, UploadFile, File, HTTPException

import uvicorn



load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")



if not API_KEY:

    raise ValueError("API Key ديال Google ما لقيتوش. تأكد أنك صاوبتي ملف .env")



try:

    genai.configure(api_key=API_KEY)

except Exception as e:

    raise ValueError(f"مشكل فإعدادات Gemini (يمكن الـ API Key غالط؟): {e}")



app = FastAPI(title="CV Analyzer API with Gemini")





@app.post("/analyze-cv/")

async def analyze_cv(file: UploadFile = File(...)):

    

    if file.content_type != "application/pdf":

        raise HTTPException(status_code=400, detail="المرجو إرسال ملف PDF فقط.")



    try:

        pdf_bytes = await file.read()

        

        full_text = ""

        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:

            for page in doc:

                full_text += page.get_text()



        if not full_text.strip():

            raise HTTPException(status_code=400, detail="ملف PDF فارغ أو لا يمكن قراءة النص منه.")



        generation_config = {

            "response_mime_type": "application/json",

        }

        

        model = genai.GenerativeModel(

            'models/gemini-flash-latest', 

            generation_config=generation_config

        )

        

        prompt = f"""
        أنت خبير في تحليل السير الذاتية (CVs).
        قم بتحليل نص السيرة الذاتية التالي واستخرج المعلومات التالية بتنسيق JSON:
        1.  'full_name': الاسم الكامل للمرشح.
        2.  'email': البريد الإلكتروني.
        3.  'phone': رقم الهاتف.
        4.  'summary': ملخص قصير عن المرشح.
        5.  'skills': قائمة بالمهارات التقنية والشخصية.
        6.  'experience': قائمة بالخبرات المهنية (الشركة، المنصب، المدة).
        7.  'education': قائمة بالشهادات الدراسية.

        النص:
        ---
        {full_text}
        ---
        """



        response = model.generate_content(prompt)

        

        return {

            "filename": file.filename,

            "analysis_source": "Gemini Flash Latest",

            "analysis": response.text

        }



    except fitz.EmptyFileError:

        raise HTTPException(status_code=400, detail="الملف المرسل فارغ.")

    except Exception as e:

        print(f"--- 🔴 خطأ من Gemini أو Fitz 🔴 ---")

        print(f"Error Type: {type(e)}")

        print(f"Error Details: {repr(e)}")

        raise HTTPException(status_code=500, detail=f"حدث خطأ: {repr(e)}")





if __name__ == "__main__":

    uvicorn.run(app, host="0.0.0.0", port=8000)
