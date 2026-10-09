from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import date
from app.models.all import ExerciseType, SkillStatus

class UserStatsSchema(BaseModel):
    total_xp: int
    current_streak: int
    longest_streak: int
    last_activity_date: Optional[date]
    hearts: int
    gems: int
    daily_xp_goal: int
    xp_today: int
    league: str
    model_config = ConfigDict(from_attributes=True)

class UserSchema(BaseModel):
    id: int
    username: str
    display_name: str
    avatar: str
    stats: UserStatsSchema
    achievements: List[str] = []
    model_config = ConfigDict(from_attributes=True)

class ExerciseSchema(BaseModel):
    id: int
    type: ExerciseType
    prompt: str
    payload: Dict[str, Any]
    hint: Optional[str] = None
    audio_url: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class LessonSchema(BaseModel):
    id: int
    level_number: int
    exercises: List[ExerciseSchema]
    model_config = ConfigDict(from_attributes=True)

class SkillSchema(BaseModel):
    id: int
    title: str
    icon: str
    total_levels: int
    status: SkillStatus = SkillStatus.locked
    levels_completed: int = 0
    crowns: int = 0
    model_config = ConfigDict(from_attributes=True)

class UnitSchema(BaseModel):
    id: int
    title: str
    description: str
    color: str
    skills: List[SkillSchema]
    model_config = ConfigDict(from_attributes=True)

class PathSchema(BaseModel):
    units: List[UnitSchema]

class CheckAnswerRequest(BaseModel):
    user_answer: str

class CheckAnswerResponse(BaseModel):
    correct: bool
    correct_answer: str
    hearts_remaining: int
    explanation: Optional[str] = None

class LessonCompleteRequest(BaseModel):
    xp_earned: int
    accuracy: float
    hearts_lost: int
    skill_id: int

class LessonSummaryResponse(BaseModel):
    xp_earned: int
    new_total_xp: int
    streak_incremented: bool
    new_streak: int
    skill_completed: bool
    gems_earned: int
    
class LeaderboardEntry(BaseModel):
    user_id: int
    username: str
    display_name: str
    avatar: str
    weekly_xp: int
    rank: int

class ShopPurchaseRequest(BaseModel):
    item_code: str

class ShopPurchaseResponse(BaseModel):
    success: bool
    message: str
    new_gems: int
    new_hearts: int
