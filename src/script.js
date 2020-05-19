//set the map
var mymap = L.map('mapid').setView([48.856613, 2.352222], 13);
var layerGroup = L.layerGroup().addTo(map);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiemFrbG8iLCJhIjoiY2s4YnBxcHE0MGU4ZTNmbWo2ZnlxNGNoayJ9.PfLD5GhOPBE4WjAn8PlZug'
}).addTo(mymap);

//get the datas from API "que faire à Paris"
async function getData(query) {
    if(query == undefined){
        query = " ";
    }
    let url =
        'https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=' + query + '&q=date_start+%3E%3D+%23now()+AND+date_start+%3C+%23now(months%3D1)&rows=50&facet=category&facet=tags&facet=address_zipcode&facet=address_city&facet=pmr&facet=blind&facet=deaf&facet=access_type&facet=price_type';
    let response = await fetch(url);

    let data = await response.json();

    data.records.forEach(function (event) {
        // le titre de l'événement
        let title = event.fields.title;

        var cover_url = event.fields.cover_url;

        var event_date = event.fields.date_start;

        // on vérifie que l'événement a bien le champs 'lat_lon'
        if (event.fields.lat_lon) {

            // si oui, on ajoute le marqueur

            // la latitude
            let latitude = event.fields.lat_lon[0];
            // la longitude
            let longitude = event.fields.lat_lon[1];

            var marker = L.marker([latitude, longitude]);

            var popup = L.popup(maxWidth = 40)
                .setLatLng([latitude, longitude])
                .setContent('<p class="popup-title">' + title + '</p><br/><img class="popup-image" src="'
                    + cover_url + '">');

            var customOptions = { 'maxWidth': '200', 'maxHeight': '200' };
            marker.bindPopup(popup, customOptions).openPopup();

            marker.addTo(mymap);
        }

    });
}

getData()

function onFormSubmit(event) {
    event.preventDefault();
    getData(search.value);

}