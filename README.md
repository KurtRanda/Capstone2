🍽️ MealMatch
What’s in Your Kitchen? Let’s Cook!
MealMatch helps you find delicious recipes based on ingredients you already have, reducing food waste and making meal planning easier! 🥦🍗🥕

🔗 Live Demo: [https://capstone2-bmcv.onrender.com]

🚀 Features
✅ Search Recipes by Ingredients – Enter what you have, and find recipes!
✅ Save Recipes – Keep track of your favorite recipes.
✅ Grocery List Management – Save ingredients to your grocery list.
✅ User Authentication – Sign up and log in to manage your saved recipes & grocery list.
✅ Mobile-Friendly UI – Clean, responsive design built with Material UI & Bootstrap.
✅ Loading Indicators – Inform users of background processes and data fetching.
✅ Clear Error Messages – Clear feedback for failed user actions, like signups and logins.

🛠️ Tech Stack
Frontend: React, React Router, Material UI, Bootstrap
Backend: Node.js, Express.js, PostgreSQL, Knex.js
Authentication: JWT (JSON Web Tokens)
API Integration: Edamam API (for recipe search)
Deployment: Render (Frontend + Backend + Database)

📖 Getting Started
1️⃣ Clone the Repository
sh
Copy
git clone https://github.com/KurtRanda/Capstone2.git
cd Capstone2
2️⃣ Install Dependencies
Frontend
sh
Copy
cd frontend
npm install
Backend
sh
Copy
cd backend
npm install
3️⃣ Set Up Environment Variables
Create a .env file in the backend directory with:

ini
Copy
DATABASE_URL=your_render_postgres_db_url
SECRET_KEY=your_jwt_secret
Create a .env file in the frontend directory with:

ini
Copy
VITE_BACKEND_URL=https://mealmatch-e7s4.onrender.com
VITE_EDAMAM_APP_ID=your_edamam_api_id
VITE_EDAMAM_APP_KEY=your_edamam_api_key
4️⃣ Run the App Locally
Start the Backend
sh
Copy
cd backend
node server.js  # or use npx nodemon server.js
Start the Frontend
sh
Copy
cd frontend
npm run dev
5️⃣ Open in Browser
Go to: http://localhost:5173

🛠️ API Routes
Method	Endpoint	Description
POST	/auth/signup	Register a new user
POST	/auth/login	Log in and receive a JWT token
GET	/recipes	Fetch saved recipes
POST	/recipes	Save a new recipe
DELETE	/recipes/:id	Remove a saved recipe
GET	/grocery-list	Fetch user's grocery list
POST	/grocery-list	Add an ingredient to the grocery list
PATCH	/grocery-list/:id/toggle	Mark an item as purchased/unpurchased
DELETE	/grocery-list/:id	Remove an ingredient from the grocery list
🛠️ Backend Testing
The backend tests ensure the core functionality of the application is working correctly, including:

1️⃣ Testing User Authentication:
Signup: Verifies new users can register without conflicts.

Login: Confirms that users can log in successfully and receive a JWT token for authentication.

2️⃣ Testing Recipe Management:
Saving Recipes: Ensures users can save their favorite recipes to the database.

Fetching Saved Recipes: Verifies that saved recipes can be retrieved based on user authentication.

Removing Recipes: Confirms that users can remove recipes from their saved list.

3️⃣ Testing Grocery List:
Adding Items: Validates that users can add ingredients to their grocery list.

Toggling Items: Ensures that the purchased state of items can be toggled.

Removing Items: Verifies that ingredients can be removed from the grocery list.

To run backend tests, execute the following command in the backend directory:

sh
Copy
npm run test:backend

🚀 Deployment
MealMatch is deployed on Render:

Frontend: [https://capstone2-bmcv.onrender.com]

Backend: [https://mealmatch-e7s4.onrender.com]

Database: PostgreSQL on Render

👏 Acknowledgments
Special thanks to Edamam API for recipe data and Springboard for guidance!

📌 Future Enhancements
🔹 Improve UI with more animations and themes
🔹 Allow users to generate meal plans
🔹 Add filters for diet preferences (vegan, keto, etc.)

📩 Contact
💬 Feel free to reach out!
GitHub: KurtRanda
LinkedIn: www.linkedin.com/in/kurt-randa

🔥 MealMatch – No More Wasted Ingredients! 🥗🍲🔥