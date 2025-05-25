
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from typing import List, Optional

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Explicitly allow OPTIONS
    allow_headers=["*"],  # Allow all headers
)


# Define Pydantic models for game state
class Property(BaseModel):
    name: str
    pos: int
    color: Optional[str] = None
    group: Optional[str] = None
    type: Optional[str] = None
    price: Optional[float] = None
    rent: Optional[List[float]] = None
    owner: Optional[str] = None
    numHouses: int
    houseCost: Optional[int] = None
											  
    mortgaged: Optional[bool] = False  # Added

    class Config:
        extra = "ignore"  # Ignore extra fields like ID
				 
													   

class Player(BaseModel):
    id: str
    name: str
    piece: str
    position: int
    balance: float
    properties: List[Property]
    side: str
    inJail: bool
    jailTurns: int
    getOutOfJailFree: int
    bankrupt: bool

class GameState(BaseModel):
    players: List[Player]
    properties: List[Property]
    currentPlayer: str

SAVE_FILE = "game_state.json"

				 
				 
										  

@app.post("/save")
async def save_game(game_state: GameState):
    try:
        with open(SAVE_FILE, "w") as f:
            json.dump(game_state.model_dump(), f, indent=2)
        return {"status": "Game saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save game: {str(e)}")

@app.get("/load", response_model=GameState)
async def load_game():
    if not os.path.exists(SAVE_FILE):
        raise HTTPException(status_code=404, detail="No saved game found")
    try:
										 
																			 
        with open(SAVE_FILE, "r") as f:
            data = json.load(f)
        return GameState(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load game: {str(e)}")
