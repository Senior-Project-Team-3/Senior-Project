import csv 
from csv import DictReader
import datetime
from datetime import datetime
from bs4 import BeautifulSoup
#from urllib.request import urlopen
#from lxml import etree
#from selenium import webdriver
import requests

class Recipe:
    def __init__(self, recipeName, recipeID, timeToCockInMinutes,
                 contributor_id,submitted, tags, nutrition, 
                 numberOfSteps, stepsInOrder, description, 
                 ingredients, numberOfIngredients):
        self.recipeName = recipeName
        self.recipeID = recipeID
        self.timeToCockInMinutes = timeToCockInMinutes
        self.contributor_id = contributor_id
        self.submitted = submitted
        self.tags = tags
        self.nutrition = nutrition
        self.numberOfSteps = numberOfSteps
        self.stepsInOrder = stepsInOrder
        self.description = description
        self.ingredients = ingredients
        self.numberOfIngredients = numberOfIngredients
        
class RecipeTable:
    def __init__(self, recipeID, name, timeToMake, contributor_id, submittedDate,
                tags, numberOfSteps, stepsInOrder, numberOfIngredients, ingredients,
                user_description, foodURL):
        self.recipeID = recipeID # int -
        self.name = name # str - 
        self.timeToMake = timeToMake # int - 
        self.contributor_id = contributor_id # int -
        self.submittedDate = submittedDate # datetime date obejct - 
        self.tags = tags # str - 
        self.numberOfSteps = numberOfSteps # int -
        self.stepsInOrder = stepsInOrder # str - 
        self.numberOfIngredients = numberOfIngredients # int - 
        self.ingredients = ingredients # str -
        self.user_description = user_description  # str
        self.foodURL = foodURL # str

class NutritionTable:
    def __init__(self, recipeID, calories, totalFat, sugar, 
                 sodium, protein, saturatedFat, carbohydrates):
        self.recipeID = recipeID
        self.calories = calories
        self.totalFat = totalFat
        self.sugar = sugar
        self.sodium = sodium
        self.protein = protein
        self.saturatedFat = saturatedFat
        self.carbohydrates = carbohydrates

def getImageUrl(recipeID):
    baseUrl = 'https://www.food.com/recipe/'
    completeUrl = baseUrl + str(recipeID)
    return completeUrl
    #response = requests.get(completeUrl)
    #content = BeautifulSoup(response.content, "html.parser")
    #link = ''
    #for tag in content.findAll('meta'):
      #  try:
       #     if(tag['name'] == 'og:image'):
        #        link = tag['content']
       # except KeyError:
        #    pass
    #return link
        
#fucntion that removes the brackets out of a string
def removeBrackets(string):
    left = string.replace('[', "")
    right = left.replace(']', "")
    return right

listOfAllRecipes = []
# open file in read mode
with open('RAW_recipes.csv', 'r') as read_obj:
    # pass the file object to DictReader() to get the DictReader object
    csv_dict_reader = DictReader(read_obj)
    # get column names from a csv file
    column_names = csv_dict_reader.fieldnames
    for row in csv_dict_reader:
        recipe = Recipe(row['name'], row['id'], row['minutes'], 
                       row['contributor_id'], row['submitted'], row['tags'],
                       row['nutrition'], row['n_steps'], row['steps'], 
                       row['description'], row['ingredients'],
                       row['n_ingredients'])
        listOfAllRecipes.append(recipe)
        
recipe_Table_List = []

for recipe in listOfAllRecipes:
    ## turns the contributor id, recipe id, time to cook, and teh number of steps into a int
    recipe_id = int(recipe.recipeID)
    con_id = int(recipe.contributor_id)
    numOfSteps = int(recipe.numberOfSteps)
    cookTime = int(recipe.timeToCockInMinutes)
    numOfIngredients = int(recipe.numberOfIngredients)
    
    #turn the submitted date into a datetime date object
    date_time_str = recipe.submitted
    date_time_obj = datetime.strptime(date_time_str, '%Y-%m-%d')
    submitted_date = date_time_obj.date()
    
    ## removes the brackets from all the str values
    ingreStr = removeBrackets(recipe.ingredients)
    tagStr = removeBrackets(recipe.tags)
    stepsStr = removeBrackets(recipe.stepsInOrder)
    
    FoodURL = 'https://www.food.com/recipe/' + str(recipe.recipeID)
    
    recipeEntry = RecipeTable(recipe_id, recipe.recipeName, cookTime,
                             con_id, submitted_date, tagStr, numOfSteps,
                             stepsStr, numOfIngredients, ingreStr, recipe.description, FoodURL)
    recipe_Table_List.append(recipeEntry)

#### stoes all the entries for the nutrition table in the db
nutrition_Table_List = []
for rec in listOfAllRecipes:
    removed_left_bracket = rec.nutrition.replace('[', '')
    removed_right_bracket = removed_left_bracket.replace(']', '')
    editied_nutrition_str = removed_right_bracket
    nutrion_str_list = list(editied_nutrition_str.split(','))
    nutrition_float_list = [float(item) for item in nutrion_str_list]
    nutritionEntry = NutritionTable(rec.recipeID, nutrition_float_list[0], 
                                    nutrition_float_list[1], nutrition_float_list[2], 
                                   nutrition_float_list[3], nutrition_float_list[4], 
                                   nutrition_float_list[5], nutrition_float_list[6])
    nutrition_Table_List.append(nutritionEntry)


insertRecipeQuery = """INSERT INTO recipes (recipeID, name, time_to_make, contributorID, 
                        submitted_date, tags, number_of_steps, steps_in_order, 
                        number_of_ingredients, ingredients, contributor_description)
                        VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

insertNutritionQuery = """INSERT INTO nutritions (recipeID, calories, total_fat, sugar, 
                          sodium, protein, saturated_fat, carbohydrates)
                          VALUES(%s, %s, %s, %s, %s, %s, %s, %s)"""

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
	
	for recipe in recipe_Table_List:
            recipeInfo = (recipe.recipeID, recipe.name, recipe.timeToMake, recipe.contributor_id,
                          recipe.submittedDate, recipe.tags, recipe.numberOfSteps, recipe.stepsInOrder,
                          recipe.numberOfIngredients, recipe.ingredients, recipe.user_description)
            cursor.execute(insertRecipeQuery, recipeInfo)
        
        for nutrition in nutrition_Table_List:
            nutritionInfo = (nutrition.recipeID, nutrition.calories, nutrition.totalFat, 
                             nutrition.sugar, nutrition.sodium, nutrition.protein, 
                             nutrition.saturatedFat, nutrition.carbohydrates)
            cursor.execute(insertNutritionQuery, nutritionInfo)
        connection.commit()
except Error as e:
    print("Error while connecting to MySQL", e)
finally:
    cursor.close()
    connection.close()
