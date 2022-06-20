var artistInfo = {};
   
const clientId = 'ba4975819dba4a6798c1b583e77851b2';
const clientSecret = '94323600794449529bcd84b8caf8d7e5';

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
        artist = artist.replace(" ","+");
        apiURL = `https://api.spotify.com/v1/search?q=` + artist + `&type=artist`;
        var result = await fetch(apiURL, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
        });

        var data = await result.json();
        var artistId = data.artists.items[0].id;
        return artistId;
}

var getTopSongs = async (token, artistId) => {

    var result = await fetch('https://api.spotify.com/v1/artists/'+artistId+'/top-tracks?country=US', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    var data = await result.json();
    var topTracksInfo = data.tracks;
    console.log(topTracksInfo);
    var songTitles = [];
    for(var i = 0; i < topTracksInfo.length; i++){
        songTitles.push(topTracksInfo[i].name);
    }
    return songTitles;
}

var getLatestAlbums = async (token, artistId) => {
    apiURL = `	https://api.spotify.com/v1/artists/` + artistId + `/albums`;
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

// var getArtistPhoto = async (token, artistId) => {
//     apiURL = `	https://api.spotify.com/v1/artists/` + artistId + `/albums`;
//     var result = await fetch(apiURL, {
//     method: 'GET',
//     headers: { 'Authorization' : 'Bearer ' + token}
//     });

//     var data = await result.json();
//     var albumData = {
//         name: [],
//         img: []
//     };

//     for(var i = 0; i < 3; i++){
//         albumData.name.push(data.items[i].name);
//         albumData.img.push(data.items[i].images[1].url);
//     }
//     return albumData;
// }

var getArtistData = async (artist) => {
    artistInfo = {};
    var token = await getToken();
    var artistId = await getArtistId(token, artist);
    var songList = await getTopSongs(token, artistId);
    var albums = await getLatestAlbums(token, artistId);
    artistInfo.songList = songList;
    artistInfo.albums = albums;
    console.log(artistInfo);
}

getArtistData('lord huron')