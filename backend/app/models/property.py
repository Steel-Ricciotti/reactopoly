from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Property(Base):
    __tablename__ = "properties"
    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey("games.id"))
    name = Column(String, index=True)
    pos = Column(Integer)
    type = Column(String, default="property")
    group = Column(String, nullable=True)
    color = Column(String, nullable=True)
    price = Column(Float, nullable=True)
    houses = Column(Integer, default=0)
    house_cost = Column(Float, nullable=True)
    owner_id = Column(Integer, ForeignKey("players.id"), nullable=True)
    game = relationship("Game", back_populates="properties")
    owner = relationship("Player", back_populates="properties")