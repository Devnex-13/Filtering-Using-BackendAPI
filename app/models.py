from sqlalchemy import Column
from sqlalchemy import BigInteger
from sqlalchemy import String
from sqlalchemy import Numeric
from sqlalchemy import DateTime
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Product(Base):

    __tablename__ = "products"

    id = Column(BigInteger, primary_key=True)
    name = Column(String)
    category = Column(String)
    price = Column(Numeric)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)