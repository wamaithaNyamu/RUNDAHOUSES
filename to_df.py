import pymongo
import pandas as pd
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

MONGOURI = os.environ.get("MONGOURI")

data = []


def connect_to_mongo():
    myclient = pymongo.MongoClient(MONGOURI)
    mydb = myclient["RundaHomes"]
    mycollection = mydb["rundahouses"]
    cursor = mycollection.find({})
    print(cursor)
    for doc in cursor:
        print(doc)
        data.append(doc)


def convert_json_to_csv(data):
    df = pd.DataFrame(data)
    df.to_csv("./runda_houses.csv", index=None)


if __name__ == "__main__":
    connect_to_mongo()
    convert_json_to_csv(data)
