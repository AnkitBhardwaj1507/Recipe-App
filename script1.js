
const searchInputTxt = document.getElementById('search-input')
const searchBtn = document.getElementById('search-button');
const recipeList = document.getElementById('recipe');
const mealDetailsContainer = document.getElementById('meal-details-container');
const backButton = document.getElementsByClassName("back-button")[0];

//Event Listener
searchBtn.addEventListener('click',searchRecipe);
searchInputTxt.addEventListener('input', searchRecipe);
backButton.addEventListener('click', closeRecipePopup);
recipeList.addEventListener('click', getRecipeinfo);
recipeList.addEventListener('click',addToFavourites);


function searchRecipe() {
    let inputTxt = searchInputTxt.value;
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputTxt}`)
        .then(response => response.json())
        .then(data => {
            let html ="";
            if(data.meals){
                data.meals.forEach(meal => {
                    html += `
                        <div class='recipe-item' id = "${meal.idMeal}">
                            <div class= "recipe-img">
                                <img src= "${meal.strMealThumb}" alt="food-img">
                            </div>
                            <div class="recipe-name">
                                <h3>${meal.strMeal}</h3> 
                                <a href= "#" class= "recipe-btn">Get Recipe</a>
                            </div>
                            <button type="submit" class="favourite-button">Add To Favourite </button>
 
                        </div>
                    `;
            });
            recipeList.classList.remove('notFound');
        }else {
            html = "Sorry, We Didn't Find Any Meal";
            recipeList.classList.add('notFound');
        }

        recipeList.innerHTML = html;
      });

}

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

function closeRecipePopup() {
    mealDetailsContainer.parentElement.classList.remove('show-recipe');
}

function addToFavourites(e) {
    if(!e.target.classList.contains("favourite-button")) {
        return;
    }

    let mealId = e.target.parentElement.id;
    let favouriteMeals;

    if(localStorage.getItem('favourites') === null) {
        favouriteMeals = [];
    }else {
        favouriteMeals = JSON.parse(localStorage.getItem("favourites"));
    }

    if(favouriteMeals.indexOf(mealId) !== -1) {
        return;
    }

    favouriteMeals.push(mealId);
    localStorage.setItem('favourites', JSON.stringify(favouriteMeals));

}

