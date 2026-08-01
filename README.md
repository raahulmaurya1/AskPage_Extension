# 🚀 AskPage - Chat with Any Webpage using AI

<p align="center">
  <img src="assets/banner.png" alt="AskPage Banner" width="100%">
</p>

<p align="center">

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![LangChain](https://img.shields.io/badge/LangChain-RAG-success)
![Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?logo=google)
![Python](https://img.shields.io/badge/Python-3.10+-yellow?logo=python)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange)

</p>

> 🧠 Transform any webpage into an AI-powered knowledge base. Ask questions, receive grounded answers, and export conversations—all without leaving your browser.

---

# ✨ Demo

<p align="center">
<img src="assets/demo.gif" width="900">
</p>

---

# 🌟 Features

✅ One-click page indexing

✅ AI-powered question answering

✅ RAG Pipeline with FAISS

✅ Google Gemini Integration

✅ Lightning-fast cached responses

✅ Export answers as PDF

✅ Beautiful Chrome Side Panel UI

---

# 🏗 Architecture

<p align="center">

```text
           Webpage
              │
              ▼
     Content Script
(document.body.innerText)
              │
              ▼
         FastAPI Backend
              │
     ┌────────┴────────┐
     ▼                 ▼
Text Chunking     URL Cache
     │
     ▼
 Gemini Embeddings
     │
     ▼
 FAISS Vector Store
     │
     ▼
Similarity Search
     │
     ▼
 Gemini 2.0 Flash
     │
     ▼
 AI Response
     │
     ▼
 Chrome Side Panel

</p>
---

⚙ Tech Stack

Frontend	Backend	AI

React	FastAPI	Gemini
Vite	LangChain	Embeddings
Manifest V3	FAISS	RAG
jsPDF	Uvicorn	Google AI



---

📂 Project Structure

AskPage_Extension
│
├── backend
│   ├── core
│   ├── main.py
│   ├── requirements.txt
│
├── extension
│   ├── src
│   ├── public
│   └── dist
│
└── README.md


---

🔄 Workflow

graph TD

A[Open Webpage]
B[Extract Visible Text]
C[FastAPI Backend]
D[Chunk Documents]
E[Generate Embeddings]
F[FAISS]
G[Similarity Search]
H[Gemini]
I[AI Answer]

A --> B
B --> C
C --> D
D --> E
E --> F
F --> G
G --> H
H --> I


---

🚀 Installation

Clone Repository

git clone https://github.com/raahulmaurya1/AskPage_Extension.git

Backend

cd backend

python -m venv venv

pip install -r requirements.txt

uvicorn main:app --reload

Frontend

cd extension

npm install

npm run build

Load the dist folder inside Chrome.


---

💬 Usage

1. Open any webpage


2. Launch AskPage


3. Click Start Core Analysis


4. Wait for indexing


5. Ask anything


6. Export results as PDF




---

📸 Screenshots

Home	Chat	PDF

Screenshot	Screenshot	Screenshot



---

🔌 API

POST /index

{
"url":"...",
"text":"..."
}

Indexes webpage.


---

POST /chat

{
"url":"...",
"query":"..."
}

Returns AI answer.


---

📈 Roadmap

[ ] Multi-tab memory

[ ] Persistent Vector Database

[ ] Local LLM Support

[ ] Voice Questions

[ ] OCR for Images

[ ] Summarization Mode

[ ] Chat History

[ ] Dark Theme



---

🤝 Contributing

Contributions are welcome!

Fork 🍴

Create Feature Branch 🌱

Commit Changes ✅

Push 🚀

Open Pull Request 🎉


---

🔐 Security

Never commit your .env file.

Rotate exposed API keys immediately.


---

📜 License

MIT License


---

👨‍💻 Author

Rahul Maurya

💼 AI Engineer | Full Stack Developer | GenAI Enthusiast

⭐ If you found this project useful, don't forget to Star the repository!
