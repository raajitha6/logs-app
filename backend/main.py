from fastapi import FastAPI, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from werkzeug.security import generate_password_hash, check_password_hash
from auth import create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_methods=['*'],
    allow_headers=['*'],
    allow_credentials=True,
)

@app.get('/health')
def health():
    return {'status': 'cool'}

@app.get("/entries", response_model=list[schemas.EntryOut])
def list_entries(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Entry).filter(models.Entry.user_id == current_user.id).all()

@app.post("/entries", response_model=schemas.EntryOut)
def create_entry(entry: schemas.EntryCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_entry = models.Entry(**entry.model_dump(), user_id=current_user.id)
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@app.patch("/entries/{entry_id}", response_model=schemas.EntryOut)
def update_entry(entry_id: int, entry: schemas.EntryUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_entry = db.query(models.Entry).filter(
        models.Entry.id == entry_id, models.Entry.user_id == current_user.id
    ).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    for key, value in entry.model_dump(exclude_unset=True).items():
        setattr(db_entry, key, value)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@app.delete("/entries/{entry_id}")
def delete_entry(entry_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_entry = db.query(models.Entry).filter(
        models.Entry.id == entry_id, models.Entry.user_id == current_user.id
    ).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(db_entry)
    db.commit()
    return {"ok": True}

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

@app.post("/login", response_model=schemas.UserOut)
def login(credentials: schemas.LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == credentials.username).first()
    if not user or not check_password_hash(user.password_hash, credentials.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    response.set_cookie(
        key="access_token",
        value=create_access_token(user.id),
        httponly=True,
        samesite="lax",
        secure=False,  # set True once deployed on HTTPS
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    return user

@app.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}

@app.get("/me", response_model=schemas.UserOut)
def me(current_user: models.User = Depends(get_current_user)):
    return current_user