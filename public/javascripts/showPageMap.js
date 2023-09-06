mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/satellite-streets-v12", // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 13, // starting zoom
    projection: "mercator",
});

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({closeOnMove:true}).setHTML(
            `<h3>${campground.title}</h3>
            <p>${campground.location}</p>
            `
        )
        .setMaxWidth("200px")
    )
    .addTo(map);

map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true,
        },
        showAccuracyCircle: true,
        showUserLocation: true,
    })
);
map.addControl(new mapboxgl.FullscreenControl({ container: "map" }));

const scale = new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: "imperial",
});
map.addControl(scale, "bottom-right");

scale.setUnit("metric");

const navControl = new mapboxgl.NavigationControl();
map.addControl(navControl, "bottom-right");
