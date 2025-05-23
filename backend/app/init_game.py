
# monopoly-backend/init_game.py
from database import SessionLocal, Base, engine
from crud import create_game, create_player, create_property
from schemas.game import GameCreate
from schemas.player import PlayerCreate
from schemas.property import PropertyCreate

def init_game():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Create game
        game = create_game(db, GameCreate(name="Monopoly Game"))
        
        # Create Player 1
        player = create_player(db, PlayerCreate(
            name="Player 1",
            piece="Thimble",
            balance=15000000.0,
            side="bottom"
        ), game.id)
        
        # Create purple properties
        purple_properties = [
            PropertyCreate(
                name="St. Charles Place",
                pos=11,
                type="property",
                group="purple",
                color="purple",
                price=140,
                house_cost=50,
                owner_id=player.id
            ),
            PropertyCreate(
                name="States Avenue",
                pos=13,
                type="property",
                group="purple",
                color="purple",
                price=140,
                house_cost=50,
                owner_id=player.id
            ),
            PropertyCreate(
                name="Virginia Avenue",
                pos=14,
                type="property",
                group="purple",
                color="purple",
                price=160,
                house_cost=50,
                owner_id=player.id
            ),
        ]
        
        for prop in purple_properties:
            create_property(db, prop, game.id)
        
        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    init_game()
