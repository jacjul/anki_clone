# PowerShell -ExecutionPolicy Bypass -File "C:\Users\ASUS\projekte\react_1\anki_clone\run_api.ps1"

from flask import Flask, request, jsonify
from flask_cors import CORS
from .database import db
from .models import Card, Deck
from sqlalchemy import inspect
import os 
app = Flask(__name__)

CORS(app)
#basedir = os.path.abspath(os.path.dirname(__file__))

os.makedirs(app.instance_path, exist_ok=True)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(app.instance_path, "testdb.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
with app.app_context():
    db.create_all()
   

@app.route("/", methods=["GET"])
def hello_world():
    return(jsonify({"message":"Test"}))

@app.route("/api/cards", methods=["GET"])
def get_all_card():
    cards = Card.query.all()
    cards_json = map(lambda x: x.to_dict(), cards)
    return (jsonify({"cards": cards_json}))

@app.route("/api/set_card", methods=["POST"])
def create_card():
    front = request.json.get("front")
    back = request.json.get("back")
    description = request.json.get("description")
    deck_id= request.json.get("deck_id")

    if not front or not back:
        return (jsonify({"message": "The import was unseccesful"}))
    
    new_card = Card(front=front, back=back, description=description, deck_id=deck_id)
    
    try: 
        db.session.add(new_card)
        db.session.commit()
        return (jsonify({"message": "Card created successfully"}), 201)
    except Exception as e:
        return (jsonify({"message": f"An error ocurred {e}"}), 400)

@app.route("/api/decks", methods=["GET", "POST"])
def create_select_deck():
    if request.method =="GET":
        decks = Deck.query.all()
        return jsonify({"message": [{"id":d.id ,"name": d.name} for d in decks]})
        
    
    elif request.method =="POST":
        name = request.json.get("name")
        new_deck = Deck(name=name)
        try:
            db.session.add(new_deck)
            db.session.commit()
            return (jsonify({"message": "Deck created successfully"}), 201)
        except Exception as e:
            return (jsonify({"message": f"following error occured {e}"}),400 )
            
    else:
        return(jsonify({"message":"test"}))


@app.route("/api/decks/<int:id>", methods=["POST"])  # keeping POST to match frontend
def delete_deck(id):
    deck = Deck.query.get(id)
    if deck is None:
        return jsonify({"message": f"Deck {id} not found"}), 404

    try:
        # Check if 'deck_id' column exists to avoid OperationalError on legacy schemas
        inspector = inspect(db.engine)
        card_columns = [col['name'] for col in inspector.get_columns('card')]
        if 'deck_id' in card_columns:
            Card.query.filter_by(deck_id=id).delete(synchronize_session=False)

        # Delete the deck itself
        db.session.delete(deck)
        db.session.commit()
        return jsonify({"message": f"Deck {id} deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Deck couldn't be deleted: {e}"}), 400


if __name__ == "__main__":
    app.run(debug=True)





    

