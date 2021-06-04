import "./sass/index.scss";
import { APIController } from "./utils/apiController";
import {
  library,
  dom,
} from "../node_modules/@fortawesome/fontawesome-svg-core";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { pagination } from "./utils/pagination";

library.add(faCheck);
dom.watch();

const apiController = new APIController();

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const playlistBtn = document.getElementById("playlistBtn");
const loginBtn = document.getElementById("login-button");
const alertInfo = document.querySelector(".alertInfo");
const loginWrapper = document.getElementById("login-wrapper");
const albumsWrapper = document.getElementById("albums-grid-wrapper");
const albumDetailsButtons = [];

// searchInputByEnter = document.addEventListener("keyup", checkEnter);

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (apiController.authorize()) {
    loginWrapper.classList.remove("login__wrapper--show");
  }
});

searchBtn.addEventListener("click", () => {
  if (searchInput.value !== "") {
    apiController.searchAlbum(
      searchInput.value,
      albumsWrapper,
      albumDetailsButtons
    );
    searchInput.value = "";
    alertInfo.innerText = "";
  } else {
    alertInfo.innerText = "Music content is empty.";
  }
});

const checkEnter = () => {
  if (event.keyCode === 13) {
    searchAlbum();
  }
};

const list_items = [
  "Item 1",
  "Item 2",
  "Item 3",
  "Item 4",
  "Item 5",
  "Item 6",
  "Item 7",
  "Item 8",
  "Item 9",
  "Item 10",
  "Item 11",
  "Item 12",
  "Item 13",
  "Item 14",
  "Item 15",
  "Item 16",
  "Item 17",
  "Item 18",
];

const list_element = document.getElementById("list");
const pagination_element = document.getElementById("pagination");

let current_page = 2;
let rows = 6;

function displayList(items, wrapper, rows_per_page, page) {
  wrapper.innerHTML = "";
  page--;

  let start = rows_per_page * page;
  let end = start + rows_per_page;
  let paginatedItems = items.slice(start, end);

  for (let i = 0; i < paginatedItems.length; i++) {
    let item = paginatedItems[i];

    let item_element = document.createElement("div");
    item_element.classList.add("item");
    item_element.innerText = item;

    wrapper.appendChild(item_element);
  }
}

function setupPagination(items, wrapper, rows_per_page) {
  wrapper.innerHTML = "";

  let page_count = Math.ceil(items.length / rows_per_page);
  for (let i = 1; i < page_count + 1; i++) {
    let btn = PaginaionButton(i, items);
    wrapper.appendChild(btn);
  }
}

function PaginaionButton(page, items) {
  let button = document.createElement("button");
  button.innerText = page;

  if (current_page == page) {
    button.classList.add("active");
  }
  button.addEventListener("click", () => {
    current_page = page;
    displayList(items, list_element, rows, current_page);

    let current_btn = document.querySelector(".pagenumbers button.active");
    current_btn.classList.remove("active");

    button.classList.add("active");
  });

  return button;
}

displayList(list_items, list_element, rows, current_page);
setupPagination(list_items, pagination_element, rows);
