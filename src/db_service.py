from pymongo import MongoClient
from datetime import datetime
from urllib.parse import unquote

# MongoDB connection
client = MongoClient(
    'mongodb+srv://yashini2019943:hLNvVo8HLiSZtGAP@cleansentry.cxeur6w.mongodb.net/?retryWrites=true&w=majority&appName=cleansentry')

db = client['cleansentry_database']
collection = db['prediction_results']

current_date = datetime.now()
query = {'location': '', 'timestamp': current_date}


def find_predication_by_loacation(location):
    print(unquote(location).lower())
    query = {'location': unquote(location).lower()}
    # Retrieve data from the collection
    cursor = collection.find(query)
    results = []
    # Iterate over the cursor to access each document
    for document in cursor:
        document['_id']= str(document['_id'])
        document['location'] = (document['location']).capitalize()
        results.append(document)
    sorted_results = sorted(results, key=lambda x: x['date'], reverse=True)
    if sorted_results:
        return [sorted_results[0]]
    else:
        return []


def find_predication_by_loacation_and_date(location, date):
    query = {'location': unquote(location).lower(), 'date': date}
    # Retrieve data from the collection
    cursor = collection.find(query)
    results = []
    # Iterate over the cursor to access each document
    for document in cursor:
        document['_id']= str(document['_id'])
        document['location']= (document['location']).capitalize()
        results.append(document)
    return results

def save_prediction(prediction):
    query = {'location':prediction['location'], 'date': prediction['date']}
    update_data = {
        '$set': prediction
    }
    collection.update_one(query, update_data, upsert=True)


def find_recycling_centers(location):
    print(unquote(location).title())
    query = {'location': unquote(location).title()}
    # Retrieve data from the collection
    recycling_center_details_collection = db['recycling_center_details']
    cursor = recycling_center_details_collection.find(query)
    centers = []
    # Iterate over the cursor to access each document
    for document in cursor:
        for center in document['recycling_centers']:
            centers.append(center)
    return centers