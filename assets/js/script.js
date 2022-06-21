//api key below
//ryZ2eejmGUV3AR1sdXgrtj1B6Hxfjs7q

let url =
 "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=ryZ2eejmGUV3AR1sdXgrtj1B6Hxfjs7q";

 fetch(url).then(response => response.json()).then(data => {
    console.log(data);
})