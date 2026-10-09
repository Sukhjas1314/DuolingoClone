from app.db import SessionLocal, engine, Base
from app.models.all import User, UserStats, Course, Unit, Skill, Lesson, Exercise, ExerciseType, SkillStatus, UserSkillProgress, Achievement, UserAchievement
from datetime import date
import random

def seed_db():
    print("Dropping existing tables to ensure a fresh start...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed User
    user = User(username="alex", display_name="Alex", avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", email="alex@example.com")
    db.add(user)
    db.commit()
    db.refresh(user)

    stats = UserStats(
        user_id=user.id,
        total_xp=0,
        current_streak=0,
        longest_streak=0,
        last_activity_date=date.today(),
        hearts=5,
        gems=500,
        daily_xp_goal=50,
        xp_today=0,
        league="Bronze"
    )
    db.add(stats)

    # Achievements
    wildfire = Achievement(code="wildfire", title="Wildfire", description="Reach a 14 day streak", icon="🔥", threshold=14)
    db.add(wildfire)
    db.commit()

    # Seed Course
    course = Course(code="es", name="Spanish", flag="🇪🇸", from_language="en")
    db.add(course)
    db.commit()
    db.refresh(course)

    # Helper functions
    def create_skill(unit_id, order_index, title, icon, total_levels=1):
        skill = Skill(unit_id=unit_id, order_index=order_index, title=title, icon=icon, total_levels=total_levels)
        db.add(skill)
        db.commit()
        db.refresh(skill)
        return skill

    def create_lesson(skill_id, order_index, level_number):
        lesson = Lesson(skill_id=skill_id, order_index=order_index, level_number=level_number)
        db.add(lesson)
        db.commit()
        db.refresh(lesson)
        return lesson

    # Seed Unit 1
    u1 = Unit(course_id=course.id, order_index=1, title="Unit 1", description="Form basic sentences, greet people", color="duo-green")
    db.add(u1)
    db.commit()
    db.refresh(u1)

    # Unit 1 Skills
    s1_1 = create_skill(u1.id, 1, "Basics", "star")
    s1_2 = create_skill(u1.id, 2, "Phrases", "book")
    s1_3 = create_skill(u1.id, 3, "Food", "coffee")
    
    # User Progress for Alex - Starting completely fresh
    db.add(UserSkillProgress(user_id=user.id, skill_id=s1_1.id, status=SkillStatus.in_progress, levels_completed=0, crowns=0))
    db.add(UserSkillProgress(user_id=user.id, skill_id=s1_2.id, status=SkillStatus.locked, levels_completed=0, crowns=0))
    db.add(UserSkillProgress(user_id=user.id, skill_id=s1_3.id, status=SkillStatus.locked, levels_completed=0, crowns=0))

    # Add Lessons and Exercises to s1_1 (the first active skill)
    l1 = create_lesson(s1_1.id, 1, 1)
    exercises = [
        Exercise(lesson_id=l1.id, order_index=1, type=ExerciseType.multiple_choice, prompt="the bread", correct_answer="el pan", payload={"options": [{"text": "el pan", "image": "bread.png"}, {"text": "el agua", "image": "water.png"}, {"text": "la manzana", "image": "apple.png"}]}),
        Exercise(lesson_id=l1.id, order_index=2, type=ExerciseType.translate_word_bank, prompt="I eat apples", correct_answer="Yo como manzanas", payload={"bank": ["Yo", "como", "manzanas", "bebo", "leche", "él"]}),
        Exercise(lesson_id=l1.id, order_index=3, type=ExerciseType.type_answer, prompt="the apple", correct_answer="la manzana", payload={}),
        Exercise(lesson_id=l1.id, order_index=4, type=ExerciseType.fill_blank, prompt="Yo ___ agua", correct_answer="bebo", payload={"sentence": "Yo ___ agua", "blankIndex": 1, "options": ["como", "bebo", "eres"]}),
        Exercise(lesson_id=l1.id, order_index=5, type=ExerciseType.match_pairs, prompt="Match the pairs", correct_answer="all", payload={"pairs": {"apple": "manzana", "water": "agua", "bread": "pan", "milk": "leche", "eat": "comer"}}),
        Exercise(lesson_id=l1.id, order_index=6, type=ExerciseType.speak, prompt="Speak this sentence", correct_answer="Yo como manzanas", payload={"text": "Yo como manzanas"}),
        Exercise(lesson_id=l1.id, order_index=7, type=ExerciseType.listen, prompt="Type what you hear", correct_answer="el agua", payload={"text": "el agua"})
    ]
    db.add_all(exercises)
    
    # Seed Unit 2
    u2 = Unit(course_id=course.id, order_index=2, title="Unit 2", description="Talk about family, use adjectives", color="duo-orange")
    db.add(u2)
    db.commit()
    db.refresh(u2)
    
    s2_1 = create_skill(u2.id, 1, "Family", "heart")
    s2_2 = create_skill(u2.id, 2, "Colors", "star")
    s2_3 = create_skill(u2.id, 3, "Animals", "dog")

    # Seed Unit 3
    u3 = Unit(course_id=course.id, order_index=3, title="Unit 3", description="Describe your day", color="duo-blue")
    db.add(u3)
    db.commit()
    
    s3_1 = create_skill(u3.id, 1, "Routine", "clock")
    s3_2 = create_skill(u3.id, 2, "Emotions", "smile")
    s3_3 = create_skill(u3.id, 3, "Travel", "plane")
    
    # Add dummy users for leaderboard
    users = []
    for i in range(20):
        dummy = User(username=f"user_{i}", display_name=f"User {i+1}", avatar=f"https://api.dicebear.com/7.x/avataaars/svg?seed=Dummy{i}")
        users.append(dummy)
    db.add_all(users)
    db.commit()
    
    for idx, dummy in enumerate(users):
        db.add(UserStats(user_id=dummy.id, total_xp=5000, xp_today=random.randint(10, 100), league="Silver", current_streak=random.randint(1, 30)))
    
    db.commit()
    db.close()
    print("Full Seed complete.")

if __name__ == "__main__":
    seed_db()
