// set the artist name equal to the name at the end of the url, which was received from the previous page
var queryString = document.location.search;
var artistName = queryString.split("=")[1].trim();

// new yok times api url and api key
var newsAPI = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=';
var apiKey = 'api-key=ryZ2eejmGUV3AR1sdXgrtj1B6Hxfjs7q';

// url for fetching news articles about the artist that was searched
var url = newsAPI + artistName + '&' + apiKey;

// fetches apiURL and catches an error if one occurs
fetch(url)
    .then(response => {
        if (!response.ok) {
            throw Error("ERROR");
        }
        return response.json();
    }) 
    .then(data => {
        // nyt returns an array of 10 news articles, and this grabs the first 3
        const slicedNewsData = data.response.docs.slice(0, 3);
        const html = slicedNewsData
        // creating the html from the news articles
        .map(articles => {
            return `
            <div class='articles'>
                <p>Headline: ${articles.headline.main}</p>
                <p>URL - <a href="${articles.web_url}" target="_blank">Click here for article</a></p>
    
            </div>
            `;
        })
            .join('');
        document.querySelector('#news')
        .insertAdjacentHTML('afterbegin', html);
    })
    .catch(error => {
        console.log(error);
    });

// variables needed to get token to use spotify api
const clientId = 'ba4975819dba4a6798c1b583e77851b2';
const clientSecret = '94323600794449529bcd84b8caf8d7e5';


// grabbing DOM elements where we will populate our data
var songListEl = document.querySelector("#songs")
var artistNameEl = document.querySelector("#artist-name")
var artistPictureEl = document.querySelector("#artist-picture")
var artistAlbumsEl = document.querySelector("#albums")

// get token from client id and secret
var getToken = async () => {

    var result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded', 
            'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    var data = await result.json();
    return data.access_token;
}

// grab the spotify artist id from the artist search results
var getArtistId = async (token, artist) => {
        apiURL = `https://api.spotify.com/v1/search?q=` + artist + `&type=artist`;
        var result = await fetch(apiURL, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
        });

        var data = await result.json();
        var artistId = data.artists.items[0].id;
        return artistId;
}

// grab top songs from spotify
var getTopSongs = async (token, artistId) => {
    apiURL = 'https://api.spotify.com/v1/artists/'+artistId+'/top-tracks?country=US';
    var result = await fetch(apiURL, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    var data = await result.json();
    var topTracksInfo = data.tracks;
    var songTitles = [];
    for(var i = 0; i < topTracksInfo.length; i++){
        songTitles.push(topTracksInfo[i].name);
    }
    return songTitles;
}

// get a list of albums from the artist and return the first three that don't match each other
var getLatestAlbums = async (token, artistId) => {
    apiURL = `https://api.spotify.com/v1/artists/` + artistId + `/albums`;
    var result = await fetch(apiURL, {
    method: 'GET',
    headers: { 'Authorization' : 'Bearer ' + token}
    });

    var data = await result.json();
    var albumData = {
        name: [],
        img: []
    };


    var j = 0;
    var currentAlbum = "";

    for(var i = 0; i < 3; i++){
        while (data.items[i+j].name == currentAlbum) {
            j++;
        }
        albumData.name.push(data.items[i+j].name);
        albumData.img.push(data.items[i+j].images[1].url);
        currentAlbum = data.items[i+j].name;
    }
    return albumData;
}


// get the artists main picture
var getArtistPhoto = async (token, artistId) => {
    apiURL = `https://api.spotify.com/v1/artists/` + artistId;
    var result = await fetch(apiURL, {
    method: 'GET',
    headers: { 'Authorization' : 'Bearer ' + token}
    });

    var data = await result.json();
    
    return [data.name ,data.images[0].url];
}

// grab all the data and put it in one object
var getArtistData = async (artist) => {
    var artistInfo = {};
    var myToken = await token;
    var artistId = await getArtistId(myToken, artist);
    var songList = await getTopSongs(myToken, artistId);
    var albums = await getLatestAlbums(myToken, artistId);
    var nameAndPhoto = await getArtistPhoto(myToken, artistId);
    artistInfo.songList = songList;
    artistInfo.albums = albums;
    artistInfo.photo = nameAndPhoto[1];
    artistInfo.name = nameAndPhoto[0];

    // keep artist data in local storage
    localStorage.setItem("artistData", JSON.stringify(artistInfo));
    return artistInfo;
}

// populate webpage with top ten songs
var addSongList = async (artistData) => {
    var artistInformation = await artistData;
    for (let i = 0; i < 10; i++) {
        var songContainerEl = document.createElement('div');
        songContainerEl.classList.add("song-title");
        var songTitleEl = document.createElement("p");
        songTitleEl.textContent = artistInformation.songList[i];
        songContainerEl.append(songTitleEl);
        songListEl.append(songContainerEl);
    }
}


//populate webpage with artist name and photo
var loadArtistInfo = async(artistData) => {
    var artistInformation = await artistData;
    var artistHeaderEl = document.createElement('h1');
    artistHeaderEl.textContent = artistInformation.name;
    artistHeaderEl.classList.add("artist-name");
    var artistImgEl = document.createElement('img');
    artistImgEl.classList.add("band-photo");
    artistImgEl.setAttribute("src", artistInformation.photo);
    artistNameEl.append(artistHeaderEl);
    artistPictureEl.append(artistImgEl);
}

// populate webpage with album names and  photos
var loadAlbumInfo = async(artistData) => {
    var artistInformation = await artistData;
    for (let i = 0; i < 3; i++) {
        var albumTitleEl = document.createElement('div');
        albumTitleEl.textContent = artistInformation.albums.name[i];
        albumTitleEl.classList.add("album-title");
        var albumPhotoEl = document.createElement('img');
        albumPhotoEl.classList.add("album-photo");

        albumPhotoEl.setAttribute("src", artistInformation.albums.img[i]);
        artistAlbumsEl.append(albumTitleEl, albumPhotoEl);
    }
}

// get spotify api token
token = getToken();

// gather artist data
var artistData = getArtistData(artistName);

// add all elements to the page
addSongList(artistData);
loadArtistInfo(artistData);
loadAlbumInfo(artistData);
