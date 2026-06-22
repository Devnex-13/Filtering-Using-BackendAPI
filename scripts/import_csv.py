import pandas as pd
import os
from sqlalchemy import create_engine

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

df = pd.read_csv("products.csv")

df.to_sql(
    "products",
    engine,
    if_exists="append",
    index=False,
    chunksize=5000,
    method="multi"
)

print("200,000 products imported successfully!")