from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Date, Enum, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db import Base

class ExerciseType(str, enum.Enum):
    multiple_choice = "multiple_choice"
    translate_word_bank = "translate_word_bank"
    match_pairs = "match_pairs"
    fill_blank = "fill_blank"
    type_answer = "type_answer"
    speak = "speak"
    listen = "listen"

class SkillStatus(str, enum.Enum):
    locked = "locked"
    available = "available"
    in_progress = "in_progress"
    completed = "completed"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    display_name = Column(String)
    avatar = Column(String)
    email = Column(String, unique=True, index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    stats = relationship("UserStats", back_populates="user", uselist=False)
    skill_progress = relationship("UserSkillProgress", back_populates="user")
    lesson_completions = relationship("UserLessonCompletion", back_populates="user")
    daily_activity = relationship("DailyActivity", back_populates="user")

class UserStats(Base):
    __tablename__ = "user_stats"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    total_xp = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_activity_date = Column(Date, nullable=True)
    hearts = Column(Integer, default=5)
    hearts_updated_at = Column(DateTime, default=datetime.utcnow)
    gems = Column(Integer, default=500)
    daily_xp_goal = Column(Integer, default=50)
    xp_today = Column(Integer, default=0)
    league = Column(String, default="Bronze")

    user = relationship("User", back_populates="stats")

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String)
    flag = Column(String)
    from_language = Column(String)

    units = relationship("Unit", back_populates="course", order_by="Unit.order_index")

class Unit(Base):
    __tablename__ = "units"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    order_index = Column(Integer)
    title = Column(String)
    description = Column(String)
    color = Column(String)

    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit", order_by="Skill.order_index")

class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"))
    order_index = Column(Integer)
    title = Column(String)
    icon = Column(String)
    total_levels = Column(Integer)

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", order_by="Lesson.order_index")

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"))
    order_index = Column(Integer)
    level_number = Column(Integer)

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", order_by="Exercise.order_index")

class Exercise(Base):
    __tablename__ = "exercises"
    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    order_index = Column(Integer)
    type = Column(Enum(ExerciseType))
    prompt = Column(String)
    correct_answer = Column(String)
    payload = Column(JSON)  # For options, pairs, blanks depending on type
    hint = Column(String, nullable=True)
    audio_url = Column(String, nullable=True)

    lesson = relationship("Lesson", back_populates="exercises")

class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), primary_key=True)
    status = Column(Enum(SkillStatus), default=SkillStatus.locked)
    levels_completed = Column(Integer, default=0)
    crowns = Column(Integer, default=0)

    user = relationship("User", back_populates="skill_progress")
    skill = relationship("Skill")

class UserLessonCompletion(Base):
    __tablename__ = "user_lesson_completions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    xp_earned = Column(Integer)
    accuracy = Column(Float)
    hearts_lost = Column(Integer)
    completed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="lesson_completions")
    lesson = relationship("Lesson")

class DailyActivity(Base):
    __tablename__ = "daily_activity"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    date = Column(Date, primary_key=True)
    xp_earned = Column(Integer, default=0)
    lessons_completed = Column(Integer, default=0)
    streak_day = Column(Integer, default=0)

    user = relationship("User", back_populates="daily_activity")

class Achievement(Base):
    __tablename__ = "achievements"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    title = Column(String)
    description = Column(String)
    icon = Column(String)
    threshold = Column(Integer)

class UserAchievement(Base):
    __tablename__ = "user_achievements"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), primary_key=True)
    unlocked_at = Column(DateTime, default=datetime.utcnow)
