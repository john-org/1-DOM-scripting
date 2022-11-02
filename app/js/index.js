const nav = document.querySelector(".main-menu");

const markup = `
<ul>
${navItemsObject
  .map(
    (item, index) =>
      `<li class="navitem-${index}"><a href="${item.link}">${item.label}</a></li>`
  )
  .join("")}
</ul>
`;

console.log(markup);

// nav.innerHTML = markup;
nav.querySelector("#main-nav").innerHTML = markup;

// const logo = document.querySelector(".navitem-0");
// logo.classList.add("logo");
// logo.innerHTML = '<a href="#"><img src="img/logo.svg" /></a>';

const logo = document.createElement("li");
const navList = nav.querySelector("nav ul");
logo.classList.add("logo");
logo.innerHTML = '<a href="#"><img src="img/logo.svg" /></a>';
navList.prepend(logo);

const categories = navItemsObject.map((item) => item.link);
console.log(categories);

const navItems = document.querySelectorAll("li[class^='navitem-']");
console.log(navItems);

// Fetch

const root = document.querySelector(".site-wrap");
const nytapi = "GFV6W6G623mAEAO8fSJhtAocBVlkb3hB"; // note this is my API key
const nytUrl = `https://api.nytimes.com/svc/topstories/v2/travel.json?api-key=${nytapi}`;

// Fetch example
// fetch(nytUrl)
//   .then((response) => response.json())
//   // storing the data in localstorage to avoid hitting the API limit
//   .then((myJson) => localStorage.setItem("stories", JSON.stringify(myJson)))
//   .then(renderStories);

// Fetch to console
// function renderStories() {
//   let data = JSON.parse(localStorage.getItem("stories"));
//   data.results.forEach(function (story) {
//     console.log(story);
//   });
// }

// Fetch and call renderStories
// fetch(nytUrl)
//   .then((response) => response.json())
//   .then((myJson) => localStorage.setItem("stories", JSON.stringify(myJson)))
//   .then(renderStories);

// Fetch included in another function
function fetchArticles(section) {
  section = section.substring(1);
  if (!localStorage.getItem(section)) {
    console.log("section not in local storage, fetching");
    fetch(
      `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${nytapi}`
    )
      .then((response) => response.json())
      .then((myJson) => localStorage.setItem(section, JSON.stringify(myJson)))
      .then(renderStories(section))
      .catch((error) => {
        console.warn(error);
      });
  } else {
    console.log("section in local storage");
    renderStories(section);
  }
}

async function renderStories(section) {
  setActiveTab(`#${section}`);
  let data = await JSON.parse(localStorage.getItem(section));
  if (data) {
    data.results.map((story) => {
      var storyEl = document.createElement("div");
      storyEl.className = "entry";
      storyEl.innerHTML = `
      <img src="${story.multimedia ? story.multimedia[0].url : ""}" alt="${
        story.title
      }" />

      <div>
        <h3><a target="_blank" href="${story.short_url}">${story.title}</a></h3>
        <p>${story.abstract}</p>
      </div>
      `;
      root.prepend(storyEl);
    });
  } else {
    console.log("data not ready yet");
  }
}

navItems.forEach((item, index) => {
  item.addEventListener("click", (e) => {
    console.log("categories[index]:::", categories[index]);
    fetchArticles(categories[index]);
  });
});

function setActiveTab(section) {
  const activeTab = document.querySelector("a.active");
  if (activeTab) {
    activeTab.classList.remove("active");
  }
  const tab = document.querySelector(`li a[href="${section}"]`);
  tab.classList.add("active");
}
fetchArticles("#arts");
