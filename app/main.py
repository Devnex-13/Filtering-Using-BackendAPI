from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Product

app = FastAPI()

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

    products = (
        query
        .order_by(
            Product.created_at.desc(),
            Product.id.desc()
        )
        .limit(limit)
        .all()
    )

    return products