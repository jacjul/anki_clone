from datetime import datetime, timedelta, timezone
from typing import Tuple
from fsrs import Scheduler, Card as FSRSCard, Rating

# Bridge FSRS with Flask SQLAlchemy Card model
def review_db_card(db_card, rating_str: str) -> Tuple[datetime, dict]:
    """
    Apply FSRS review to a DB card using rating string (e.g., "Again", "Hard", "Good", "Easy").
    Updates the db_card fields in-place and returns (due_datetime, snapshot_dict).
    """
    scheduler = Scheduler()

    # Map DB -> FSRS card
    fsrs_card = FSRSCard()
    # Seed available attributes safely
    fsrs_card.due = db_card.next_review or datetime.utcnow()
    fsrs_card.stability = getattr(db_card, "stability", None) or 0.1
    fsrs_card.difficulty = getattr(db_card, "difficulty", None) or 5.0
    fsrs_card.reps = getattr(db_card, "reps", None) or 0
    fsrs_card.lapses = getattr(db_card, "lapses", None) or 0

    # Convert rating string to FSRS Rating enum
    try:
        rating_enum = getattr(Rating, rating_str)
    except AttributeError:
        rating_enum = Rating.Good

    updated_card, _log = scheduler.review_card(fsrs_card, rating_enum)

    # Immediate re-show for Again/Hard: force due to now so it stays due
    if rating_enum.name in ("Again", "Hard"):
        override_due = datetime.utcnow()
    else:
        override_due = None

    # Optional acceleration: once quality is good enough, boost the interval for Good/Easy
    # Define "good enough" as having a minimum number of reps or lower difficulty or higher stability
    good_enough = (updated_card.reps >= 3) or (updated_card.difficulty <= 3.0) or (updated_card.stability >= 2.0)

    # Normalize FSRS due to UTC-naive to avoid mixing aware/naive datetimes
    due_dt = updated_card.due
    if isinstance(due_dt, datetime) and due_dt.tzinfo is not None and due_dt.tzinfo.utcoffset(due_dt) is not None:
        # Convert to UTC and drop tzinfo to store as naive UTC
        due_dt = due_dt.astimezone(timezone.utc).replace(tzinfo=None)

    # Apply override for Again/Hard so the card is immediately due
    if override_due is not None:
        due_dt = override_due
    if good_enough:
        base_interval = due_dt - datetime.utcnow()
        # Only boost for positive intervals
        if base_interval.total_seconds() > 0:
            if rating_enum.name == "Easy":
                factor = 1.5  # bigger jump for Easy
                due_dt = datetime.utcnow() + timedelta(seconds=base_interval.total_seconds() * factor)
            elif rating_enum.name == "Good":
                factor = 1.2  # moderate jump for Good
                due_dt = datetime.utcnow() + timedelta(seconds=base_interval.total_seconds() * factor)

    # Map FSRS -> DB
    db_card.last_reviewed = datetime.utcnow()
    db_card.next_review = due_dt
    db_card.stability = updated_card.stability
    db_card.difficulty = updated_card.difficulty
    db_card.reps = updated_card.reps
    db_card.lapses = updated_card.lapses

    snapshot = {
        "nextReview": db_card.next_review,
        "lastReviewed": db_card.last_reviewed,
        "stability": db_card.stability,
        "difficulty": db_card.difficulty,
        "reps": db_card.reps,
        "lapses": db_card.lapses,
    }
    return db_card.next_review, snapshot

if __name__ == "__main__":
    # Minimal local test using FSRS standalone card
    fsrs_card = FSRSCard()
    sched = Scheduler()
    updated, _ = sched.review_card(fsrs_card, Rating.Good)
    print("Standalone FSRS next due:", updated.due)