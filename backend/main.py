from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from core.rag_chain import RAGManager
from pydantic import BaseModel
from dotenv import load_dotenv
import logging

# Set up logging for server-side debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

# --- CORS CONFIGURATION ---
# Using "*" allows seamless communication between the extension and backend during dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"], 
    allow_headers=["*"],
)

# Initialize RAG Manager
rag = RAGManager()

# Data models for strict validation to prevent mismatch errors
class IndexRequest(BaseModel):
    url: str
    text: str

class ChatRequest(BaseModel):
    url: str
    query: str

@app.get("/", include_in_schema=False)
async def root():
    """Redirects base URL to API documentation."""
    return RedirectResponse(url="/docs")

@app.post("/index")
async def index_content(data: IndexRequest):
    """Indexes webpage content for retrieval."""
    try:
        # Calls the index_text method in your rag_chain.py
        rag.index_text(data.url, data.text)
        return {"status": "success", "message": "Page indexed successfully"}
    except Exception as e:
        logger.error(f"Indexing Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(data: ChatRequest):
    """Handles chat queries with a fix for the '{' parsing error."""
    # Safety check: Ensure the URL has actually been indexed
    if not data.url or data.url not in rag.indexes:
        return {"reply": "NEURAL_LINK_ERROR: Please analyze the page first."}

    try:
        # 🛠️ THE FIX: 
        # We ensure the rag_chain logic uses dictionary injection to avoid 
        # curly braces in the context being parsed as field names
        response = rag.query_index(data.url, data.query)
        
        if not response:
            return {"reply": "I couldn't find an answer based on the page content."}
            
        return {"reply": response}

    except Exception as e:
        # Logs detailed Python errors to your terminal for faster debugging
        logger.error(f"RAG_ERROR: {str(e)}")
        
        # If the '{' error persists, it may be due to how the text is handled in rag_chain.py
        if "unexpected '{' in field name" in str(e):
             return {"reply": "SYSTEM_ERROR: The page content contains characters that broke the parser. Try a simpler query."}
             
        return {"reply": f"SYSTEM_ERROR: {str(e)}"}

# Catch accidental GET requests to prevent '405 Method Not Allowed'
@app.get("/chat")
async def chat_info():
    return {"message": "Neural Reader API is active. Use POST to communicate."}