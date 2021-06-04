import "./sass/index.scss";
import { APIController } from "./utils/apiController";
import {
  library,
  dom,
} from "../node_modules/@fortawesome/fontawesome-svg-core";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";

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
  } else {
    alertInfo.innerText = "Music content is empty.";
  }
});
