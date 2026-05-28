from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routes import router

app = FastAPI(title="DailyPulse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RuntimeError)
async def runtime_error_handler(request: Request, exc: RuntimeError):
    """Return 429 for quota errors so the frontend can show a friendly message."""
    msg = str(exc)
    if "quota" in msg.lower() or "exhausted" in msg.lower():
        return JSONResponse(status_code=429, content={"detail": msg})
    return JSONResponse(status_code=500, content={"detail": msg})


app.include_router(router)
