import requests
import pandas as pd
import sqlalchemy as db
import os

from google import genai

my_api_key = os.getenv('GENAI_KEY')

client = genai.Client(api_key=my_api_key)

url = "https://api.fda.gov/food/enforcement.json"
engine = db.create_engine('sqlite:///food_status.db')


def check_food(food, summarize=True):

  response = requests.get(url, params={"search": f"product_description:{food}", "limit": 1})
  food_status = response.json()

  if "results" not in food_status:
    return None
  
  item = food_status["results"][0]

  food_stats = []

  food_stats.append({
    "Food": item.get("product_description", "N/A"),
    "Reason for recall": item.get("reason_for_recall", "N/A"),
    "Recall date": item.get("recall_initiation_date", "N/A"),
    "Status": item.get("status", "N/A")
  })

  food_statistics = pd.DataFrame.from_dict(food_stats)

  with engine.connect() as connection:
    connection.execute(db.text("""
        CREATE TABLE IF NOT EXISTS food_status (
            Food TEXT,
            "Reason for recall" TEXT,
            "Recall date" TEXT,
            Status TEXT
        )
    """))

    connection.execute(db.text("DELETE FROM food_status WHERE Food = :food"), {"food": item.get("product_description", "N/A")})
    connection.commit()
  
  food_statistics.to_sql('food_status', con=engine, if_exists='append', index=False)

  if summarize:
    summary = summarize_recall(item)
    print("\nGemini safety summary:")
    print(summary)

def show_db():
  with engine.connect() as connection:
    query_result = connection.execute(db.text("SELECT rowid, * FROM food_status")).fetchall()
  print(pd.DataFrame(query_result))

def update_db():
  with engine.connect() as connection:
    query_result = connection.execute(db.text("SELECT Food FROM food_status;")).fetchall()
  
  foods = [row[0] for row in query_result]

  for food in foods:
    check_food(food, summarize=False)
  
  show_db()

def delete_food(row_num):
  with engine.connect() as connection:
    connection.execute(db.text("DELETE FROM food_status WHERE rowid = :row"), {"row": row_num})
    connection.commit()
  

def summarize_recall(item): 
  prompt = f""" 
  Explain this food recall straightforward. 
  Product: {item.get("product_description", "N/A")}
  Reason: {item.get("reason_for_recall", "N/A")}
  """

  print("contacting ")
  resp = client.interactions.create(
    model="gemini-2.5-flash",
    input=prompt
  )

  print("finished")

  return resp.output_text
