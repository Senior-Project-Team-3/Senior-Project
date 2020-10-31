import csv 
from csv import DictReader
import datetime
from datetime import datetime
from bs4 import BeautifulSoup
import requests
import mysql.connector
from mysql.connector import Error



# Using readlines() 
file1 = open('allRecipeImages.txt', 'r') 
Lines = file1.readlines() 

# key will be the recipe ID and the value will be the recipe Image link
recipeImagesMap = {} 

#Strips the newline character 
for line in Lines:
    full = line.strip()
    lineList = full.split('link:')
    resIDstr = lineList[0].split('resID:')
    resID = int(resIDstr[1])
    link = lineList[1]
    if resID not in recipeImagesMap:
        recipeImagesMap[resID] = link

# connect to databse and update the recipe tables
updateImgageLinkQuery = "UPDATE recipes SET imageLink = %s WHERE recipeID = %s "


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
        
        for key, value in recipeImagesMap.items():
            imageInfo = (value, key)
            cursor.execute(updateImgageLinkQuery, imageInfo)
            
        connection.commit()
except Error as e:
    print("Error while connecting to MySQL", e)
finally:
    cursor.close()
    connection.close()
