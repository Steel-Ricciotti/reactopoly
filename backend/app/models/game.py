from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Game(Base):
    __tablename__ = "games"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    current_player_id = Column(Integer, nullable=True)
    players = relationship("Player", back_populates="game")
    properties = relationship("Property", back_populates="game")