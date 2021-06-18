import { apiRoutes } from "./apiRoutes";
import { getUrl } from "./apiHelper";
// import { singleAlbumTemplate } from "../templates/singleAlbum";
// import Handlebars from "handlebars";

// const myTemplate = require("../templates/singleAlbum.txt");
// const template = Handlebars.compile("Name: {{name}}");

let client_secret = "b588ccfd3bf8413d891dd94cdcd91d0b";
const loginBtn = document.getElementById("login-button");
const loginWrapper = document.getElementById("login-wrapper");

export class APIController {
  clientId = "770481c017984602a1c058800815e26d";
  redirect_url = "http://localhost:5005/webpack-dev-server/";
  clientSecret = client_secret;
  token = "";
  tokenType = "";
  headers = {};
  activePlaylistId = "";
  currentAlbum = "";

  constructor() {
    this.prepareEvents();
  }

  prepareEvents() {
    const _self = this;
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (_self.authorize()) {
        loginWrapper.classList.remove("login__wrapper--show");
      }
    });
  }

  authorize() {
    const token = this._checkTokenExsist();
    if (!token || token === "null" || token === "false") {
      window.open(
        `https://accounts.spotify.com/authorize?scope=playlist-read-private,playlist-modify-public,playlist-modify-private&response_type=token&client_id=${this.clientId}&redirect_uri=${this.redirect_url}`
      );
      sessionStorage.setItem("token", this._getAccesTokenFromURL());
    } else {
      sessionStorage.setItem("token", token);
    }

    this.token = token;
    this.headers = {
      Authorization: `Bearer ${token}`,
    };
    this.init();
    return true;
  }

  _checkTokenExsist() {
    const sessionToken = sessionStorage.getItem("token");
    const urlToken = this._getAccesTokenFromURL();

    if (sessionToken) {
      return sessionToken;
    } else if (urlToken) {
      return urlToken;
    } else {
      return false;
    }
  }

  _getAccesTokenFromURL() {
    const hash = window.location.hash.substring(1);
    const accessString = hash.indexOf("&");
    return hash.substring(13, accessString);
  }

  searchAlbum(album, albumsWrapper, albumsDetailsButtons, page = 1) {
    this.currentAlbum = album;
    const query = { q: album, type: "album" };
    const filters = { page: page, limit: 20 };
    fetch(getUrl(apiRoutes.search, query, filters), {
      method: "GET",
      headers: this.headers,
    })
      .then((response) => response.json())

      .then((response) => {
        const {
          albums: { items },
        } = response;
        albumsWrapper.innerHTML = "";
        items.forEach((album) => {
          const albumWrap = document.createElement("div");
          albumWrap.classList.add("album-tile__wrapper");
          albumWrap.innerHTML = `
          <div class="album-tile__wrapper--box">
            <div class="album-tile__wrapper--img">
              <div class="featured-album" style="background-image: url('${album.images[0].url}')">
                <div class="featured-album__description">
                  <p class="featured-album__description--text">
                    Artist - <span class="description__info">${album.artists[0].name}</span>
                  </p>
                  <p class="featured-album__description--text">
                    Album name -
                    <span class="description__info">${album.name}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="featured-album__description--summary">
            <p class="summary summary__top">
              Album type 
              <span class="summary__info--type">${album.album_type}</span>
            </p>
            <p class="summary summary__center">
              Relaese date <span class="summary__info--date">${album.release_date}</span>
            </p>
            <p class="summary">
              Total tracks  <span class="summary__info--tracks">${album.total_tracks}</span><span class="summary__info--crossed">${album.total_tracks}</span>
            </p>
          </div>
          <div class="albums-container__btn">
            <a href="#" data-album-id="${album.id}" class="button albumDetailsBtn">
              Get track list
            </a>
          </div>`;

          albumsWrapper.appendChild(albumWrap);
        });
      })
      .then(() => {
        albumsDetailsButtons = document.querySelectorAll(".albumDetailsBtn");
        albumsDetailsButtons.forEach((albumBtn) => {
          albumBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.getSingleAlbum(albumBtn.getAttribute("data-album-id"));
          });
        });
      });
  }

  getSingleAlbum(albumId) {
    fetch(getUrl(apiRoutes.album.replace("{id}", albumId), null), {
      method: "GET",
      headers: this.headers,
    })
      .then((res) => res.json())
      .then((album) => {
        this.closePopup();
        const albumPopup = document.createElement("div");
        albumPopup.classList.add("popup");
        // const singleAlbum = Handlebars.compile(singleAlbumTemplate);
        let albumPopupHTML = `<div class="popup__container">
        <div class="popup__area" id="popup">
          <a href="#" class="popup__close" id="closePopup">X</a>
          <div class="avatar" style="background-image: url('${album.images[0].url}')"></div>
          <p class="popup__album-name">${album.name}</p>
          <div class="dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <ul class="popup__album-details">`;

        album.tracks.items.forEach(
          (track) =>
            (albumPopupHTML += `<li class="textarea">${track.name} <a href="#" class="add-track-btn" data-track-uri="${track.uri}">Add</a></li>`)
        );

        albumPopupHTML += `</ul>
        </div>
        
      </div>`;

        albumPopup.innerHTML = albumPopupHTML;
        document.body.appendChild(albumPopup);
      })
      .then(() => {
        const addTrackBtns = document.querySelectorAll(".add-track-btn");
        addTrackBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            if (this.activePlaylistId && this.activePlaylistId !== "") {
              const albumURI = btn.getAttribute("data-track-uri");
              this.addAlbumsToPlaylist(albumURI);
            } else {
              alert("Select a playlist!");
            }
          });
        });
        const closePopup = document.getElementById("closePopup");
        closePopup.addEventListener("click", this.closePopup);
      });
  }

  getPlaylists() {
    fetch(getUrl(apiRoutes.playlists), {
      method: "GET",
      headers: {
        Authorization: "Bearer " + this.token,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        const playlistWrapper = document.getElementById("playlist-wrapper");
        let playlistsHTML = "";
        response.items.forEach((playlist) => {
          playlistsHTML += `<li class="playlist__wrapper--item">
          <a href="#" data-playlist-id="${playlist.id}" class="playlist">${playlist.name}</a>
          <div class="accordian__content" id="${playlist.id}">
        </div>
        </li>`;
        });

        playlistWrapper.innerHTML = playlistsHTML;
      })
      .then(() => {
        this.markPlaylist();
        const allPlaylistElement = document.querySelectorAll(".playlist");
        allPlaylistElement.forEach((trackList) => {
          trackList.addEventListener("click", (event) => {
            allPlaylistElement.forEach((item) =>
              item.nextElementSibling.classList.remove(
                "accordian__content-trackList--active"
              )
            );
            const playlistId = event.target.getAttribute("data-playlist-id");
            const trackListItemsWrap = trackList.nextElementSibling; // rodzeństwo
            console.log(trackListItemsWrap.childNodes);
            console.log(trackListItemsWrap.childNodes.length);
            if (trackListItemsWrap.childNodes.length === 1) {
              this.getPlaylistItems(playlistId).then(
                trackListItemsWrap.classList.add(
                  "accordian__content-trackList--active"
                )
              );
            } else {
              trackListItemsWrap.classList.toggle(
                "accordian__content-trackList--active"
              );
            }
          });
        });
      });
  }

  markPlaylist() {
    const allPlaylists = document.querySelectorAll(".playlist");
    allPlaylists.forEach((playlist) => {
      playlist.addEventListener("click", (e) => {
        e.preventDefault();
        allPlaylists.forEach((pl) =>
          pl.parentNode.classList.remove("playlist__wrapper--item--active")
        );
        playlist.parentNode.classList.add("playlist__wrapper--item--active");
        this.activePlaylistId = playlist.getAttribute("data-playlist-id");
        console.log("activePlaylistId", this.activePlaylistId);
      });
    });
  }

  addAlbumsToPlaylist(albumsURI) {
    fetch(
      getUrl(
        apiRoutes.addPlaylist.replace("{playlist_id}", this.activePlaylistId),
        { uris: albumsURI }
      ),
      {
        method: "POST",
        headers: this.headers,
      }
    )
      .then(() => alert("This song is added to the playlist."))
      .then(() => this.getPlaylistItems(this.activePlaylistId))
      .catch((err) => alert(err));
  }

  getPlaylistItems(id) {
    return fetch(getUrl(apiRoutes.playlistItems.replace("{playlist_id}", id)), {
      method: "GET",
      headers: this.headers,
    })
      .then((respo) => respo.json())
      .then((tracks) => {
        const accordianContent = document.getElementById(`${id}`);
        let trackListHTML = "<ul>";
        tracks.items.forEach((trackList) => {
          trackListHTML += `<li class="accordian__content-trackList" id="accordian-trackList">${trackList.track.name}</li>`;
        });
        trackListHTML += "</ul>";
        console.log("accordianContent", accordianContent);
        accordianContent.innerHTML = trackListHTML;
      })

      .then(() => {
        const myOpenPlaylist = document.querySelector(
          ".accordian__content-trackList--active"
        );
        console.log("myOpenPlaylist", myOpenPlaylist);
        myOpenPlaylist.addEventListener("click", () => {
          myOpenPlaylist.classList.add("accordian__content");
        });
      });
  }

  init() {
    this.getPlaylists();
  }

  closePopup(e) {
    if (e) {
      e.preventDefault();
    }
    const currentPopup = document.querySelector(".popup");
    if (currentPopup) {
      currentPopup.remove();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new APIController();
});
