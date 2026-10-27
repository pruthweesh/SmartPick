from database import engine, Base

# Ensure the new Category model and any added columns are created.
# checkfirst=True avoids recreating existing tables.
Base.metadata.create_all(bind=engine, checkfirst=True)
