import "./sass/index.scss";
import { APIController } from "./utils/apiController";

const apiController = new APIController();

apiController._getToken();

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const playlistBtn = document.getElementById("playlistBtn");

searchBtn.addEventListener("click", () => {
  if (searchInput.value !== "") {
    apiController.searchAlbum(searchInput.value);
    searchInput.value = "";
  } else {
    alert("!!!");
  }
});
