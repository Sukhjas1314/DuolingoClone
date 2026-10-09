from sqlalchemy.orm import Session
from datetime import date, timedelta, datetime
from app.models.all import UserStats, DailyActivity, UserLessonCompletion, UserSkillProgress, SkillStatus, Skill, Lesson, Achievement, UserAchievement
from app.schemas.all import LessonCompleteRequest, LessonSummaryResponse
import math

def get_today(simulated_offset: int = 0) -> date:
    return date.today() + timedelta(days=simulated_offset)

def evaluate_streak(db: Session, user_id: int, today: date) -> tuple[int, bool]:
    stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
    if not stats:
        return 0, False
    
    last_date = stats.last_activity_date
    streak = stats.current_streak
    incremented = False
    
    if last_date == today:
        pass
    elif last_date == today - timedelta(days=1):
        streak += 1
        incremented = True
    else:
        # If last_date is None or gap > 1
        streak = 1
        incremented = True
        
    stats.current_streak = streak
    stats.last_activity_date = today
    if streak > stats.longest_streak:
        stats.longest_streak = streak
        
    return streak, incremented

def regenerate_hearts(stats: UserStats) -> int:
    if stats.hearts >= 5:
        stats.hearts_updated_at = datetime.utcnow()
        return stats.hearts
        
    now = datetime.utcnow()
    diff = now - stats.hearts_updated_at
    minutes_passed = diff.total_seconds() / 60.0
    hearts_to_add = math.floor(minutes_passed / 5.0)
    
    if hearts_to_add > 0:
        new_hearts = min(5, stats.hearts + hearts_to_add)
        stats.hearts = new_hearts
        # Advance the updated_at by exactly the 5-min intervals consumed
        stats.hearts_updated_at = stats.hearts_updated_at + timedelta(minutes=hearts_to_add * 5)
        
    return stats.hearts

def process_lesson_completion(db: Session, user_id: int, lesson_id: int, req: LessonCompleteRequest, simulated_offset: int = 0) -> LessonSummaryResponse:
    today = get_today(simulated_offset)
    
    # 1. Evaluate XP
    # Check if this skill is already completed
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    skill = db.query(Skill).filter(Skill.id == req.skill_id).first()
    prog = db.query(UserSkillProgress).filter(UserSkillProgress.user_id == user_id, UserSkillProgress.skill_id == skill.id).first()
    
    xp_earned = 10
    if prog and prog.status == SkillStatus.completed:
        xp_earned = 5
    else:
        if req.hearts_lost == 0:
            xp_earned += 5
            
    # 2. Record completion
    completion = UserLessonCompletion(
        user_id=user_id,
        lesson_id=lesson_id,
        xp_earned=xp_earned,
        accuracy=1.0 - (req.hearts_lost * 0.2),
        hearts_lost=req.hearts_lost
    )
    db.add(completion)
    
    # 3. Update Stats
    stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
    stats.total_xp += xp_earned
    
    # Check xp_today date reset
    last_act = db.query(DailyActivity).filter(DailyActivity.user_id == user_id).order_by(DailyActivity.date.desc()).first()
    if not last_act or last_act.date < today:
        stats.xp_today = xp_earned
    else:
        stats.xp_today += xp_earned
    
    # 4. Evaluate streak
    new_streak, streak_incremented = evaluate_streak(db, user_id, today)
    
    # 5. Update daily activity
    activity = db.query(DailyActivity).filter(DailyActivity.user_id == user_id, DailyActivity.date == today).first()
    if not activity:
        activity = DailyActivity(user_id=user_id, date=today, xp_earned=xp_earned, lessons_completed=1, streak_day=new_streak)
        db.add(activity)
    else:
        activity.xp_earned += xp_earned
        activity.lessons_completed += 1
        
    # 6. Unlock progression logic
    skill_completed = False
    if not prog:
        prog = UserSkillProgress(user_id=user_id, skill_id=skill.id, status=SkillStatus.in_progress, levels_completed=1, crowns=0)
        db.add(prog)
    elif prog.status != SkillStatus.completed:
        prog.levels_completed += 1
        
    if prog.levels_completed >= skill.total_levels and prog.status != SkillStatus.completed:
        prog.status = SkillStatus.completed
        prog.crowns = 1
        skill_completed = True
        
        # Unlock the next skill across the course
        next_skill = db.query(Skill).join(Skill.unit).order_by(Skill.unit_id, Skill.order_index).filter(
            (Skill.unit_id > skill.unit_id) | ((Skill.unit_id == skill.unit_id) & (Skill.order_index > skill.order_index))
        ).first()
        
        if next_skill:
            next_prog = db.query(UserSkillProgress).filter(UserSkillProgress.user_id == user_id, UserSkillProgress.skill_id == next_skill.id).first()
            if not next_prog:
                next_prog = UserSkillProgress(user_id=user_id, skill_id=next_skill.id, status=SkillStatus.in_progress, levels_completed=0, crowns=0)
                db.add(next_prog)
            else:
                next_prog.status = SkillStatus.in_progress
                
    # 7. Check Achievements
    if new_streak >= 14:
        wildfire = db.query(Achievement).filter(Achievement.code == "wildfire").first()
        if wildfire:
            has_ach = db.query(UserAchievement).filter(UserAchievement.user_id == user_id, UserAchievement.achievement_id == wildfire.id).first()
            if not has_ach:
                db.add(UserAchievement(user_id=user_id, achievement_id=wildfire.id))
                
    db.commit()
    
    return LessonSummaryResponse(
        xp_earned=xp_earned,
        new_total_xp=stats.total_xp,
        streak_incremented=streak_incremented,
        new_streak=new_streak,
        skill_completed=skill_completed,
        gems_earned=10 if req.hearts_lost == 0 else 0
    )
