import requests
import pandas as pd
import sqlalchemy as db

url = "https://api.fda.gov/food/enforcement.json"

def check_food(food):
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
  engine = db.create_engine('sqlite:///food_status.db')
  food_statistics.to_sql('food_status', con=engine, if_exists='replace', index=False)

def show_foods()
  with engine.connect() as connection:
    query_result = connection.execute(db.text("SELECT * FROM food_status;")).fetchall()
    print(pd.DataFrame(query_result))

  