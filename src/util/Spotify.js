const clientID = '51ded51504314918b7347fd3ad842e21';
const redirectURI = 'http://localhost:3000';
const scope = 'playlist-modify-public';
const apiUrl = 'https://api.spotify.com/v1';
let accessToken = '';
let expiresIn = '';

export const Spotify = {
  getAccessToken() {
    let url = window.location.href;
    if (accessToken) {
      return new Promise(resolve => resolve(accessToken));
    } else if (url.includes("access_token") && url.includes("expires_in")) {
      accessToken = url.match(/access_token=([^&]*)/)[1];
      expiresIn = url.match(/expires_in=([^&]*)/)[1];
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return new Promise(resolve => resolve(accessToken));
    } else {
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=${scope}&redirect_uri=${redirectURI}`;
    }
  },

  search(term) {
    const urlWithSearchTerm = `${apiUrl}/search?type=track&q=${term}`;
    return Spotify.getAccessToken().then(() => {
      return fetch(urlWithSearchTerm, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(
          response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Request failed!");
          },
          networkError => console.log(networkError.message)
        )
        .then(jsonResponse => {
          console.log(jsonResponse.tracks);
          if (jsonResponse.tracks.items) {
            return jsonResponse.tracks.items.map(track => {
              return {
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
              };
            });
          }
        });
    });
  },

  savePlaylist(playlistName, trackUris) {
    if (playlistName.length > 0 && trackUris.length > 0) {
      let userId = "";
      let playlistId = "";

      return Spotify.getAccessToken()
        .then(() => {
          return fetch(`${apiUrl}/me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })
            .then(
              response => {
                console.log(response);
                if (response.ok) {
                  return response.json();
                }
                throw new Error("Failed to obtain token!");
              },
              networkError => console.log(networkError.message)
            )
            .then(jsonResponse => {
              console.log(jsonResponse);
              userId = jsonResponse.id;
              console.log(userId);
            });
        })
        .then(() => {
          return fetch(`${apiUrl}/users/${userId}/playlists`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({ name: playlistName })
          })
            .then(
              response => {
                if (response.ok) {
                  return response.json();
                }
                throw new Error("Failed to create playlist!");
              },
              networkError => console.log(networkError.message)
            )
            .then(jsonResponse => {
              console.log(jsonResponse);
              playlistId = jsonResponse.id;
              console.log(playlistId);
            });
        })
        .then(() => {
          return fetch(
            `${apiUrl}/users/${userId}/playlists/${playlistId}/tracks`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`
              },
              body: JSON.stringify({ uris: trackUris })
            }
          )
            .then(
              response => {
                if (response.ok) {
                  return response.json();
                }
                throw new Error("Failed to create playlist!");
              },
              networkError => console.log(networkError.message)
            )
            .then(jsonResponse => {
              console.log(jsonResponse);
            });
        });
    }
    else {
      return;
    }
  }
};
