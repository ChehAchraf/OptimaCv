from fastapi import FastAPI

from backend.apis.v1.router import api_router

from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(

    title="OptimaCV Analyzer API",

    description="API for analyzing CVs against Job Descriptions.",

    version="1.0.0"

)



origins = [

    "http://localhost:3000",

    "http://localhost",

    "http://192.168.1.98:3000"

]



app.add_middleware(

    CORSMiddleware,

    allow_origins=origins,

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)





app.include_router(api_router, prefix="/api/v1")





@app.get("/")

def read_root():

    return {"message": "Welcome to OptimaCV API. Go to /docs"}
