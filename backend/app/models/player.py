from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Player(Base):
    __tablename__ = "players"
    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey("games.id"))
    name = Column(String, index=True)
    piece = Column(String)
    balance = Column(Float, default=15000000.0)
    position = Column(Integer, default=0)
    side = Column(String, default="bottom")
    game = relationship("Game", back_populates="players")
    properties = relationship("Property", back_populates="owner")