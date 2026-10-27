import sqlalchemy
from database import engine

# Check if 'category_id' column exists in 'products' table
with engine.connect() as conn:
    result = conn.execute(sqlalchemy.text("PRAGMA table_info(products);"))
    columns = [row[1] for row in result]
    if 'category_id' not in columns:
        # Add the new column (nullable for backward compatibility)
        conn.execute(sqlalchemy.text("ALTER TABLE products ADD COLUMN category_id VARCHAR;"))
        print("Added column 'category_id' to products table.")
    else:
        print("Column 'category_id' already exists.")
