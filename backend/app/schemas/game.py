from pydantic import BaseModel
from typing import List, Optional
from .player import Player
from .property import Property

class GameBase(BaseModel):
    name: str

class GameCreate(GameBase):
    pass

class Game(GameBase):
    id: int
    current_player_id: Optional[int]
    players: List[Player] = []
    properties: List[Property] = []

    class Config:
        orm_mode = True