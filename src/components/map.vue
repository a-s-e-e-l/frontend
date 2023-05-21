<template>
  <v-app>
    <!-- this layout to make double navigation drawer -->
    <v-layout fill-height>
      <!-- to fill all the height of the app -->
      <v-navigation-drawer class="left-menu" dark width="220" permanent>
        <!-- first nav drawer -->
        <h3>Search For Place You Want To Go</h3>
        <GMapAutocomplete class="inputs in1" placeholder="Search" :options="{
          types: ['establishment'],
          componentRestrictions: {
            country: 'PS',
          },
        }" @place_changed="(event) => onPlaceSelected(event)" /><br />
        <hr>

        <h3 class="specify">calculate Distance Bettwen Two Places</h3>
        <GMapAutocomplete class="inputs" id="location-1" placeholder="first location" :options="{
          types: ['establishment'],
          componentRestrictions: {
            country: 'PS',
          },
        }" @place_changed="(event) => onPlaceSelected1(event.geometry.location)" /><br />
        <GMapAutocomplete class="inputs" id="location-2" placeholder="second location" :options="{
          types: ['establishment'],
          componentRestrictions: {
            country: 'PS',
          },
        }" @place_changed="(event) => onPlaceSelected2(event.geometry.location)" /><br />

        <button class="button" type="button" @click="calcRoute()">
          calculate
        </button>
        <button class="button" type="button">
          Reset
        </button>

        <hr>
        <h3 class="specify">You have to specify two locations on the map to calculate the distance between them</h3>
        <h5 style="color: gray;">Click the button first</h5>
        <button class="button" type="button" @click="calcTwoLoc()">
          calculate
        </button>
        <v-list>
          <!-- <v-list-item-group> -->
          <!-- to list the favourite items from the NodeApi-->
          <!-- بتشوفي شو مناسب نحطه في هاي الليست بنا, مثلا بكفي اسم المكان بدون صورته -->

          <!-- <v-list-item v-for="item in items" :key="item.title" link> -->
          <!-- loop all the items for first nav drawer -->
          <!-- <div class="wrapper">
                <v-icon size="50">{{ item.icon }}</v-icon>
                <v-list-item-title class="title-icon">{{
                  item.title
                }}</v-list-item-title>
              </div>
            </v-list-item>
          </v-list-item-group> -->
        </v-list>
      </v-navigation-drawer>
      <v-navigation-drawer class="right-menu" dark width="230" permanent>
        <!-- second nav drawer -->
        <v-list class="list" flat>
          <!-- to make non active list -->
          <h2 class="address">Favorite List <v-icon class="icon">mdi-heart-outline</v-icon></h2>
          <v-list-item-group>
            <!--  NodeApi هادي بيحط ماركر عالاماكن الي مضافة للمفضلة في اماكنها الحقيقية -->
            <v-list-item v-for="location in locations" :key="location.name" link>
              <!-- loop all the items for second nav drawer -->
              <v-list-item-title @click="
                clickMarker(location.id - 1, {
                  lat: location.lat,
                  lng: location.lng,
                })
              ">
                <!-- list item with click event -->
                {{ location.name }}
                <!-- get location name -->
              </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
          <hr>
          <button class="button" type="button" @click="logout()">
          Logout
        </button>
        </v-list>
      </v-navigation-drawer>
      <!-- this content for app bar and maps because there are 2 nav drawer -->
      <v-content>
        <v-app-bar>
          <v-app-bar-title class="title">
            TOP-RATED TOURIST ATTRACTION IN GAZA
          </v-app-bar-title>
          <v-spacer></v-spacer>
          <v-icon>mdi-cog</v-icon>
          <v-icon>mdi-help-circle</v-icon>
          <v-icon @click="closeMarker(showByIndex)">mdi-close-circle</v-icon>
          <!-- first nav drawer -->
        </v-app-bar>
        <!-- use Gmap component for easy use -->
        <GmapMap :center="center" :zoom="zoom" style="width: 100%; height: 91.5%" ref="map" @click="putMarker($event)">
          <GMapPolyline :path="path" :editable="true" ref="polyline" />
          <!-- Marker component and label -->
          <GmapMarker :key="index" v-for="(m, index) in markers" :position="m.position" :icon="m.icon" :label="m.label"
            @click="clickMarker(index, m.position)" @mouseover="hoverMarker(index)" @mouseout="outMarker(index)">
            <gmap-info-window :opened="showByIndex === index" :closeclick="true" @closeclick="closeMarker(index)">
              <h2>{{ locations[index].name }}</h2>
              <p>{{ locations[index].address }}</p>
            </gmap-info-window>
          </GmapMarker>
          <GmapMarker v-if="markerPosition" :position="markerPosition" :clickable="true" :id="selectedMarkerIndex"
            @mouseover="toggleInfoWindow(markerPosition, $event)">
            <gmap-info-window v-if="markerPosition" :position="markerPosition" :opened="isInfoWindowOpen"
              @closeclick="closeInfoWindow()" :z-index="100">
              <div>
                <!-- <h2>{{ locations[selectedMarkerIndex].name }}</h2>
                <p>{{ locations[selectedMarkerIndex].address }}</p> -->

                <button @click="addToFavourites($event)">
                  Add to favourites
                </button>
              </div>
            </gmap-info-window>
          </GmapMarker>
        </GmapMap>
      </v-content>
      <div id="description">
        <!-- description part that will appear after marker clicked -->
        <img id="desc-img" width="300" />
        <h2 v-if="opened" class="desc-title">
          {{ locations[showByIndex].name }}
        </h2>
        <p v-if="opened" class="desc-subtitle">
          {{ locations[showByIndex].description }}
          <br /><br />
          <v-icon color="#72cdd2">mdi-map-marker</v-icon>{{ locations[showByIndex].address }} <br /><br />
          <v-icon color="#98ca32">mdi-web</v-icon>{{ locations[showByIndex].website }}
        </p>
      </div>
    </v-layout>
  </v-app>
