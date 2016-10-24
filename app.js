// this is my empty variable in which data will be pushed too
var foodApp = {};


//this function calls on the API for recipe information. the recipes are based on the criteria maxTotalTimeInSeconds, 
//which we should convert to minutes for ease of use
foodApp.getFood = function (minutes, course) {
	$.ajax({
		url: 'http://api.yummly.com/v1/api/recipes',
		method: 'GET',
		dataType: 'json',
		data: {
			'_app_key': '013147a0e86c4add87c3fd5f43c091c3',
			'_app_id': 'd23778d5',
			'format': 'json',
			'requirePictures': true,
			'maxTotalTimeInSeconds': minutes,
			'allowedCourse': 'course^course-' + course
		}
	})
	.then(function(recipeResults) {
		console.log('list', recipeResults)
		var recipes = recipeResults.matches;
		foodApp.displayRecipes(recipes);
	})
};//closes getFood


//display the results based on the selected time that the user has specified
foodApp.displayRecipes = function(arrayOfRecipesFilteredByTime){
	$('#recipeContainer').empty(); //clear all of the previous results when you search a new time constraint


	//push the information onto the page using jquery to create elements
	arrayOfRecipesFilteredByTime.forEach(function(specificRecipe){
		// console.log(specificRecipe);
		var $foodContainer = $('<div>').addClass('carousel-cell');
		var $contentContainer = $('<div>').addClass('clearfix');
		var $recipeTitle = $('<h3>').text(specificRecipe.recipeName);
		var $recipeImage = $('<img>').attr('src', specificRecipe.smallImageUrls[0].replace(/=s90/ig,""));
		var $ingredientTitle = $('<h5>').text("Ingredients");
		var $recipeIngredients = $('<ul>');
		$contentContainer.append($recipeImage,$ingredientTitle,$recipeIngredients);
		var $recipeInformation = $('<a>').attr('href', 'http://www.yummly.com/recipe/' + specificRecipe.id).text("Click here for instructions!");
		specificRecipe.ingredients.forEach(function(ingredients){
			console.log(ingredients);
			$recipeIngredients.append(`<li>${ingredients}</li>`);
		})
		$foodContainer.append($recipeTitle,$contentContainer, $recipeInformation); //pushing the data that we want into our container
		$('#recipeContainer').append($foodContainer); //puts it on the page

	});
	$('#recipeContainer').bxSlider({
		minSlides: 1,
		maxSlides: 1,
		infiniteLoop: true,
	})
}; //closes displayRecipes

foodApp.init = function(){


	$('form').on('submit', function(e){
		e.preventDefault();
		console.log('this working?')
		// get the chosen time in minutes
		var chosenTime = $('input[type=search]').val();
		console.log(chosenTime);
		//convert chosen minutes into seconds
		var chosenTimeInSeconds = parseInt(chosenTime) * 60;
		//need to also filter by type of food (e.g. beverage, desert, etc.)
		var typeOfFoodChoice = $('input[name=foodType]:checked').val();
		console.log("clicked", typeOfFoodChoice)
		// console.log("this is the food type", typeOfFoodChoice);
		// console.log(chosenTimeInSeconds);
		if((typeOfFoodChoice === undefined || chosenTime === "")) {
		alert("Please fill in all fields");
		return false;
		} else {
		foodApp.getFood(chosenTimeInSeconds, typeOfFoodChoice);
		console.log();
		};
	});
}; //closes init


//doc ready
$(function(){
	foodApp.init();

	//insert jquery here to control which part of the site you are seeing
	//hide everything except for the first section
	$('.main').hide();
	$('.results').hide();

	//add style to the labels when you click on them
	$('.mealTypeItem').on('click', function(){
		$('.mealTypeItem').removeClass('jsSelectedLabel');
		$(this).addClass('jsSelectedLabel');
	});

	//reveal the main section and hide the header on click
	$('.startBtn').on('click', function(){
		$('.titlePage').hide();
		$('.main').fadeIn();

	//reveal the results when you submit the time and type of meal
	$('.resultsBtn').on('click', function(){
		$('.main').hide();
		$('.results').fadeIn();
	})

	//go back to the page to put in a new time and meal type
	//clear out all previously filled in information
	$('.newSearchBtn').on('click', function(){
		$('.results').hide();
		$('.mealTypeItem').removeClass('jsSelectedLabel');
		$('input[type=radio]').attr('checked', false);
		$('input[type=search]').val('');
		$('input[type=search').empty();
		$('.main').fadeIn();
	});

	});

}); //close doc ready









