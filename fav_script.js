//select the DOM
const favouriteMeal = document.getElementById("fav-meals");

const mealDetailsContainer = document.getElementById('meal-details-container');
const backButton = document.getElementsByClassName("back-button")[0];

//add event listener
document.addEventListener('DOMContentLoaded', getFavouriteMeals);
backButton.addEventListener('click', closeRecipePopup);
favouriteMeal.addEventListener('click', removeFromFavourites);
favouriteMeal.addEventListener('click', getRecipeinfo)

//function to fetch and display the favourite meals
function getFavouriteMeals () {
    let favouriteMealsId;

    if(localStorage.getItem("favourites") === null) {
        favouriteMealsId = [];
        return;
    
    }else {
        favouriteMealsId = JSON.parse(localStorage.getItem('favourites'));
    }

    let info = "";
    
    favouriteMealsId.forEach((mealId) => {
       fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
         .then((response) => response.json())
         .then((data) => addFavouriteMeals(data.meals[0], info));
    });
}

//function to add favourite meals to container
function addFavouriteMeals (meal, info) {
    info = `
        <div class= "recipe-item" id="${meal.idMeal}">
            <div class="recipe-img">
                <img src= "${meal.strMealThumb}" alt="food-img"/>
            </div>
            <div class="recipe-name">
                <h3>${meal.strMeal}</h3>
                <a href= "#" class= "recipe-btn">Get Recipe</a>
            </div>
            <button type="submit" class="unfavourite-btn">Remove from Favourite</button>
        </div>    
    `;
    favouriteMeal.innerHTML += info;
}

//to remove meal from favourite
function removeFromFavourites(e) {
    if(!e.target.classList.contains('unfavourite-btn')) {
        return;
    }

    //if unfavourite button is clicked get id of parent
    let favouriteMeal = e.target.parentElement;
    let mealId = favouriteMeal.id;
    let favouriteMealsId = JSON.parse(localStorage.getItem("favourites"));

    //find the id of meal which is clicked
    let idx = favouriteMealsId.indexOf(mealId);

    //remove that meal id from the array in local storage
    favouriteMealsId.splice(idx, 1);
    localStorage.setItem("favourites", JSON.stringify(favouriteMealsId));

    //remove the meal from the local storage
    favouriteMeal.remove();
}

//function to show the popup dialoug box
function getRecipeinfo(e) {
    if(e.target.classList.contains("recipe-btn")) {
        let recipeItem = e.target.parentElement.parentElement;
        console.log(recipeItem);
        const recipeId = recipeItem.id;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
           .then((response) => response.json())
           .then((data) => addRecipeinfo(data.meals[0]));
    }
}

//function to show recipe details
function addRecipeinfo(meal) {

    const ingredients = [];
    for(let i=1; i<=20; i++) {
        if(meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strMeasure${i}`]} of ${meal[`strIngredient${i}`]}`);
        } else {
            break
        }
    }

    console.log(meal);
    let info = `
        <div class="left">
            <div class="meal-card">
                <div class="meal-card-img-container">
                    <img src="${meal.strMealThumb}" alt="">
                </div>
                <div class="meal-name">
                    <p>${meal.strMeal}</p>
                </div>
            </div>
        </div>
        <div class="right">
            <div>
                <h2>Intructions</h2>
                <p class="meal-info">${meal.strInstructions}</p>
            </div>
            <div>
                <h2>Ingredients / Measures</h2>
                <ul>
                    ${ingredients.map(e => `<li>${e}</li>`).join('')}
                </ul>
            </div>
        </div>    
    `
    
    mealDetailsContainer.innerHTML = info;
    mealDetailsContainer.parentElement.classList.add('show-recipe');
    mealDetailsContainer.style.display = 'flex';
}

//function to close the popup
function closeRecipePopup() {
    mealDetailsContainer.parentElement.classList.remove('show-recipe');
}
