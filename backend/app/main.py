from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Product

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://filtering-using-backendapi-1.onrender.com/",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Hello"}

from fastapi import Query

@app.get("/products")
def get_products(
    category: str = None,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(Product)

    if category:
        query = query.filter(
            Product.category == category
        )

    query = query.order_by(
        Product.created_at.desc(),
        Product.id.desc()
    )

    if limit:
        query = query.limit(limit)

    return query.all()