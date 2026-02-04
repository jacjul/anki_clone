from .database import db 
from datetime import datetime 
class Base(db.Model):
    __abstract__ =True

    id = db.Column(db.Integer,primary_key=True)


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
    deck_id = db.Column(db.Integer, db.ForeignKey('deck.id', ondelete="CASCADE"))

    def to_dict(self):
        data = super().to_dict()

        data.update({"front":self.front , "front_sentence":self.front_sentence, "back":self.back, "back_sentence":self.back_sentence, "description" :self.description, "difficulty":self.difficulty})
        return (data)
    
class Deck(Base):

    __tablename__ = "deck"

    name =db.Column(db.String(50), unique =True, nullable=False)
    cards =db.relationship("Card", backref="deck", lazy="dynamic" , cascade="all, delete-orphan", passive_deletes=True)