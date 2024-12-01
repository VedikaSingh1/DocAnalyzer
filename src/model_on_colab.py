#cell1
#pip install fastapi uvicorn python-multipart nest_asyncio pyngrok

#cell2
#pip install langchain pymupdf faiss-cpu nltk langchain-community langchain_google_genai

#cell3
from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse
import os
from google.colab import userdata
from langchain.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQAWithSourcesChain
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
import langchain
import nest_asyncio
from pyngrok import ngrok
import uvicorn
from tempfile import NamedTemporaryFile
from fastapi.middleware.cors import CORSMiddleware

#cell4
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (POST, GET, etc.)
    allow_headers=["*"],  # Allow all headers
)

vectorstore = None
chain = None

#cell5
os.environ["GOOGLE_API_KEY"]=userdata.get('GOOGLE_API_KEY')

#cell6
gemini_embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash-8b",
    temperature=0.0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

#cell7
@app.post("/upload_pdf/")
async def upload_pdf(file: UploadFile):
    """
    Endpoint to upload a PDF and initialize the FAISS vectorstore.
    """
    global vectorstore, chain

    # Save the uploaded file temporarily
    with NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(await file.read())
        temp_path = temp_file.name

    # Load and process the PDF
    loader = PyMuPDFLoader(temp_path)
    data = loader.load()

    # Split data into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        separators=['\n\n', '\n', '.', ','],
        chunk_size=500
    )
    docs = text_splitter.split_documents(data)

    # Create vectorstore
    vectorstore = FAISS.from_documents(docs, gemini_embeddings)

    # Initialize retrieval chain
    chain = RetrievalQAWithSourcesChain.from_llm(llm=llm, retriever=vectorstore.as_retriever())

    # Clean up temporary file
    os.remove(temp_path)

    return JSONResponse({"message": "PDF uploaded and processed successfully!", "num_chunks": len(docs)})

#cell8
@app.post("/query/")
async def query_paper(question: str = Form(...)):
    """
    Single endpoint to handle a query and return the response.
    """
    global chain

    if chain is None:
        # Return an error if no PDF has been uploaded yet
        return JSONResponse(
            {"error": "No PDF has been uploaded yet. Please upload a PDF first."},
            status_code=400
        )

    try:
        # Run the query through the chain
        langchain.debug = True  # Enable debugging for detailed logs
        result = chain({"question": question}, return_only_outputs=True)

        # Return the result as JSON
        return JSONResponse({"result": result})
    except Exception as e:
        # Handle unexpected errors
        return JSONResponse(
            {"error": "An error occurred while processing the query.", "details": str(e)},
            status_code=500
        )
    
#cell9
ngrok.set_auth_token(userdata.get('NGROK_AUTH'))
nest_asyncio.apply()
public_url = ngrok.connect(8000)
print(f"Public URL: {public_url}")
uvicorn.run(app, host="0.0.0.0", port=8000)
