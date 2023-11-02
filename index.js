const searchBtn = document.querySelector(".search-button");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");

searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
  mealDetailsContent.parentElement.classList.remove("showRecipe");
});
document.body.onload = getMealList();

function getMealList() {
  let searchInputTxt = document.querySelector(".search-input").value.trim();
  fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`
  )
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      if (data.meals) {
        data.meals.forEach((meal) => {
          html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
        });
        mealList.classList.remove("notFound");
      } else {
        html = "Sorry, we didn't find any meal!";
        mealList.classList.add("notFound");
      }

      mealList.innerHTML = html;
    });
}

// get recipe of the meal
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.parentElement;
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    )
      .then((response) => response.json())
      .then((data) => mealRecipeModal(data.meals));
  }
}

// create a modal
function mealRecipeModal(meal) {
  console.log(meal);
  meal = meal[0];
  let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class= "recipe-ingridients">
        <h1>Ingridients:</h1>
         <li>${meal.strIngredient1}</li>
         <li>${meal.strIngredient2}</li>
         <li>${meal.strIngredient3}</li>
         <li>${meal.strIngredient4}</li>
         <li>${meal.strIngredient5}</li>
         <li>${meal.strIngredient6}</li>
         <li>${meal.strIngredient7}</li>
         <li>${meal.strIngredient8}</li>
        </div>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("showRecipe");
}

const form = document.querySelector("form");
const recipeList = document.querySelector("#recipe-list");
const noRecipes = document.getElementById("no-recipes");
const searchBox = document.getElementById("search-box");

document.querySelector(".form").addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  let recipeObj = {
    name: event.target.name.value,
    method: event.target.method.value,
    ingredients: event.target.ingredients.value,
  };

  putRecipe(recipeObj);
  getAllRecipies();
}

function displayRecipes(recipe) {
  recipeList.innerHTML = "";

  const recipeDiv = document.createElement("div");

  recipeDiv.innerHTML = `
        <h3>${recipe.name}</h3>
        <p><strong>Ingredients:</strong></p>
        <ul>
          ${recipe.ingredients
            .map((ingredients) => `<li>${ingredients}</li>`)
            .join("")}
        </ul>
        <p><strong>Method:</strong></p>
        <p>${recipe.method}</p>
        <button class="delete-button" data-index="${index}">Delete</button>`;
  recipeDiv.classList.add("recipe");
  recipeList.appendChild(recipeDiv);

  if (recipe.length > 0) {
    noRecipes.style.display = "none";
  } else {
    noRecipes.style.display = "flex";
  }
}

function getAllRecipies() {
  fetch("http://localhost:3000/recipies")
    .then((response) => response.json())
    .then((recipeData) =>
      recipeData.forEach((recipe) => displayRecipes(recipe))
    );
}

function putRecipe(recipeObj) {
  fetch("http://localhost:3000/recipies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipeObj),
  }).then((res) => res.json());
}
