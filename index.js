
const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealEL = document.getElementById('meals');
const resultHeading = document.getElementsByClassName('resut-heading');
const single_mealEL = document.getElementById('single-meal');

$(".nav-toggel-btn").click(function(){
    $(this).toggleClass("fa-times");
    $(".nav-tab-menu").toggleClass("open-menu");
    $(".strip-header-nav").toggleClass("nav-transition");
});


//-------------------------------------------------------------

function searchMeal(e){
    e.preventDefault();

    single_mealEL.innerHTML="";
    const term = search.value ;
    if(term.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
            resultHeading.innerHTML = `<h2>search Result for ${term}`;
            if(data.meals ===null){
                resultHeading.innerHTML = `<h2>There Are No Result for ${term}`;
            }else{
                mealEL.innerHTML = data.meals
                .map(
                    (meal) => 
                      `<div class="meal">
                      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                      <div class="meal-info" data-mealID="${meal.idMeal}">
                          <h3>${meal.strMeal}</h3>
                    </div>
                    </div>`
                    )
                    .join("");
            }
        });
        
    }else{
        alert('please inter a value in search');
    }
}

//------------------------------------------
function getMealById(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    
    .then(res => res.json())
    .then(data => {
        console.log(data);
        const meal = data.meals[0];
        addMealToDOM(meal);
    });
}

//----------------------------------------
function randomMeal(){
    mealEL.innerHTML='';
    resultHeading.innerHTML='';

    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];
        addMealToDOM(meal);
    })

}
//------------------------------------------------

function addMealToDOM(meal){
    const ingredients = [];
    for(let i=0; i<=20; i++){
        if(meal[`strIgredient${i}`]){
            ingredients.push(`
            ${meal[`strIngredients${i}`]} - ${meal[`strMeasure${i}`]}
            `);
        }else{
            break;
        }
    }
    single_mealEL.innerHTML = `
    <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
    <div class="single-meal-info">
    ${meal.strCategory ? `<p>${meal.strCategory}</p>`:''}
    ${meal.strArea ? `<p>${meal.strArea}</p>`:''}
    </div>
    <div class="main">
    <p>${meal.strInstructions}</p>
    <h2>Ingredients</h2>
    <ul>
    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
    </ul>
    </div>
    </div>
    `
}
//------------------------------------------

submit.addEventListener('submit',searchMeal);
random.addEventListener('click',randomMeal);
mealEL.addEventListener('click',(e) => {
    const mealInfo = e.path.find(item => {
        if(item.classList){
            return item.classList.contains("meal-info");
        }else{
            return false;
        }
    });
    if (mealInfo) {
        const mealID = mealInfo.getAttribute("data-mealid");
        getMealById(mealID);
    }
});






