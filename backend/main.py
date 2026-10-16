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