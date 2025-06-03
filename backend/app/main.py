from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from typing import List, Optional
from socketio import AsyncServer, ASGIApp
import random
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()
sio = AsyncServer(async_mode='asgi', cors_allowed_origins='http://localhost:3000')
app.mount("/", ASGIApp(sio))  # Mount at root to handle /socket.io/

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define Pydantic models
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
    mortgaged: Optional[bool] = False
    class Config:
        extra = "ignore"

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

class DiceState(BaseModel):
    diceOne: int
    diceTwo: int

SAVE_FILE = "game_state.json"

class GameManager:
    games: dict[str, dict] = {}
    sid_to_game: dict[str, str] = {}

game_manager = GameManager()

@sio.event
async def connect(sid, environ):
    logger.debug(f"Client connected: {sid}")

@sio.event
async def join_game(sid, data):
    game_id = data.get('game_id')
    player_id = data.get('player_id')
    logger.debug(f"Join request: sid={sid}, game_id={game_id}, player_id={player_id}")
    if not game_id or not player_id:
        await sio.emit('error', {'message': 'Missing game_id or player_id'}, to=sid)
        return
    game_manager.sid_to_game[sid] = game_id
    sio.enter_room(sid, game_id)
    if game_id not in game_manager.games:
        game_manager.games[game_id] = {
            'players': [{'id': player_id, 'name': player_id, 'piece': '🚗', 'position': 0, 'balance': 1500,
                         'properties': [], 'side': 'bottom', 'inJail': False, 'jailTurns': 0, 'getOutOfJailFree': 0,
                         'bankrupt': False}],
            'currentPlayer': player_id,
            'properties': []
        }
    else:
        game_manager.games[game_id]['players'].append({
            'id': player_id, 'name': player_id, 'piece': '🐶', 'position': 0, 'balance': 1500,
            'properties': [], 'side': 'top', 'inJail': False, 'jailTurns': 0, 'getOutOfJailFree': 0, 'bankrupt': False
        })
    await sio.emit('game_state', game_manager.games[game_id], room=game_id)
    logger.debug(f"Player {player_id} joined game {game_id}")

@sio.event
async def roll_dice(sid, data):
    logger.debug(f"Roll dice request: sid={sid}, data={data}")
    
    # Get game_id directly from the request data
    game_id = data.get('game_id')
    player_id = data.get('player_id')
    
    if not game_id or not player_id:
        logger.error(f"Missing game_id or player_id: {data}")
        await sio.emit('error', {'message': 'Missing game_id or player_id'}, to=sid)
        return
    
    if game_id not in game_manager.games:
        logger.error(f"Game not found: {game_id}")
        await sio.emit('error', {'message': f'Game {game_id} not found'}, to=sid)
        return
    
    game_state = game_manager.games[game_id]
    
    # Check if player exists in the game
    player_exists = any(p['id'] == player_id for p in game_state['players'])
    if not player_exists:
        logger.error(f"Player not in game: {player_id}")
        await sio.emit('error', {'message': f'Player {player_id} not in game'}, to=sid)
        return
    
    if player_id != game_state['currentPlayer']:
        logger.error(f"Not your turn: player_id={player_id}, currentPlayer={game_state['currentPlayer']}")
        await sio.emit('error', {'message': 'Not your turn'}, to=sid)
        return
    
    # Update the sid mapping (in case it was lost)
    game_manager.sid_to_game[sid] = game_id
    
    diceOne = random.randint(1, 6)
    diceTwo = random.randint(1, 6)
    logger.debug(f"Dice rolled: {diceOne}, {diceTwo}")
    
    # Emit dice result first
    await sio.emit('dice_result', {'diceOne': diceOne, 'diceTwo': diceTwo}, room=game_id)
    
    # Then update current player (only if not doubles)
    if diceOne != diceTwo:
        current_idx = [p['id'] for p in game_state['players']].index(game_state['currentPlayer'])
        game_state['currentPlayer'] = game_state['players'][(current_idx + 1) % len(game_state['players'])]['id']
        
        # Emit updated game state after changing current player
        await sio.emit('game_state', game_state, room=game_id)
    
    logger.debug(f"Emitted dice_result and game_state to room {game_id}")

@sio.event
async def join_game(sid, data):
    game_id = data.get('game_id')
    player_id = data.get('player_id')
    logger.debug(f"Join request: sid={sid}, game_id={game_id}, player_id={player_id}")
    
    if not game_id or not player_id:
        await sio.emit('error', {'message': 'Missing game_id or player_id'}, to=sid)
        return
    
    # Update the mapping
    game_manager.sid_to_game[sid] = game_id
    sio.enter_room(sid, game_id)
    
    if game_id not in game_manager.games:
        # Create new game
        game_manager.games[game_id] = {
            'players': [{'id': player_id, 'name': player_id, 'piece': '🚗', 'position': 0, 'balance': 1500,
                         'properties': [], 'side': 'bottom', 'inJail': False, 'jailTurns': 0, 'getOutOfJailFree': 0,
                         'bankrupt': False}],
            'currentPlayer': player_id,
            'properties': []
        }
        logger.debug(f"Created new game {game_id} with player {player_id}")
    else:
        # Check if player already exists
        existing_player = next((p for p in game_manager.games[game_id]['players'] if p['id'] == player_id), None)
        if not existing_player:
            # Add new player
            game_manager.games[game_id]['players'].append({
                'id': player_id, 'name': player_id, 'piece': '🐶', 'position': 0, 'balance': 1500,
                'properties': [], 'side': 'top', 'inJail': False, 'jailTurns': 0, 'getOutOfJailFree': 0, 'bankrupt': False
            })
            logger.debug(f"Added player {player_id} to existing game {game_id}")
        else:
            logger.debug(f"Player {player_id} rejoined game {game_id}")
    
    await sio.emit('game_state', game_manager.games[game_id], room=game_id)
    logger.debug(f"Player {player_id} joined game {game_id}")

@sio.event
async def disconnect(sid):
    logger.debug(f"Client disconnected: {sid}")
    # Clean up the mapping
    if sid in game_manager.sid_to_game:
        del game_manager.sid_to_game[sid]

@app.post("/roll_dice")
async def roll_dice(sid: str, data: dict):
    diceOne = random.randint(1, 6)
    diceTwo = random.randint(1, 6)
    return DiceState(diceOne=diceOne, diceTwo=diceTwo)

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