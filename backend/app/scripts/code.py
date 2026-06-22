from faker import Faker
import random
from datetime import datetime
import pandas as pd

fake = Faker()

categories = [
  "Cloths",
  "Electronics",
  "Toys",
  "Beauty",
  "Footware",
  "Glasses",
  "Furniture",
  "Groceries",
  "Sports"
]

products = []

for i in range(200000):
  products.append({
    "name": fake.word().title() + " " + fake.word().title(),
    "category": random.choice(categories),
    "price": round(random.uniform(10,5000),2),
    "created_at":fake.date_time_between(start_date="-2y",end_date="now"),
    "updated_at":datetime.now()
  })

df = pd.DataFrame(products)

df.to_csv("products.csv", index=False)