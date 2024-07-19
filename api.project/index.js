const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = '<h2>Fetching recipe...</h2>';
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();

        // Clear previous results
        recipeContainer.innerHTML = '';

        if (response.meals) {
            response.meals.forEach(meal => {
                // Create a recipe div
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');

                recipeDiv.innerHTML = `
                    <ul>
                        <li><img src="${meal.strMealThumb}" alt="${meal.strMeal}"></li>
                        <li><h3>${meal.strMeal}</h3></li>
                        <li><p><span>${meal.strArea}</span> Dish</p></li>
                        <li><p>Enjoy your <span>${meal.strCategory}</span>!!</p></li>
                    </ul>
                `;
                const button = document.createElement('button');
                button.textContent = "View Recipe";
                recipeDiv.appendChild(button);

                // Adding event listener to recipe button
                button.addEventListener('click', () => {
                    openRecipePopup(meal);
                });

                // Append the recipe div to the recipe container
                recipeContainer.appendChild(recipeDiv);
            });
        } else {
            recipeContainer.innerHTML = '<p>No recipes found.</p>';
        }
    } catch (error) {//agar recipe naa ho to for good UI
        recipeContainer.innerHTML = '<p>Error fetching recipes. Please try again later.</p>';
        console.error('Error fetching recipes:', error);
    }
};

// Function for fetching ingredients and measurements
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
};

const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
     
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div  class="recipeinstruction">
        <h3>Instruction:</h3>
        <p>${meal.strInstructions}</p>
        </div>
        
    `;
    recipeDetailsContent.parentElement.style.display = "block";
};

recipeCloseBtn.addEventListener('click', ()=>{

    recipeDetailsContent.parentElement.style.display="none";
});
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (searchInput) { //agar search btn me koi input h to hi response aayega
        fetchRecipes(searchInput);
    }
});
