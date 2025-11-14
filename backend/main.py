from fastapi import FastAPI

from backend.apis.v1.router import api_router

from fastapi.middleware.cors import CORSMiddleware

import os



app = FastAPI(

    title="OptimaCV Analyzer API",

    description="API for analyzing CVs against Job Descriptions.",

    version="1.0.0"

)



# CORS origins - can be configured via environment variable
# Format: "http://domain1.com,http://domain2.com,http://localhost:3000"
cors_origins_env = os.getenv("CORS_ORIGINS", "")

if cors_origins_env:
    origins = [origin.strip() for origin in cors_origins_env.split(",")]
else:
    # Default origins for development
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
