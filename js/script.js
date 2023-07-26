let countryState;
let categoryState;
/* 
Here is an updated version of the app
  contents:
    0- Guidelines
    1- Following naming conventions
    2- Fixing bugs and unexpected behaviours
    3- Clean code tips
    4- Todos to work on next
*/

/* 
  Guidelines
    1- Utils:-
      (-) sign in front of code means that it has been removed or replaced.
      (+) sign in front of code means that it has been just added or added to replace previous code which will properly has a (-) sign in front of it.
    2- Nameing conventions:-
      Nameing conventions are some patterns used in the community by alot of people which is very important to follow to make the code more readable
      Ex: assign i as a variable name inside a for loop.
*/

// Nameing conventions
// instead of
// let newData = new XMLHttpRequest();
// do
const xhr = new XMLHttpRequest();

// Unacceptable variable name
// let cartona = ``;
// do instead
let dataContainer = ``;

/* It's always a good practice to follow same casing
  for the whole project for examples:-
  camel case => "justTest"
  snake case => "just_test"
  pascal case => "JustTest"
  also keep an eye out of spelling mistakes
  county => should be "country"
 */

/* instead of
  let links = document.querySelectorAll(".county-Codes");
  let categoryLinks = document.querySelectorAll(".categoryLinks");
  Either do
  let links = document.querySelectorAll(".county-codes");
  let categoryLinks = document.querySelectorAll(".category-links");
  or
  let links = document.querySelectorAll(".countryLinks");
  let categoryLinks = document.querySelectorAll(".categoryLinks");
  Also keep in mind that you're dealing with a singular unit so it would be
  suitable to use singlar class name for each element
  Do instead
*/

/* 
  Clean code wise any variable with constant data should be declared using const instead of let and you should STOP using var keyword
  (as it leads to unexpected behaviours)
*/

const countryLinks = document.querySelectorAll(".countryLink");
const categoryLinks = document.querySelectorAll(".categoryLink");
const defaultImageUrl =
	"https://logos.flamingtext.com/Word-Logos/article-design-sketch-name.webp";
/* don't rely on a variable for function to keep in sync with
 - let newsDataAr = [];
*/

/* 
  Clean code wise, functions with multi params should expect an object to   prevent any confusion
  - function getNews(countryCode, category) {}
  - getNews(category, countryCode) //replacing the two args with each other which is wrong
  + function getNews({countryCode, category}) {}
  + getNews({category: "category1", countryCode: "country1"})
  === 
  If you don't quite get the previous syntax please revert to js object destructuring on functions params. 
  ===
  Also would be better to either name the params [country, category] or [countryCode, categoryCode]
*/

/* 
  This how you can add default values for params in your function to fallback to incase an arg wasn't provided
  getNews({ country = "us", category = "health" })
  or if accept normal params
  getNews(country = "us", category = "health")
  if we want to call getNews without providing any args
  we can set a default param for the entire obj
  { country = "us", category = "health" } = 
  // Hint: the following obj is to handle such case
  {
		country: "us",
		category: "health",
	}
*/

const defaultObjParam = {
	country: "us",
	category: "health",
};

function getNews({ country = "us", category = "health" } = defaultObjParam) {
	dataContainer = ``;
	xhr.open(
		"GET",
		`https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=61c6eb8091544c8b8724e44c7dcef016`
	);
	xhr.send();
	xhr.addEventListener("readystatechange", function () {
		if (xhr.readyState == 4 && xhr.status === 200) {
			/* 
        Pass response directly to ui handler function and don't rely on a variable for the ui function to keep track of (e.g: Country bug)
        - newsDataAr = JSON.parse(xhr.response).articles;
        + const response = JSON.parse(xhr.response).articles;
      */
			const response = JSON.parse(xhr.response).articles;
			newsData(response);
		}
	});
}

function renderText(str, MAX_LENGTH = 80) {
	let truncatedString = str.slice(0, MAX_LENGTH);
	if (str.length > MAX_LENGTH) {
		truncatedString += "...";
	}
	return truncatedString;
}

function newsData(response) {
	for (i = 0; i < response.length; i++) {
		if (response[i].urlToImage === null) {
			response[i].urlToImage = defaultImageUrl;
		}
		console.log(response[i].title.split(" ").splice(0, 5).join(" "));
		dataContainer += ` <div class="col-md-3 item-parent">
        <div class="item">
          <img height=250 class="w-100" src="${response[i].urlToImage}" />
          <h6 class="my-3">${renderText(response[i].title, 20)}</h6>
          <p class="h-25" style="min-height: 72px">${
						response[i].description
							? renderText(response[i].description)
							: "lorem ipsum"
					}</p>
        </div>
      </div>
    `;
	}
	document.getElementById("newsItems").innerHTML = dataContainer;
}

/* 
  Keep in mind that since the api call depend on both
  args passed to the getNews function you should either
  provide those two args on every call or provide a default param 
  (see getNews function)
*/

for (i = 0; i < countryLinks.length; i++) {
	countryLinks[i].addEventListener("click", function (e) {
		const country = e.target.getAttribute("data-code");
		/*
      If the variable passed as value is same name as the object key you can omit it
		  getNews({ country: country});
      or
		  getNews({ country });
    */
		// Will leave it for simplicity
		countryState = country;
		getNews({ country: country, category: categoryState });
	});
}
for (i = 0; i < categoryLinks.length; i++) {
	categoryLinks[i].addEventListener("click", function (e) {
		const category = e.target.getAttribute("data-code");
		// pass undefined for country to rely on default value
		categoryState = category;

		getNews({ country: countryState, category: category });
	});
}

/*
  You don't need to pass args anymore as we added default params
  - getNews("us", "health");
  or
  - getNews({country: "us", category: "health"});
  + getNews()
*/

getNews();

/*
  Todo1: Add a loading mechanism to support UI/UX.

  Todo2: Error handling mechanism. 
    (check xhr.onerror function).

  Todo3: Try to make all articles the same for dims prospective.
    (including: same height, same image dims and margins and padding).

  Todo4: Find a way to handle articles with no images.
    (can add a default image? or find a way to make the layout looks good with much variable).

  Todo5: Start using version control tools such as git.

  Todo6: Look up what's fetch api and why it was introduced.
    (when we already have something like XMLHttpRequest()).

  Todo6: Maybe lookup a way to structure your project in an organized manner.
*/
