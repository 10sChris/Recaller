import requests
import pandas as pd
import sqlalchemy as db
import os

from google import genai


my_api_key = os.getenv('GENAI_KEY')

client = genai.Client(api_key=my_api_key)

foodurl = "https://api.fda.gov/food/enforcement.json"
drugurl = "https://api.fda.gov/drug/event.json"
cosmeticurl = "https://api.fda.gov/cosmetic/event.json"
engine = db.create_engine('sqlite:///food_status.db')


def check_food(food, summarize=True):

    response = requests.get(foodurl,
                            params={"search":
                                    f"product_description:{food}",
                                    "limit": 5})

    food_status = response.json()

    if "results" not in food_status:

        print("\n")
        print("No results. Try something else.")
        return None

    items = food_status["results"]



    food_stats = []

    food_stats.append({
        "Food": item.get("product_description", "N/A"),
        "Reason for recall": item.get("reason_for_recall", "N/A"),
        "Recall date": item.get("recall_initiation_date", "N/A"),
        "Status": item.get("status", "N/A")
    })

    food_statistics = pd.DataFrame.from_dict(food_stats)

    with engine.connect() as connection:

        connection.execute(db.text
                           ("DELETE FROM food_status WHERE Food = :food"),
                           {"food": item.get("product_description", "N/A")})
        connection.commit()

    food_statistics.to_sql('food_status', con=engine,
                           if_exists='append', index=False)

    if summarize:
        summary = summarize_food_and_drug(item)
        print("\nGemini safety summary:")
        print(summary)

def check_drug(drug, summarize=True):

    response = requests.get(drugurl,
                            params={"search":
                                    f"product_description:{drug}",
                                    "limit": 5})

    drug_status = response.json()

    if "results" not in drug_status:

        print("\n")
        print("No results. Try something else.")
        return None

    items = drug_status["results"]

    drug_stats = []

    drug_stats.append({
        "Drug": item.get("product_description", "N/A"),
        "Reason for recall": item.get("reason_for_recall", "N/A"),
        "Recall date": item.get("recall_initiation_date", "N/A"),
        "Status": item.get("status", "N/A")
    })

    drug_statistics = pd.DataFrame.from_dict(drug_stats)

    with engine.connect() as connection:

        connection.execute(db.text
                           ("DELETE FROM drug_status WHERE Drug = :drug"),
                           {"drug": item.get("product_description", "N/A")})
        connection.commit()

    drug_statistics.to_sql('drug_status', con=engine,
                           if_exists='append', index=False)

    if summarize:
        summary = summarize_food_and_drug(item)
        print(summary)

  def check_cosmetic(cosmetic, summarize=True):

    response = requests.get(cosmeticurl,
                            params={"search":
                                    f"product_description:{drug}",
                                    "limit": 1})

    cosmetic_status = response.json()

    if "results" not in cosmetic_status:

        print("\n")
        print("No results. Try something else.")
        return None

    item = cosmetic_status["results"][0]

    cosmetic_stats = []

    cosmetic_stats.append({
        "Cosmetic": item.get("product_description", "N/A"),
        "Reason for recall": item.get("reason_for_recall", "N/A"),
        "Recall date": item.get("recall_initiation_date", "N/A"),
        "Status": item.get("status", "N/A")
    })

    cosmetic_statistics = pd.DataFrame.from_dict(drug_stats)

    with engine.connect() as connection:

        connection.execute(db.text
                           ("DELETE FROM cosmetic_status WHERE Cosmetic = :cosmetic"),
                           {"drug": item.get("product_description", "N/A")})
        connection.commit()

    cosmetic_statistics.to_sql('cosmetic_status', con=engine,
                           if_exists='append', index=False)

    if summarize:
        summary = summarize_cosmetic(item)
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
  Then give a couple sentences to recommend an alternative item that is safer.
  Product: {item.get("product_description", "N/A")}
  Reason: {item.get("reason_for_recall", "N/A")}
  """

    resp = client.interactions.create(
        model="gemini-2.5-flash",
        input=prompt
    )

def summarize_cosmetic(item):
  products = item.get("products", [])
  product_name = products[0].get("product_name", "N/A")
  reactions = item.get("reactions", [])
  reaction_text = ", ".join(reactions)
    prompt = f"""
  Explain this cosmetic recall straightforward in a sentence or two.
  Then give a couple sentences to recommend an alternative item that is safer.
  Product: {product_name}
  Reason: {reaction_text}
  """

    resp = client.interactions.create(
        model="gemini-2.5-flash",
        input=prompt
    )


    return resp.output_text
