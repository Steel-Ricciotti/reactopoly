# # monopoly-backend/main.py
# from fastapi import FastAPI, Depends, HTTPException
# from sqlalchemy.orm import Session
# from schemas.game import Game, GameCreate
# from schemas.player import Player, PlayerCreate
# from schemas.property import Property, PropertyCreate
# from crud import create_game, get_game, create_player, get_player, create_property, get_property, buy_house
# from database import Base, engine, get_db

# app = FastAPI()

# # Create database tables
# Base.metadata.create_all(bind=engine)

# @app.post("/games/", response_model=Game)
# def create_new_game(game: GameCreate, db: Session = Depends(get_db)):
#     return create_game(db, game)

# @app.get("/games/{game_id}", response_model=Game)
# def read_game(game_id: int, db: Session = Depends(get_db)):
#     db_game = get_game(db, game_id)
#     if db_game is None:
#         raise HTTPException(status_code=404, detail="Game not found")
#     return db_game

# @app.post("/games/{game_id}/players/", response_model=Player)
# def create_new_player(game_id: int, player: PlayerCreate, db: Session = Depends(get_db)):
#     db_game = get_game(db, game_id)
#     if db_game is None:
#         raise HTTPException(status_code=404, detail="Game not found")
#     return create_player(db, player, game_id)

# @app.get("/players/{player_id}", response_model=Player)
# def read_player(player_id: int, db: Session = Depends(get_db)):
#     db_player = get_player(db, player_id)
#     if db_player is None:
#         raise HTTPException(status_code=404, detail="Player not found")
#     return db_player

# @app.post("/games/{game_id}/properties/", response_model=Property)
# def create_new_property(game_id: int, property: PropertyCreate, db: Session = Depends(get_db)):
#     db_game = get_game(db, game_id)
#     if db_game is None:
#         raise HTTPException(status_code=404, detail="Game not found")
#     return create_property(db, property, game_id)

# @app.get("/properties/{property_id}", response_model=Property)
# def read_property(property_id: int, db: Session = Depends(get_db)):
#     db_property = get_property(db, property_id)
#     if db_property is None:
#         raise HTTPException(status_code=404, detail="Property not found")
#     return db_property

# @app.post("/players/{player_id}/properties/{property_id}/buy-house", response_model=Property)
# def buy_house_endpoint(player_id: int, property_id: int, db: Session = Depends(get_db)):
#     property = buy_house(db, player_id, property_id)
#     if property is None:
#         raise HTTPException(status_code=400, detail="Cannot buy house")
#     return property

from fastapi import FastAPI
from api.endpoints import router
from database import Base, engine

app = FastAPI()
app.include_router(router)
Base.metadata.create_all(bind=engine)