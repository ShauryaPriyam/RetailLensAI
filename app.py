from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.stores import router as stores_router
from api.forecast import router as forecast_router
from api.dashboard import router as dashboard_router

app = FastAPI(
    title="RetailLensAI API",
    version="1.0.0",
    description="Retail Sales Intelligence Platform"
)

# React frontend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://retail-lens-ai.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(stores_router)
app.include_router(forecast_router)
app.include_router(dashboard_router)


@app.get("/")
def root():

    return {
        "status": "running",
        "service": "RetailLensAI",
        "version": "1.0.0"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }