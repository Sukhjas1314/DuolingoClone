from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.all import User, Course, Lesson, Exercise
from app.schemas.all import UserSchema, PathSchema, LessonSchema, CheckAnswerRequest, CheckAnswerResponse, LessonCompleteRequest, LessonSummaryResponse, LeaderboardEntry, ShopPurchaseRequest, ShopPurchaseResponse
from app.services.game_service import process_lesson_completion
from app.config import settings

router = APIRouter()

def get_current_user_id(x_user_id: int = Header(1)):
    return x_user_id

@router.get("/me", response_model=UserSchema)
def get_me(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    from app.services.game_service import regenerate_hearts
    regenerate_hearts(user.stats)
    
    from app.models.all import UserAchievement, Achievement
    user_ach = db.query(Achievement.code).join(UserAchievement).filter(UserAchievement.user_id == user_id).all()
    achievements = [a[0] for a in user_ach]
    
    db.commit()
    
    user_dict = {
        "id": user.id,
        "username": user.username,
        "display_name": user.display_name,
        "avatar": user.avatar,
        "stats": user.stats,
        "achievements": achievements
    }
    
    return user_dict

@router.get("/course/path", response_model=PathSchema)
def get_path(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    # Naive fetching for Phase 2.
    course = db.query(Course).first()
    if not course:
        return PathSchema(units=[])
    
    # Attach user progress to skills
    from app.models.all import UserSkillProgress
    progress = db.query(UserSkillProgress).filter(UserSkillProgress.user_id == user_id).all()
    progress_map = {p.skill_id: p for p in progress}
    
    # Clone structure to modify schemas
    units_data = []
    for unit in course.units:
        skills_data = []
        for skill in unit.skills:
            prog = progress_map.get(skill.id)
            skill_dict = {
                "id": skill.id,
                "title": skill.title,
                "icon": skill.icon,
                "total_levels": skill.total_levels,
                "status": prog.status if prog else "locked",
                "levels_completed": prog.levels_completed if prog else 0,
                "crowns": prog.crowns if prog else 0,
            }
            skills_data.append(skill_dict)
        
        unit_dict = {
            "id": unit.id,
            "title": unit.title,
            "description": unit.description,
            "color": unit.color,
            "skills": skills_data
        }
        units_data.append(unit_dict)
        
    return PathSchema(units=units_data)

@router.get("/lessons/{lesson_id}", response_model=LessonSchema)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson

@router.get("/skills/{skill_id}/lesson", response_model=LessonSchema)
def get_lesson_by_skill(skill_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.skill_id == skill_id).first()
    if not lesson:
        # Fallback to the very first lesson so that practice nodes don't 404
        lesson = db.query(Lesson).first()
        if not lesson:
            raise HTTPException(status_code=404, detail="No lessons found in database")
    return lesson

@router.post("/exercises/{exercise_id}/check", response_model=CheckAnswerResponse)
def check_answer(exercise_id: int, req: CheckAnswerRequest, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
        
    correct = (req.user_answer.strip().lower() == exercise.correct_answer.strip().lower())
    
    user = db.query(User).filter(User.id == user_id).first()
    
    if not correct and user.stats.hearts > 0:
        user.stats.hearts -= 1
        db.commit()
    
    return CheckAnswerResponse(
        correct=correct,
        correct_answer=exercise.correct_answer,
        hearts_remaining=user.stats.hearts,
        explanation=None
    )

@router.post("/lessons/{lesson_id}/complete", response_model=LessonSummaryResponse)
def complete_lesson(lesson_id: int, req: LessonCompleteRequest, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return process_lesson_completion(db, user_id, lesson_id, req, settings.simulated_date_offset)
    
@router.post("/dev/simulate-day")
def simulate_day(req: dict, db: Session = Depends(get_db)):
    days = req.get("days", 1)
    settings.simulated_date_offset += days
    return {"message": f"Simulated date advanced by {days} days"}

@router.post("/dev/reset")
def reset_progress(db: Session = Depends(get_db)):
    from app.seed.seed import seed_db
    from app.db import Base, engine
    
    # Close active connections (session) so drop_all doesn't lock
    db.close()
    
    # Run the seed script which handles dropping and recreating tables
    seed_db()
    
    return {"message": "Database reset and re-seeded"}

@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    from app.models.all import UserStats
    users = db.query(User).join(UserStats).order_by(UserStats.xp_today.desc()).all()
    results = []
    for idx, u in enumerate(users):
        results.append(LeaderboardEntry(
            user_id=u.id,
            username=u.username,
            display_name=u.display_name,
            avatar=u.avatar,
            weekly_xp=u.stats.xp_today,
            rank=idx + 1
        ))
    return results

@router.post("/settings/goal")
def set_daily_goal(req: dict, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    goal = req.get("goal", 50)
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.stats.daily_xp_goal = goal
        db.commit()
    return {"message": "Goal updated"}

@router.post("/shop/purchase", response_model=ShopPurchaseResponse)
def purchase_item(req: ShopPurchaseRequest, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    prices = {
        "heart_refill": 350,
        "streak_freeze": 200,
        "double_xp": 100
    }
    
    price = prices.get(req.item_code)
    if not price:
        raise HTTPException(status_code=400, detail="Invalid item code")
        
    if user.stats.gems < price:
        raise HTTPException(status_code=400, detail="Insufficient gems")
        
    user.stats.gems -= price
    
    if req.item_code == "heart_refill":
        user.stats.hearts = 5
    elif req.item_code == "streak_freeze":
        pass # To be implemented fully if requested, but for now we mock the deduction
        
    db.commit()
    return ShopPurchaseResponse(
        success=True,
        message="Purchase successful",
        new_gems=user.stats.gems,
        new_hearts=user.stats.hearts
    )
