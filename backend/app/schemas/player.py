from pydantic import BaseModel
from typing import List, Optional
from .property import Property

class PlayerBase(BaseModel):
    name: str
    piece: str
    balance: float = 15000000.0
    position: int = 0
    side: str = "bottom"

class PlayerCreate(PlayerBase):
    pass

class Player(PlayerBase):
    id: int
    game_id: int
    properties: List[Property] = []

    class Config:
        orm_mode = True