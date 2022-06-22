
var newsAPI = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=';
//var inputTextValue = document.getElementById('searchTxt').value;
var apiKey = 'api-key=ryZ2eejmGUV3AR1sdXgrtj1B6Hxfjs7q';

var url = newsAPI + 'joe' + '&' + apiKey;

// fetches apiURL and catches an error if one occurs
fetch(url)
    .then(response => {
        if (!response.ok) {
            throw Error("ERROR");
        }
        return response.json();
    })
    .then(data => {
        console.log(data.response.docs);
        const html = data.response.docs
        .map(articles => {
            return `
            <div class='articles'>
                <p>Article: ${articles.abstract}</p>
                <p>Headline: ${articles.headline.main}</p>
                <p>URL - ${articles.web_url}</p>
    
            </div>
            `;
        })
            .join('');
        console.log(html);
        document.querySelector('#news')
        .insertAdjacentHTML('afterbegin', html);
    })
    .catch(error => {
        console.log(error);
    });

// beccas stuff below
var artistInfo = {};

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

var getArtistId = async (artist) => {
        artist = artist.replace(" ","+");
        apiURL = `https://api.spotify.com/v1/search?q=` + artist + `&type=artist`;
        var result = await fetch(apiURL, {
        method: 'GET'
        });

        var data = await result.json();
        var artistId = data.artists.items[0].id;
        return artistId;
}

var getTopSongs = async (artistId) => {

    var result = await fetch('https://api.spotify.com/v1/artists/'+artistId+'/top-tracks?country=US', {
        method: 'GET'
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

var getLatestAlbums = async (artistId) => {
    console.log(artistId);
    apiURL = `	https://api.spotify.com/v1/artists/` + artistId + `/albums`;
    var result = await fetch(apiURL, {
    method: 'GET'
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

var getArtistData = async (artist) => {
    artistInfo = {};
    var artistId = await getArtistId(artist);
    var songList = await getTopSongs(artistId);
    var albums = await getLatestAlbums(artistId);
    artistInfo.songList = songList;
    artistInfo.albums = albums;
    console.log(artistInfo);
}

getArtistData('lord huron')


// when the search bar is clicked you'll be redirected to main page
document.getElementById("searchBtn").onclick = function () {
    window.location.href = "./index.html"
}
