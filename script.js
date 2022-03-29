const searchBtn = document.getElementById('search-button');
const recipeList = document.getElementById('recipe');
const fav_meals_container = document.querySelector('.fav-meals');

searchBtn.addEventListener('click', getRecipeList);
recipeList.addEventListener('click', getMealRecipe);

function getRecipeList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();

    console.log(searchInputTxt);
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`)
      .then(response => response.json())
      .then(data => {
          let html ="";
          if(data.meals){
              data.meals.forEach(meal => {
                  html += `
                    <div class='recipe-item' data-id = "${meal.idMeal}">
                        <div class= "recipe-img">
                           <img src= "${meal.strMealThumb}" alt="food">
                        </div>
                        <div class="recipe-name">
                            <div class="recipe-details">
                                <h3>${meal.strMeal}</h3> 
                                <i class="fa-regular fa-heart"></i>
                            </div>
                            <a href= "#" class= "recipe-btn">Get Recipe</a>
                            
                        </div>
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

function addMeal (meal) {
    console.log('add meal');
    const meal_card = documnet.createElement('div');
    meal_card.classList.add('meal-card');
    meal_card.innerHTML = `
                <div class="meal-card-img-container">
                    <img src="${meal.strMealThumb}">
                </div>
                <div class="meal-name">
                    <p>${meal.strMeal}</p>
                    <i class="fa-regular fa-heart"></i>  
                </div>      
    `

    const btn = document.querySelector('.fa-heart');
    btn.addEventListener('click', () => {
        if(btn.classList.contains('fa-regular')) {
            btn.setAttribute('class', 'fa-solid fa-heart');
            addMealLS(meal.idMeal);
        }else {
            btn.setAttribute('class', 'fa-regular fa-heart');
            removeMealLS(meal.idMeal)
        }
        fetchFavMeals();
    })

}

async function getMealById (id) {
    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const respData = await resp.json();
    const meal = respData.meals[0];

    return meal;
}

function addMealLS (mealID) {
    const mealIds = getMealLS()
    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealID]));
    console.log('add meal list');
}

function removeMealLS (mealID) {
    const mealIds = getMealLS();
    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter (id => id !== mealID)))
}

function getMealLS() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
    fav_meals_container.innerHTML = "";

    const mealsIds = getMealLS();
    const meals = [];
    for(let i=0; i<mealsIds.length; i++) {
        const mealID = mealsIds[i];
        const meal = await getMealById(mealID);
        addMealToFav(meal);
        meals.push(meal);
    }
}

function addMealToFav (meal) {
    const fav_meals = document.createElement('div');

    fav_meals.innerHTML = `
        <div class="single">
          <div class="top">
            <div class="img-container">
                <img src="${meal.strMealThumb}">
            </div>
            <div class="text">
                <p>${meal.strMeal}</p>
            </div>
          </div>
          < class="fa-solid fa-x"></i>
        </div>  
    `

    const x = fav_meals.querySelector('.fa-x');
    x.addEventListener('click', () => {
        removeMealLS(meal.idMeal);

        const heart_btns = document.querySelectorAll('.fa-heart');
        heart_btns.forEach(heart_btn => {
            heart_btn.setAttribute('class', 'fa-regular fa-heart');
        });
        fetchFavMeals();
    })

    fav_meals.firstChild.nextSibling.firstChild.nextSibling.addEventListener('click', () => {
        showMealPopup(meal);
    })

    fav_meals_container.appendChild(fav_meals);
}

close_popup_btn.addEventListener('click', () => {
    popup_container.style.display = 'none';
})

function showMealPopup (meal) {
    popup.innerHTML = "";

    const newPopup = documnet.createElement('div');
    newPopup.classList.add('pop-up-inner');

    const ingredients = [];
    for(let i=1; i<=20; i++) {
        if(meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break
        }
    }

    newPopup.innerHTML = `
       <div class="left">
          <div class="meal-card">
             <div class="meal-card-img-container">
                <img src="${meal.strMealThumb}" alt="">
             </div>
             <div class="meal-name">
                <p>${meal.strMeal}</p>
                <i class= "fa-regular fa-heart"></i>
             </div>
          </div>
       </div>
       <div class="right">
           <div>
              <h2>Instructions</h2>
              <p class="meal-info">${meal.strInstructions}</p>
           </div>
           <div>
              <h2>Ingredients / Measures </h2>
              <ul>
                 ${ingredients.map(e => `<li>${e}</li>`).join('')}
              </ul>
           </div>
       </div>                
    `
    popup.appendChild(newPopup);
    popup_container.style.display = 'flex';
}

// function getMealRecipe(e) {
//     e.preventDefault();
//     if(e.target.classList.contains(recipe-btn)) {
//         let mealItem = e.target.parentElement.parentElement;
//         fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
//           .then(response => response.json())
//           .then(data => mealRecipe)
//     }
// }