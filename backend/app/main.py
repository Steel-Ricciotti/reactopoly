# from fastapi import FastAPI
# from socketio import AsyncServer, ASGIApp
# import logging

# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)

# app = FastAPI()
# sio = AsyncServer(async_mode='asgi', cors_allowed_origins='http://localhost:3000')
# app.mount("/", ASGIApp(sio))

# class GameManager:
#     games = {}  # game_id: {player1Score: int, player2Score: int, players: set}

# game_manager = GameManager()

# @sio.event
# async def connect(sid, environ):
#     logger.debug(f"Client connected: {sid}")

# @sio.event
# async def join_game(sid, data):
#     game_id = data.get('game_id')
#     player_id = data.get('player_id')
#     logger.debug(f"Join request: sid={sid}, game_id={game_id}, player_id={player_id}")
#     if not game_id or not player_id:
#         await sio.emit('error', {'message': 'Missing game_id or player_id'}, to=sid)
#         return
#     if player_id not in ['player1', 'player2']:
#         await sio.emit('error', {'message': 'Invalid player_id'}, to=sid)
#         return
#     await sio.enter_room(sid, game_id)
#     if game_id not in game_manager.games:
#         game_manager.games[game_id] = {'player1Score': 0, 'player2Score': 0, 'players': set()}
#     if player_id in game_manager.games[game_id]['players']:
#         await sio.emit('error', {'message': f'{player_id} already in game'}, to=sid)
#         return
#     game_manager.games[game_id]['players'].add(player_id)
#     await sio.emit('game_state', {
#         'player1Score': game_manager.games[game_id]['player1Score'],
#         'player2Score': game_manager.games[game_id]['player2Score']
#     }, room=game_id)
#     logger.debug(f"Player {player_id} joined game {game_id}, emitted game_state")

# @sio.event
# async def increment_score(sid, data):
#     game_id = data.get('game_id')
#     player_id = data.get('player_id')
#     logger.debug(f"Increment score request: sid={sid}, game_id={game_id}, player_id={player_id}")
#     if not game_id or game_id not in game_manager.games:
#         await sio.emit('error', {'message': 'Invalid game'}, to=sid)
#         return
#     if player_id not in ['player1', 'player2']:
#         await sio.emit('error', {'message': 'Invalid player_id'}, to=sid)
#         return
#     if player_id not in game_manager.games[game_id]['players']:
#         await sio.emit('error', {'message': f'{player_id} not in game'}, to=sid)
#         return
#     if player_id == 'player1':
#         game_manager.games[game_id]['player1Score'] += 1
#     else:
#         game_manager.games[game_id]['player2Score'] += 1
#     await sio.emit('game_state', {
#         'player1Score': game_manager.games[game_id]['player1Score'],
#         'player2Score': game_manager.games[game_id]['player2Score']
#     }, room=game_id)
#     logger.debug(f"Updated scores for game {game_id}: {game_manager.games[game_id]}, emitted game_state")

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

# @sio.event
# async def join_game(sid, data):
#     game_id = data.get('game_id')
#     player_id = data.get('player_id')
#     logger.debug(f"Join request: sid={sid}, game_id={game_id}, player_id={player_id}")
#     if not game_id or not player_id:
#         await sio.emit('error', {'message': 'Missing game_id or player_id'}, to=sid)
#         return
#     game_manager.sid_to_game[sid] = game_id
#     sio.enter_room(sid, game_id)
#     if game_id not in game_manager.games:
#         game_manager.games[game_id] = {
#             'players': [{'id': player_id, 'name': player_id, 'piece': '🚗', 'position': 0, 'balance': 1500,
#                          'properties': [], 'side': 'bottom', 'inJail': False, 'jailTurns': 0, 'getOutOfJailFree': 0,
#                          'bankrupt': False}],
#             'currentPlayer': player_id,
#             'properties': []
#         }
#     else:
#         game_manager.games[game_id]['players'].append({
#             'id': player_id, 'name': player_id, 'piece': '🐶', 'position': 0, 'balance': 1500,
#             'properties': [], 'side': 'top', 'inJail': False, 'jailTurns': 0, 'getOutOfJailFree': 0, 'bankrupt': False
#         })
#     await sio.emit('game_state', game_manager.games[game_id], room=game_id)
#     logger.debug(f"Player {player_id} joined game {game_id}")

@sio.event
async def roll_dice(sid, data):
    game_id = data.get('game_id')
    player_id = data.get('player_id')
    logger.debug(f"Roll dice request: sid={sid}, game_id={game_id}, player_id={player_id}")
    
    # # Validate inputs (like your working code does)
    # if not game_id or not player_id:
    #     await sio.emit('error', {'message': 'Missing game_id or player_id'}, to=sid)
    #     return
    
    # Don't override game_id! Use the one from the client
    # game_id = 1  ← REMOVE THIS LINE
    
    # Generate dice values
    diceOne = random.randint(1, 6)
    diceTwo = random.randint(1, 6)
    
    # Emit to the correct room (the one the client actually joined)
    await sio.emit('dice_result', {
        'diceOne': diceOne, 
        'diceTwo': diceTwo
    })
    
    logger.debug(f"Emitted dice_result {diceOne}, {diceTwo} to room {game_id}")

# Also make sure your join_game creates games with the right game_id:
@sio.event
async def join_game(sid, data):
    game_id = data.get('game_id')
    player_id = data.get('player_id')
    
    if not game_id or not player_id:
        await sio.emit('error', {'message': 'Missing game_id or player_id'}, to=sid)
        return
    
    await sio.enter_room(sid, game_id)
    
    # Create or join game using the ACTUAL game_id from client
    if game_id not in game_manager.games:
        game_manager.games[game_id] = {
            'players': [player_id],  # Simplified
            'dice_values': [1, 1]
        }
    
    await sio.emit('joined_game', {'message': f'Joined game {game_id}'}, room=game_id)
    logger.debug(f"Player {player_id} joined game {game_id}")

@sio.event
async def disconnect(sid):
    logger.debug(f"Client disconnected: {sid}")
    # Clean up the mapping
    if sid in game_manager.sid_to_game:
        del game_manager.sid_to_game[sid]

@app.post("/roll_dice2")
async def roll_dice2(sid: str, data: dict):
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