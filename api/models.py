from .database import db 
from datetime import datetime 
class Base(db.Model):
    __abstract__ =True

    id = db.Column(db.Integer,primary_key=True)
    last_reviewed =db.Column(db.DateTime, default=datetime.utcnow)
    next_review = db.Column(db.DateTime, nullable=True)


    def to_dict(self):
        return {"id": self.id }
    
class Card(Base):

    __tablename__ ="card"

    front = db.Column(db.String(100), unique=True, nullable=False)
    front_sentence = db.Column(db.Text, nullable= True)
    back = db.Column(db.String(100), nullable=False)
    back_sentence = db.Column(db.Text, nullable= True)
    description =db.Column(db.Text, nullable=True )
    difficulty = db.Column(db.Float, nullable=False)
    # FSRS-related tracking fields
    stability = db.Column(db.Float, default=0.1)
    reps = db.Column(db.Integer, default=0)
    lapses = db.Column(db.Integer, default=0)
    # Fix default to function (no parentheses) to avoid static timestamp
    last_reviewed = db.Column(db.DateTime, default=datetime.utcnow)
    next_review = db.Column(db.DateTime, nullable=True)
    deck_id = db.Column(db.Integer, db.ForeignKey('deck.id', ondelete="CASCADE"))

    def to_dict(self):
        data = super().to_dict()

        data.update({
            "front": self.front,
            "frontSentence": self.front_sentence,
            "back": self.back,
            "backSentence": self.back_sentence,
            "description": self.description,
            "difficulty": self.difficulty,
            "stability": self.stability,
            "reps": self.reps,
            "lapses": self.lapses,
            "lastReviewed": self.last_reviewed,
            "nextReview": self.next_review,
        })
        return (data)
    
class Deck(Base):

    __tablename__ = "deck"

    name =db.Column(db.String(50), unique =True, nullable=False)
    cards =db.relationship("Card", backref="deck", lazy="dynamic" , cascade="all, delete-orphan", passive_deletes=True)