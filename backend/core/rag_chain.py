from langchain_google_genai import (
    GoogleGenerativeAIEmbeddings,
    ChatGoogleGenerativeAI
)
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate

class RAGManager:
    def __init__(self):
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001"
        )
        self.llm = ChatGoogleGenerativeAI(
            model="models/gemini-2.0-flash",
            temperature=0.1
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=100
        )
        self.indexes = {}

    def index_text(self, url: str, text: str):
        if not text or not isinstance(text, str):
            raise ValueError("Invalid buffer: Text content empty")
        if url in self.indexes:
            return

        chunks = self.text_splitter.split_text(text)
        documents = [
            Document(page_content=chunk, metadata={"url": url})
            for chunk in chunks
        ]
        vectorstore = FAISS.from_documents(documents, self.embeddings)
        self.indexes[url] = vectorstore

    def query_index(self, url: str, query: str) -> str:
        if url not in self.indexes:
            return "SYSTEM_ERROR: Context not found for this URL."

        vectorstore = self.indexes[url]
        docs = vectorstore.similarity_search(query, k=3)

        if not docs:
            return "No relevant data points found."

        context_text = "\n\n".join(doc.page_content for doc in docs)

        # 🛠️ THE FIX: Use explicit message structures to avoid {} parsing errors
        system_instructions = (
            "You are a Neural Assistant. Use the provided context to answer. "
            "Omit asterisks unless writing code."
        )
        
        # We pass context and query as variables to the template to avoid 
        # curly braces in the text being interpreted as field names
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", system_instructions),
            ("human", "CONTEXT:\n{context}\n\nQUESTION: {question}")
        ])

        chain = prompt_template | self.llm

        try:
            # Passing the data as a dictionary ensures LangChain handles escaping
            response = chain.invoke({
                "context": context_text,
                "question": query
            })
            return response.content
        except Exception as e:
            return f"LLM_GATEWAY_ERROR: {str(e)}"