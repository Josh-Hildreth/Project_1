var songListEl = document.querySelector("#songs")

var artistInfo = {};
var queryString = document.location.search;
var artistName = queryString.split("=")[1].trim();

// private methods
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

var getOfficialName = async (token, artistId) => {
    apiURL = `https://api.spotify.com/v1/artists/` + artistId;
    var result = await fetch(apiURL, {
    method: 'GET',
    headers: { 'Authorization' : 'Bearer ' + token}
    });

    var data = await result.json();

    return data.name;
}

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

    for(var i = 0; i < 3; i++){
        albumData.name.push(data.items[i].name);
        albumData.img.push(data.items[i].images[1].url);
    }
    return albumData;
}

var getArtistPhoto = async (token, artistId) => {
    apiURL = `https://api.spotify.com/v1/artists/` + artistId;
    var result = await fetch(apiURL, {
    method: 'GET',
    headers: { 'Authorization' : 'Bearer ' + token}
    });

    var data = await result.json();
    
    return data.images[0].url;
}

var getArtistData = async (artist) => {
    artistInfo = {};
    var myToken = await token;
    var artistId = await getArtistId(myToken, artist);
    var name = await getOfficialName(token, artistId);
    var songList = await getTopSongs(myToken, artistId);
    var albums = await getLatestAlbums(myToken, artistId);
    var photograph = await getArtistPhoto(myToken, artistId);
    artistInfo.songList = songList;
    artistInfo.albums = albums;
    artistInfo.photo = photograph;
    artistInfo.name = 
    console.log(artistInfo);
}

var formSubmitHandler = function(event) {
    event.preventDefault();
    
    var artistName = nameInputEl.value.trim();

    if (artistName) {
        getArtistData(artistName);
        nameInputEl.value = "";
    }
  };

token = getToken();
getArtistData(artistName);
