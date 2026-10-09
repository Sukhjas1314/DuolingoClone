FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose port
EXPOSE 8000

# Start command
# We use a shell script or command that runs migrations/seed if needed, then starts uvicorn.
# For SQLite on Render free tier, the disk is ephemeral, so we run the seed script on boot
# to ensure data exists when the container spins up.
CMD ["sh", "-c", "python -m app.seed.seed && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
