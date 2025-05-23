from sqlalchemy.orm import Session
from models.game import Game
from models.player import Player
from models.property import Property
from schemas.game import GameCreate
from schemas.player import PlayerCreate
from schemas.property import PropertyCreate

def create_game(db: Session, game: GameCreate):
    db_game = Game(name=game.name)
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game

def get_game(db: Session, game_id: int):
    return db.query(Game).filter(Game.id == game_id).first()

def create_player(db: Session, player: PlayerCreate, game_id: int):
    db_player = Player(**player.dict(), game_id=game_id)
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player

def get_player(db: Session, player_id: int):
    return db.query(Player).filter(Player.id == player_id).first()

def create_property(db: Session, property: PropertyCreate, game_id: int):
    db_property = Property(**property.dict(), game_id=game_id)
    db.add(db_property)
    db.commit()
    db.refresh(db_property)
    return db_property

def get_property(db: Session, property_id: int):
    return db.query(Property).filter(Property.id == property_id).first()

def buy_house(db: Session, player_id: int, property_id: int):
    player = get_player(db, player_id)
    property = get_property(db, property_id)
    if not player or not property or property.owner_id != player_id:
        return None
    house_cost = property.house_cost or 100
    if property.houses >= 4 or player.balance < house_cost:
        return None
    property.houses += 1
    player.balance -= house_cost
    db.commit()
    db.refresh(property)
    db.refresh(player)
    return property