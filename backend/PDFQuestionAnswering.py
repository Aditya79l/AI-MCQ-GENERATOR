import os
import PyPDF2
import google.generativeai as genai
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.docstore.document import Document
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings


load_dotenv()

class PDFQuestionAnswering:
    def __init__(self, pdf_path, api_key=None):
        self.pdf_path = pdf_path
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.text_chunks = []
        self.vectorstore = None
        self.setup_gemini()
        self.setup_embeddings()
        self.process_pdf()
        self.build_vectorstore()

    def setup_gemini(self):
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel(model_name="gemini-1.5-flash")

    def setup_embeddings(self):
        self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")


    def extract_text_from_pdf(self):
        text = ""
        try:
            with open(self.pdf_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n\n"
            return text, True
        except Exception as e:
            print(f"❌ PDF extraction error: {e}")
            return "", False

    def process_pdf(self):
        extracted_text, success = self.extract_text_from_pdf()
        if success:
            splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
            self.text_chunks = splitter.split_text(extracted_text)
        else:
            print("❌ Failed to extract PDF text.")

    def build_vectorstore(self):
        try:
            documents = [Document(page_content=chunk) for chunk in self.text_chunks]
            self.vectorstore = Chroma.from_documents(
                documents=documents,
                embedding=self.embeddings
            )
            print("✅ Vectorstore built in-memory.")
        except Exception as e:
            print(f"❌ Vectorstore error: {e}")

    def retrieve_relevant_chunks(self, query, top_k=5):
        retriever = self.vectorstore.as_retriever(search_kwargs={"k": top_k})
        results = retriever.get_relevant_documents(query)
        return "\n\n".join([doc.page_content for doc in results])

    def ask_gemini_mcqs(self, num_mcqs: int, context: str):
        prompt = f"""
You are a professional exam content creator. Based on the context below, generate {num_mcqs} multiple-choice questions (MCQs).
Each question should include:
- A clear, concise question
- Four options labeled A, B, C, and D
- The correct answer in format 'Answer: X'
- A one-line explanation for why the answer is correct

Be relevant, accurate, and base your questions on the provided content.

CONTEXT:
{context}
"""
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"❌ Error from Gemini: {e}"
