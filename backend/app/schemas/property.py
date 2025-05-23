from pydantic import BaseModel
from typing import Optional

class PropertyBase(BaseModel):
    name: str
    pos: int
    type: str = "property"
    group: Optional[str]
    color: Optional[str]
    price: Optional[float]
    houses: int = 0
    house_cost: Optional[float]

class PropertyCreate(PropertyBase):
    pass

class Property(PropertyBase):
    id: int
    game_id: int
    owner_id: Optional[int]

    class Config:
        orm_mode = True