</template>

<script>
// import axios from "axios";
// Send a POST request
// axios({
//   method: "post",
//   url: "/user/12345",
//   data: {
//     firstName: "Fred",
//     lastName: "Flintstone",
//   },
// });
import axios from 'axios';
export default {
  name: "MapPage",

  data() {
    return {
      center: { lat: 31.5017, lng: 34.4668 },
      zoom: 13,
      locations: [],
      markers: [],
      markers2: [],
      items: [
        { title: "Browse", icon: "mdi-earth" },
        { title: "Suggest Attraction", icon: "mdi-comment-edit-outline" },
        { title: "Videos", icon: "mdi-youtube-tv" },
        { title: "Blog", icon: "mdi-forum-outline" },
        { title: "About", icon: "mdi-information" },
      ],
      opened: false,
      showByIndex: null,
      markerPosition: null,
      PlaceSelected1: null,
      PlaceSelected2: null,
      // selectedPlace: {},
      isInfoWindowOpen: false,
      selectedMarkerIndex: null,
      searchPosition: null,
      path: [
        // { lat: 31.5017, lng: 34.4669 },
        // { lat: 31.2874, lng: 34.2598 },
      ],
      locationSelected1: null,
      locationSelected2: null,
      placeId: null,
    };
  },

  async created() {
    //i use async to wait for fetch to be commited first, and then the other command

    // await fetch("/locations.json") //fetching data from local json file, i use fetch because easy and don't need to install (ex: Axios)
    //   .then((response) => response.json())
    //   .then((data) => (this.locations = data))
    //   .catch((err) => console.log(err));

    // this.createMarker();

    const token = localStorage.getItem('token');
    console.log(token)
    const axiosInstance = axios.create({
      baseURL: 'http://localhost:5000/api/',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    try {
      const response = await axiosInstance.get('all/places'); 
      const response2 = await axiosInstance.get('all/coordinates');
      this.locations = response.data;
      this.locations = this.locations.concat(response2.data);
      console.log(response)
      this.createMarker();
    } catch (error) {
      console.log('Request failed with error:', error);
    }
    // to remove poi and transit train, i use refs promise to make changes to the vue2-google-map maps.
    // vue2-google-map doesn't have parameter to change the feature type.
    // this.$refs.map.$mapPromise.then((map) => {
    //   map.setOptions({
    //     styles: [
    //       // {
    //       //   featureType: "poi",
    //       //   stylers: [{ visibility: "off" }],
    //       // },
    //       {
    //         featureType: "roadmap",
    //         elementType: "labels.icon",
    //       },
    //     ],
    //   });
    // });
  },
  methods: {
    // createMarker() {
    //   //function to make marker at the first time the page is created
    //   for (var i = 0; i < this.locations.length; i++) {
    //     this.markers.push({
    //       position: { lat: this.locations[i].lat, lng: this.locations[i].lng },
    //       label: {
    //         text: this.locations[i].name,
    //         fontWeight: "bold",
    //       },
    //       icon: {
    //         url: "favorite_location_favorite_place_location_map_icon_148668.png",
    //         scaledSize: { width: 50, height: 50 },
    //         labelOrigin: {
    //           x: this.locations[i].labelx,
    //           y: this.locations[i].labely,
    //         },
    //       },
    //     });
    //   }
    // },
    createMarker() {
      //function to make marker at the first time the page is created
      for (var i = 0; i < this.locations.length; i++) {
        this.markers.push({
          position: { lat: this.locations[i].lat, lng: this.locations[i].lng },
          label: {
            text: this.locations[i].name,
            fontWeight: "bold",
          },
          icon: {
            url: "favorite_location_favorite_place_location_map_icon_148668.png",
            scaledSize: { width: 30, height: 30 },
            // labelOrigin: {
            //   x: 80,
            //   y: 20,
            // },
          },
        });
      }
    },
    clickMarker(index, position) {
      //function to change several data for zooming, icon scale, infowindow, and description when click marker
      if (this.opened == false) {
        this.center = position;
        this.zoom = 17;
        this.showByIndex = index;
        this.opened = true;
        this.markers[index].icon = {
          url: "favorite_location_favorite_place_location_map_icon_148668.png",
          scaledSize: { width: 100, height: 100 },
          // labelOrigin: {
          //   x: 80 + 40,
          //   y: 20 + 20,
          // },
        };
        this.renderImage();
        document.getElementById("description").style.display = "block";
      }
    },

    hoverMarker(index) {
      //function to change several data for icon scale and infowindow when mouse hover to the marker
      if (this.opened == false) {
        this.showByIndex = index;
        this.markers[index].icon = {
          url: "favorite_location_favorite_place_location_map_icon_148668.png",
          scaledSize: { width: 100, height: 100 },
          labelOrigin: {
            x: this.locations[index].labelx + 40,
            y: this.locations[index].labely + 20,
          },
        };
      }
    },

    outMarker(index) {
      //function to change several data for icon scale and infowindow when mouse leaving to the marker
      if (this.opened == false) {
        this.showByIndex = null;
        this.markers[index].icon = {
          url: "favorite_location_favorite_place_location_map_icon_148668.png",
          scaledSize: { width: 50, height: 50 },
          labelOrigin: {
            x: this.locations[index].labelx,
            y: this.locations[index].labely,
          },
        };
      }
    },

    closeMarker(index) {
      //function to change several data for zooming, icon scale, infowindow, and description when close marker
      this.opened = false;
      this.showByIndex = null;
      this.zoom = 15;
      this.markers[index].icon = {
        url: "favorite_location_favorite_place_location_map_icon_148668.png",
        scaledSize: { width: 50, height: 50 },
        labelOrigin: {
          x: this.locations[index].labelx,
          y: this.locations[index].labely,
        },
      };
      document.getElementById("description").style.display = "none";
    },
    onPlaceSelected(place) {
      // console.log(place);
      this.markerPosition = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      if (place.placeId !== null) {
        this.placeId = place.place_id;
        console.log(place.place_id);
      }
      this.center = this.markerPosition;
      this.zoom = 17;
    },
    onPlaceSelected1(place) {
      this.PlaceSelected1 = { lat: place.lat(), lng: place.lng() };
    },
    onPlaceSelected2(place) {
      this.PlaceSelected2 = { lat: place.lat(), lng: place.lng() };
    },
    toggleInfoWindow(position, event) {
      if (this.placeId !== null) {
        console.log(event);
      } else {
        console.log(this.placeId);
      }
      this.isInfoWindowOpen = !this.isInfoWindowOpen;
      this.searchPosition = position;
    },
    closeInfoWindow() {
      this.isInfoWindowOpen = false;
      this.searchPosition = null;
      this.placeId = null;
    },
    renderImage() {
      var url = this.showByIndex + 1 + ".jpg";
      var img = document.getElementById("desc-img");
      img.src = url;
    },
    addToFavourites() {
      //this button is to add a location to favourites NodeApi
      const token = localStorage.getItem('token');
      const axiosInstance = axios.create({
        baseURL: 'http://localhost:5000/api/',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (this.placeId !== null) {
        //add the place id to favourites
        console.log(this.placeId);
        const place = {
          place_id: this.placeId
        };
        axiosInstance.post('add/place', place)
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.log('Request failed with error:', error);
          })
      } else {
        //add the lating values of the location to the favourites
        console.log(this.searchPosition.lat + "  " + this.searchPosition.lng);
        const coordinates = {
          lat: this.searchPosition.lat,
          lng: this.searchPosition.lng
        };
        axiosInstance.post('add/coordinate', coordinates)
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.log('Request failed with error:', error);
          })
      }
    },
    putMarker(event) {
      // console.log(event);
      this.markerPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      if (event.placeId) {
        this.placeId = event.placeId;
        console.log(event.placeId);
      } else {
        this.placeId = null;
        console.log(event.latLng);
      }
      // console.log(event.latLng.lat());
      // console.log(event.latLng.lng());
    },
    calcRoute() {
      // console.log(this.PlaceSelected1.lat);
      this.path = [
        { lat: this.PlaceSelected1.lat, lng: this.PlaceSelected1.lng },
        { lat: this.PlaceSelected2.lat, lng: this.PlaceSelected2.lng },
      ];
      // Create request
      const request = {
        origin: document.getElementById("location-1").value,
        destination: document.getElementById("location-2").value,
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
      };

      // Create DirectionsService object
      const directionsService = new window.google.maps.DirectionsService();

      // // Create DirectionsRenderer object
      const directionsDisplay = new window.google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: "#FF0000",
          strokeWeight: 4,
        },
      });

      // Set DirectionsRenderer map
      // directionsDisplay.setMap(this.$refs.map.$map);

      // Call DirectionsService route() method
      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          // Display distance
          console.log(result.routes[0].legs[0].distance.text);

          // Display duration
          console.log(result.routes[0].legs[0].duration.text);

          // Set DirectionsRenderer directions
          directionsDisplay.setDirections(result);
          alert(
            "The distance is : " +
            result.routes[0].legs[0].distance.text +
            " Km. The driving road takes: " +
            result.routes[0].legs[0].duration.text
          );
        } else {
          const earthRadius = 6371;
          const latRad1 = this.PlaceSelected1.lat * (Math.PI / 180);
          const lonRad1 = this.PlaceSelected1.lng * (Math.PI / 180);
          const latRad2 = this.PlaceSelected2.lat * (Math.PI / 180);
          const lonRad2 = this.PlaceSelected2.lng * (Math.PI / 180);
          // Calculate the differences
          const latDiff = latRad2 - latRad1;
          const lonDiff = lonRad2 - lonRad1;

          // Calculate the distance using the Haversine formula
          const a =
            Math.sin(latDiff / 2) ** 2 +
            Math.cos(latRad1) * Math.cos(latRad2) * Math.sin(lonDiff / 2) ** 2;
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = earthRadius * c;
          const directionsDisplay = new window.google.maps.DirectionsRenderer({
            polylineOptions: {
              strokeColor: "#FF0000",
              strokeWeight: 4,
            },
          });
          this.path = [
            { lat: this.PlaceSelected1.lat, lng: this.PlaceSelected1.lng },
            { lat: this.PlaceSelected2.lat, lng: this.PlaceSelected2.lng },
          ];
          // Show error message
          alert("The distance is : " + distance + " Km");
          // Clear route
          directionsDisplay.setDirections({ routes: [] });
        }
      });
    },
    degToRad(degrees) {
      return degrees * (Math.PI / 180);
    },
    selectFirst(event) {
      this.locationSelected1 = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
    },
    selectSecond(event) {
      this.locationSelected2 = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
    },
    logout() {
      const token = localStorage.getItem('token');
      const axiosInstance = axios.create({
        baseURL: 'http://localhost:5000/api/',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      axiosInstance.post('logout')
        .then(response => {
          console.log(response.data);
          window.location.href = 'http://localhost:8080/login'
        })
        .catch(error => {
          console.log('Request failed with error:', error);
        })
    },

    calcTwoLoc() {
      (this.markerPosition = null), alert("click on the first location.");
      if (this.markers2.length === 0) {
        this.markers2.push({
          first: this.markerPosition,
        });
        console.log("ddd");
        this.markerPosition = null;
        alert("click on the seconed location.");
        if (this.markerPosition != null) {
          this.markers2.push({
            seconed: this.markerPosition,
          });

          const earthRadius = 6371;
          const latRad1 = this.markers2.first.lat * (Math.PI / 180);
          const lonRad1 = this.markers2.first.lng * (Math.PI / 180);
          const latRad2 = this.markers2.seconed.lat * (Math.PI / 180);
          const lonRad2 = this.markers2.seconed.lng * (Math.PI / 180);
          // Calculate the differences
          const latDiff = latRad2 - latRad1;
          const lonDiff = lonRad2 - lonRad1;
          const a =
            Math.sin(latDiff / 2) ** 2 +
            Math.cos(latRad1) * Math.cos(latRad2) * Math.sin(lonDiff / 2) ** 2;
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = earthRadius * c;
          this.path = [
            {
              lat: this.markers2.first.lat,
              lng: this.markers2.first.lng,
            },
            {
              lat: this.markers2.seconed.lat,
              lng: this.markers2.seconed.lng,
            },
          ];
          alert("The distance is : " + distance + " Km");
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  padding: 20px;

  .title-icon {
    white-space: normal;
    text-align: center;
  }
}

.title {
  width: 500px;
}

#description {
  max-width: 300px;
  display: none;
  background-color: #313541;
}

.desc-title {
  padding: 1rem;
  margin-top: -3%;
  background-color: #72cdd2;
  color: white;
}

.desc-subtitle {
  padding: 1rem;
  font-size: 12px;
  color: white;
}

.left-menu {
  text-align: center;
}

.right-menu,
.left-menu {
  background-color: rgb(50, 50, 78);

}

.inputs {
  background-color: white;
  margin-top: 10px;
  padding: 10px;
  border-radius: 10px;
}

label {
  padding-right: 90px;
  padding-left: 10px;
  position: relative;
  top: 18px;
  background-color: white;
  border-radius: 10px;
  padding-bottom: 10px;
  padding-top: 10px;
  // text-align: left !important;
}

.button {
  background-color: #4CAF50;
  color: white;
  border-radius: 10px;
  padding: 10px;
  margin-top: 20px;
  margin-bottom: 10px;
  margin-right: 10px;
}

.in1 {
  margin-bottom: 10px;
}

h3 {
  margin-top: 30%;
  color: white;
}

.specify {
  margin-top: 20%;
}

.list {
  text-align: center;
  margin-top: -8px;
}

.address {
  margin-top: 30%;
}

.icon,
.address {
  color: bisque;
}

.h3search {
  margin: 0px;
  margin-top: 20px;
}
</style>
