import pytest
from datetime import date, timedelta
from app.db import Base, engine, SessionLocal
from app.models.all import User, UserStats, Course, Unit, Skill, Lesson, UserSkillProgress, SkillStatus
from app.schemas.all import LessonCompleteRequest
from app.services.game_service import evaluate_streak, regenerate_hearts, process_lesson_completion
from datetime import datetime

@pytest.fixture(scope="module")
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    yield db
    Base.metadata.drop_all(bind=engine)
    db.close()

def test_evaluate_streak(setup_db):
    db = setup_db
    
    # Create user
    user = User(username="test", display_name="Test")
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create stats
    stats = UserStats(user_id=user.id, current_streak=5, longest_streak=5, last_activity_date=date.today() - timedelta(days=1))
    db.add(stats)
    db.commit()
    
    # Test active yesterday -> increment
    streak, inc = evaluate_streak(db, user.id, date.today())
    assert streak == 6
    assert inc == True
    
    # Test active today -> no increment
    streak, inc = evaluate_streak(db, user.id, date.today())
    assert streak == 6
    assert inc == False
    
    # Test gap > 1 day -> reset
    stats.last_activity_date = date.today() - timedelta(days=2)
    db.commit()
    streak, inc = evaluate_streak(db, user.id, date.today())
    assert streak == 1
    assert inc == True

def test_regenerate_hearts():
    stats = UserStats(hearts=3, hearts_updated_at=datetime.utcnow() - timedelta(minutes=10))
    hearts = regenerate_hearts(stats)
    assert hearts == 5
    
    stats2 = UserStats(hearts=4, hearts_updated_at=datetime.utcnow() - timedelta(minutes=6))
    hearts2 = regenerate_hearts(stats2)
    assert hearts2 == 5

def test_process_lesson_completion(setup_db):
    db = setup_db
    user = db.query(User).first()
    
    course = Course(code="fr", name="French")
    db.add(course)
    db.commit()
    
    unit = Unit(course_id=course.id, order_index=1, title="U1")
    db.add(unit)
    db.commit()
    
    skill = Skill(unit_id=unit.id, order_index=1, total_levels=2)
    db.add(skill)
    db.commit()
    
    lesson = Lesson(skill_id=skill.id)
    db.add(lesson)
    db.commit()
    
    req = LessonCompleteRequest(xp_earned=0, accuracy=1.0, hearts_lost=0)
    res = process_lesson_completion(db, user.id, lesson.id, req)
    
    assert res.xp_earned == 15 # 10 base + 5 for 0 hearts lost
    assert res.skill_completed == False
    
    # Check skill progress
    prog = db.query(UserSkillProgress).filter_by(skill_id=skill.id).first()
    assert prog.levels_completed == 1
    
    # Complete again to finish skill
    res2 = process_lesson_completion(db, user.id, lesson.id, req)
    assert res2.skill_completed == True
    
    prog2 = db.query(UserSkillProgress).filter_by(skill_id=skill.id).first()
    assert prog2.status == SkillStatus.completed
    assert prog2.crowns == 1
