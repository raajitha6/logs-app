from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

app = FastAPI()

@app.get('/health')
def health():
    return {'status': 'ok'}

@app.get('/hello/{name}')
def hello(name):
    return {'message':f'Hello {name}!'}

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
