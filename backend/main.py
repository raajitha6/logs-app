from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from werkzeug.security import generate_password_hash

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_methods=['*'],
    allow_headers=['*']
)

@app.get('/health')
def health():
    return {'status': 'cool'}

@app.get('/entries', response_model=list[schemas.EntryOut])
def list_entries(db: Session = Depends(get_db)):
    return db.query(models.Entry).all()

@app.post('/entries', response_model=schemas.EntryOut)
def create_entry(entry: schemas.EntryCreate, db: Session = Depends(get_db)):
    db_entry = models.Entry(**entry.model_dump())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@app.patch("/entries/{entry_id}", response_model=schemas.EntryOut)
def update_entry(entry_id: int, entry: schemas.EntryUpdate, db: Session = Depends(get_db)):
    db_entry = db.query(models.Entry).filter(models.Entry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail='Entry not found')
    for key, val in entry.model_dump(exclude_unset=True).items():
        setattr(db_entry, key, val)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@app.delete('/entries/{entry_id}')
def delete_entry(entry_id:int, db:Session= Depends(get_db)):
    db_entry= db.query(models.Entry).filter(models.Entry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail='Entry not found')
    db.delete(db_entry)
    db.commit()
    return {'ok': True}

@app.post("/signup", response_model=schemas.UserOut, status_code=201)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(
        (models.User.username == user.username) | (models.User.email == user.email)
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Username or email already taken")

    db_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=generate_password_hash(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user