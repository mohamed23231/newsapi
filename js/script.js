let countryState;
let categoryState;

const xhr = new XMLHttpRequest();

let dataContainer = ``;

const countryLinks = document.querySelectorAll(".countryLink");
const categoryLinks = document.querySelectorAll(".categoryLink");
const defaultImageUrl =
  "https://logos.flamingtext.com/Word-Logos/article-design-sketch-name.webp";

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

for (i = 0; i < countryLinks.length; i++) {
  countryLinks[i].addEventListener("click", function (e) {
    const country = e.target.getAttribute("data-code");

    countryState = country;
    getNews({ country: country, category: categoryState });
  });
}
for (i = 0; i < categoryLinks.length; i++) {
  categoryLinks[i].addEventListener("click", function (e) {
    const category = e.target.getAttribute("data-code");
    categoryState = category;

    getNews({ country: countryState, category: category });
  });
}

getNews();
