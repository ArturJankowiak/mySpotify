import { apiRoutes } from "./apiRoutes";
import { getUrl } from "./apiHelper";

let redirect_url = "http://localhost:5005/webpack-dev-server/";
let client_secret = "b588ccfd3bf8413d891dd94cdcd91d0b";

const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";

function onPageLoad() {}

// export function requestAuthorization() {
//   localStorage.setItem("client_id", client_id);
//   localStorage.setItem("client_secret", client_secret);

//   let url = AUTHORIZE;
//   url += "?client_id=" + client_id;
//   url += "&response_type=code";
//   url += "&redirect_uri=" + encodeURI(redirect_url);
//   url += "&show_dialog=true";
//   url +=
//     "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";

//   fetch(url, { mode: "no-cors" }).then((res) => console.log(res));
// }

export class APIController {
  constructor() {
    this.imgEl = document.querySelector(".featured-album__image img");
  }

  clientId = "770481c017984602a1c058800815e26d";
  redirect_url = "http://localhost:5005/webpack-dev-server/";
  clientSecret = client_secret;
  token = "";
  tokenType = "";
  headers = {};

  authorize() {
    const token = this._checkTokenExsist();
    if (!token || token === "null" || token === "false") {
      window.open(
        `https://accounts.spotify.com/authorize?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirect_url}`
      );
      sessionStorage.setItem(
        "token",
        new URLSearchParams(window.location.search).get("code")
      );
    } else {
      sessionStorage.setItem("token", token);
    }

    this.token = token;
    return true;
  }

  _checkTokenExsist() {
    const sessionToken = sessionStorage.getItem("token");
    const urlToken = new URLSearchParams(window.location.search).get("code");

    if (sessionToken) {
      return sessionToken;
    } else if (urlToken) {
      return urlToken;
    } else {
      return false;
    }
  }

  _getToken = async () => {
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(this.clientId + ":" + client_secret),
      },
      body: "grant_type=client_credentials",
    });

    const data = await result.json();
    this.token = data.access_token;
    this.tokenType = data.token_type;
    this.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `${this.tokenType} ${this.token}`,
    };
  };

  searchAlbum(album) {
    const query = { q: album, type: "album" };
    fetch(getUrl(apiRoutes.search, query), {
      method: "GET",
      headers: this.headers,
    }).then((response) => response.json());
  }

  getSingleAlbum(albumId) {
    fetch(getUrl(apiRoutes.album, { id: albumId }), {
      method: "GET",
      headers: this.headers,
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }

  init() {
    this.searchAlbum().then((data) =>
      this.imgEl.setAttribute("src", data.image[0].url)
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new APIController();
});
