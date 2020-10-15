In the default sakila schema I added a table called "recipe". Then added these 5 entries:
insert into recipe(recipe_id, recipe_name, cook_time, meal_type)
values(1, 'cookies', 15, 'chinese');
values(2, 'pasta', 15, 'italian');
values(3, 'cheeseburger', 15, 'american');
values(4, 'tacos', 15, 'mexican');
values(5, 'sushi', 15, 'japanese');

Then go to index.js to configure your DB connection.

Node_Modules is huge so I gitignored it. So you should run 'npm install' after checking out code.

Start the server with node app.js or nodemon.js (npm install nodemon, will restart server whenever you make a change)

Go to webpage (ng serve -o) and navigate to take a survey page. Searching for any of the 5 recipes up top will display data provided by mysql.