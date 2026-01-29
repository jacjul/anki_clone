from database import db 
from datetime import datetime 
class Base(db.Model):
    __abstract__ =True

    id = db.Column(db.Integer,primary_key=True)


    def to_dict(self):
        return {"id": self.id }
    
class Card(Base):

    __tablename__ ="card"

    front = db.Column(db.String(100), unique=True, nullable=False)
    back = db.Column(db.String(100), nullable=False)
    description =db.Column(db.Text, nullable=True )
    deck_id = db.Column(db.Integer, db.ForeignKey('deck.id', ondelete="CASCADE"))

    def to_dict(self):
        data = super().to_dict()

        data.update({"front":self.front , "back":self.back, "description" :self.description})
        return (data)
    
class Deck(Base):

    __tablename__ = "deck"

    name =db.Column(db.String(50), unique =True, nullable=False)
    cards =db.relationship("Card", backref="deck", lazy="dynamic" , cascade="all, delete-orphan", passive_deletes=True)