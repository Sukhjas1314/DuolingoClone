from app.db import SessionLocal
from app.models.all import UserSkillProgress

db = SessionLocal()
progress = db.query(UserSkillProgress).filter(UserSkillProgress.user_id == 1).all()
print([(p.user_id, p.skill_id, p.status, p.levels_completed) for p in progress])
