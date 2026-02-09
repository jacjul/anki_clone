# PowerShell -ExecutionPolicy Bypass -File "C:\Users\ASUS\projekte\react_1\anki_clone\run_api.ps1"

from flask import Flask, request, jsonify
from flask_cors import CORS
from .database import db
from .models import Card, Deck
from .spaced_rep import review_db_card
from sqlalchemy import inspect, and_
from .gemini_api import get_sentence
import os 
from datetime import datetime
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
@app.route("/api/cards/<deck_id>", methods=["GET"])
def get_all_card(deck_id=None):
    if deck_id:
        deck_id = int(deck_id)
        cards = Card.query.filter(and_(Card.deck_id ==deck_id, Card.next_review < datetime.utcnow())).all()
    else:
        cards = Card.query.all()
    cards_json = list(map(lambda x: x.to_dict(), cards))
    return (jsonify({"message": cards_json}))

@app.route("/api/set_card/<int:with_sentence>", methods=["POST"])
def create_card(with_sentence):
    with_sentence = bool(with_sentence)
    front = request.json.get("front")
    back = request.json.get("back")
    description = request.json.get("description")
    difficulty = 2.0
    deck_id= request.json.get("deck_id")

    last_reviewed = datetime.utcnow()
    next_review = datetime.utcnow()



    if not front or not back:
        return (jsonify({"message": "The import was unseccesful"}))
    
    if with_sentence:
        text = get_sentence(front, "german")
        print(text)
        try:
            new_card = Card(front=front,front_sentence=text[0], back=back,back_sentence=text[1], description=description,difficulty=difficulty, deck_id=deck_id)
        except Exception as e:
            print(f"Couldnt import sentences as expected bevause of {e} instead normal import without sentences")
            new_card = Card(front=front, back=back, description=description,difficulty=difficulty, deck_id=deck_id)

    else:
        new_card = Card(front=front, back=back, description=description,difficulty=difficulty, deck_id=deck_id)
    
    try: 
        db.session.add(new_card)
        db.session.commit()
        return (jsonify({"message": "Card created successfully"}), 201)
    except Exception as e:
        return (jsonify({"message": f"An error ocurred {e}"}), 400)
"""
@app.route("/api/set_card/<int:id>/<difficulty>", methods=["POST"])
def update_difficulty(id, difficulty):
    difficulty = float(difficulty)
    card = Card.query.filter_by(id = id).first()
    if card is None:
        return(jsonify({"message":"Card does not exist"}),404)
    
    card.difficulty = difficulty

    try:
        db.session.commit()
        return(jsonify({"message":"Card difficulty updated succesfully"}))
    except Exception as e:
        db.session.rollback()
        return(jsonify({"message": f"Following error occured {e}"}))
    """
@app.route("/api/set_card/<int:id>/<difficulty>", methods =["POST"])
def set_card_review(id, difficulty):
 
    card = Card.query.get(id)
    if card is None:
        return jsonify({"message": "Card not found"}), 404

    try:
        due, _snapshot = review_db_card(card, str(difficulty))
        db.session.commit()
        return jsonify({
            "message": "Card reviewed",
            "nextReview": due.isoformat(),
            "card": card.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error reviewing card: {e}"}), 400

@app.route("/api/cards/<int:id>/review", methods=["POST"])
def review_card(id: int):
    card = Card.query.get(id)
    if card is None:
        return jsonify({"message": "Card not found"}), 404

    payload = request.get_json(silent=True) or {}
    rating = payload.get("rating", "Good")  # Again | Hard | Good | Easy

    print(payload)
    try:
        due, snapshot = review_db_card(card, rating)
        db.session.commit()
        return jsonify({
            "message": "Card reviewed",
            "nextReview": due.isoformat(),
            "card": card.to_dict(),
            "snapshot": {**snapshot, "nextReview": due.isoformat(), "lastReviewed": card.last_reviewed.isoformat()}
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error reviewing card: {e}"}), 400


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





    

