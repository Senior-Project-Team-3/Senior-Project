import csv 
from csv import DictReader
from datetime import datetime

#filename = 'RAW_interactions.csv'
#fields = [] 
#rows = []
# reading csv file 
#with open(filename, 'r') as csvfile: 
    # creating a csv reader object 
   # csvreader = csv.reader(csvfile) 
      
    # extracting field names through first row 
   # fields = next(csvreader) 
  
    # extracting each data row one by one 
    #for row in csvreader: 
       # rows.append(row)
# get total number of rows 
#print("Total no. of rows: %d"%(csvreader.line_num))
# printing the field names 
#print('Field names are:' + ', '.join(field for field in fields))

class Review:
    def __init__(self, user_id, recipe_id, date, rating, review):
        self.user_id = user_id
        self.recipe_id = recipe_id
        self.date = date
        self.rating = rating
        self.review = review
        
listOfAllReviews = []
# open file in read mode
with open('RAW_interactions.csv', 'r') as read_obj:
    # pass the file object to DictReader() to get the DictReader object
    csv_dict_reader = DictReader(read_obj)
    # get column names from a csv file
    column_names = csv_dict_reader.fieldnames
    for row in csv_dict_reader:
        review = Review(row['user_id'], row['recipe_id'], row['date'], 
                       row['rating'], row['review'])
        listOfAllReviews.append(review)
        
for review in listOfAllReviews:
    # chnage date from str to date
    date_time_str = review.date
    date_time_obj = datetime.strptime(date_time_str, '%Y-%m-%d')
    submitted_date = date_time_obj.date()
    review.date = submitted_date
    
    #change user id, rating, and recipe id fro str to int
    intUser = int(review.user_id)
    review.user_id
    intRating = int(review.rating)
    review.rating
    intRecipeID = int(review.recipe_id)
    review.recipe_id
    
insertReviewQuery = """INSERT INTO reviews (user_id, recipeID, reviewDate, rating, review)
                        VALUES(%s, %s, %s, %s, %s)"""

import mysql.connector
from mysql.connector import Error

try:
    connection = mysql.connector.connect(user='root', 
                                         password='Unxhemd8', 
                                         host='127.0.0.1',
                                         port=3306,
                                         database='recipeinfodb',
                                         auth_plugin='mysql_native_password')
    if connection.is_connected():
        #db_Info = connection.get_server_info()
        #print("Connected to MySQL Server version ", db_Info)
        cursor = connection.cursor()
        cursor.execute("select database();")
        record = cursor.fetchone()
        print("You're connected to database: ", record)
        #cursor.execute("show tables;")
        #record = cursor.fetchall()
        for review in listOfAllReviews:
            reviewInfo = (review.user_id, review.recipe_id, review.date, 
                          review.rating, review.review)
            cursor.execute(insertReviewQuery, reviewInfo)
        connection.commit()
except Error as e:
    print("Error while connecting to MySQL", e)
finally:
    cursor.close()
    connection.close()
