import requests
import pandas as pd
import sqlalchemy as db
import os

from google import genai


my_api_key = os.getenv('GENAI_KEY')

client = genai.Client(api_key=my_api_key)

foodurl = "https://api.fda.gov/food/enforcement.json"
drugurl = "https://api.fda.gov/drug/enforcement.json"
cosmeticurl = "https://api.fda.gov/cosmetic/event.json"
engine = db.create_engine('sqlite:///food_status.db')


def search_food(food):

    response = requests.get(foodurl,
                            params={"search":
                                    f"product_description:{food}",
                                    "limit": 5})

    food_status = response.json()

    if "results" not in food_status:
        return None

    items = food_status["results"]

    results = []

    for item in items:
      results.append({
          "Food": item.get("product_description", "N/A"),
          "Reason for recall": item.get("reason_for_recall", "N/A"),
          "Recall date": item.get("recall_initiation_date", "N/A"),
          "Status": item.get("status", "N/A")
      })
    
    return results

def select_food(food_item, summarize=True):

    food_stats = pd.DataFrame([food_item])

    with engine.connect() as connection:

        connection.execute(db.text
                            ("DELETE FROM food_status WHERE Food = :food"),
                            {"food": food_item["Food"]})
        connection.commit()

    food_stats.to_sql('food_status', con=engine,
                            if_exists='append', index=False)

    if summarize:
        summary = summarize_food_and_drug(food_item)
        print(summary)

def search_drug(drug):

    response = requests.get(drugurl,
                            params={"search":
                                    f"product_description:{drug}",
                                    "limit": 5})

    drug_status = response.json()

    if "results" not in drug_status:
        return []

    items = drug_status["results"]

    results = []

    for item in items:
      results.append({
          "Drug": item.get("product_description", "N/A"),
          "Company": item.get("recalling_firm", "N/A"),
          "Reason for recall": item.get("reason_for_recall", "N/A"),
          "Recall date": item.get("recall_initiation_date", "N/A"),
          "Status": item.get("status", "N/A")
      })

    return results

def select_drug(drug_item, summarize=True):

    drug_stats = pd.DataFrame([drug_item])

    with engine.connect() as connection:

        connection.execute(db.text
                           ("DELETE FROM drug_status WHERE Drug = :drug"),
                           {"drug": drug_item["Drug"]})
        connection.commit()

    drug_stats.to_sql('drug_status', con=engine,
                           if_exists='append', index=False)

    if summarize:
        summary = summarize_food_and_drug(drug_item)
        print(summary)

def search_cosmetics(cosmetic):

    response = requests.get(cosmeticurl,
                            params={"search":
                                    f"products.product_name:{cosmetic}",
                                    "limit": 5})

    cosmetic_status = response.json()

    if "results" not in cosmetic_status:
        return []

    items = cosmetic_status["results"]

    results = []

    for item in items:
      products = item.get("products", [{}])
      product_name = products[0].get("product_name", "N/A")
      reactions = item.get("reactions", [])
      reaction_text = ", ".join(reactions)
      patient = item.get("patient")
      gender = patient.get("gender", "N/A")
      age = patient.get("age", "N/A")

      results.append({
          "Cosmetic": product_name,
          "Reactions": reaction_text,
          "Patient Age": age,
          "Patient Gender": gender,
          "Report date": item.get("event_date", "N/A")
      })

    return results

def select_cosmetics(cosmetic_item, summarize=True):

    cosmetic_stats = pd.DataFrame([cosmetic_item])

    with engine.connect() as connection:

        connection.execute(db.text
                           ("DELETE FROM cosmetic_status WHERE Cosmetic = :cosmetic"),
                           {"cosmetic": cosmetic_item["Cosmetic"]})
        connection.commit()

    cosmetic_stats.to_sql('cosmetic_status', con=engine,
                           if_exists='append', index=False)

    if summarize:
        summary = summarize_cosmetic(cosmetic_item)
        print(summary)


def show_db():
    with engine.connect() as connection:
        query_result = connection.execute(
            db.text("SELECT rowid, * FROM food_status")).fetchall()
    for row in query_result:
        print(f"\nROW ID: {row[0]}")
        print(f"Food: {row[1]}")
        print(f"Reason for recall: {row[2]}")
        print(f"Recall date: {row[3]}")
        print(f"Status: {row[4]}")


def delete_food(row_num):
    with engine.connect() as connection:
        connection.execute(
            db.text("DELETE FROM food_status WHERE rowid = :row"),
            {"row": row_num})
        connection.commit()


def summarize_food_and_drug(item):
  prompt = f"""
  Explain this food recall straightforward in a sentence or two. 
  Give a couple sentences to recommend and alternative according to the FDA
  Product: {item.get("product_description", "N/A")}
  Reason: {item.get("reason_for_recall", "N/A")}
  """

  resp = client.interactions.create(
      model="gemini-2.5-flash",
      input=prompt
  )
  return resp.output_text

def summarize_cosmetic(item):
  products = item.get("products", [])
  product_name = products[0].get("product_name", "N/A")
  reactions = item.get("reactions", [])
  reaction_text = ", ".join(reactions)
  prompt = f"""
  Explain the reaction straightforward in a sentence or two.
  Give a couple sentences to recommend and alternative according to the FDA
  Product: {product_name}
  Reason: {reaction_text}
  """

  resp = client.interactions.create(
      model="gemini-2.5-flash",
      input=prompt
  )


  return resp.output_text
