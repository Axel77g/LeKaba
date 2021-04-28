/**
 * Coponenent corespondant a un element du fichier csv (infrastructure)
 */
const infrastructure = Vue.component('Infrastructure', {
    props:["infrastructure"],
    data: function () {
      return {
        image_select: 0
      }
    },
    methods:{
        /**
         * Permet de passer à l'image suivante 
         */
        next(){
            if(this.image_select > this.$props.infrastructure.images.length-2){
                this.image_select=0
            }else{
                this.image_select ++
            }
        },
        /**
         * Permet de passer à l'image précedente 
         */
        back(){
            if(this.image_select){
                this.image_select --
            }else{
                this.image_select=this.$props.infrastructure.images.length-1
                
            }
        }
    },
    template:`
    <div>
        <div class="image_container">
            <div class="slider">
                <div class="controls">
                    <img @click="back" src="./svg/back.svg" alt="back">
                    <img @click="next" src="./svg/next.svg" alt="next">
                </div>
                <img  v-bind:src="infrastructure.images[image_select]" alt="imgage_adresse">
            </div>
        </div>
        <div class="desc">
            <div class="line">
                <span class="name">{{infrastructure.name}}</span>
                <div class="rate">
                    <div class="stars" v-for="number in 5">
                        <i v-if="number <= infrastructure.avg_rating"> 
                            <img src="./svg/star_fill.svg">
                        </i>
                        <i v-else> 
                            <img src="./svg/star.svg">
                        </i>
                    </div>
                    <span class="nb_rate">{{Math.round(infrastructure.nb_ratings)}}</span>
                </div>
            </div>
            <span class="address">{{infrastructure.address}}</span>
        </div>
    </div>
    `
})
/**/
const App = new Vue({
    el:"#app",
    data:{
        mapbox:{
            map:null,
            markers:[],
            token:"pk.eyJ1IjoiYXhlbDc3ZyIsImEiOiJja255eHVqZDgwMGZsMnBtdjk1OGg4cnV5In0.iRss2ZiwK6fRhuC89YbKQg",
        },
        csv:null,
    },
    mounted(){
        this.loadmap()
        this.loadCSV()
    },
    methods:{
        /**
         * Charge les données sv depuis l'url /data
         */
        async loadCSV(){
            let res = await axios.get(location.origin+"/data")
            this.csv = res.data
            this.csv.forEach(element => {
                console.log(element.latitude,element.longitude);
                this.addMarker(element.longitude,element.latitude)
                
            });
            console.log(this.csv);
        },
        /**
         * Charge la carte MapBox (API MAPBOX)
         * @param {float} lng longitude ou il faut se rendre
         * @param {float} lat  latitude ou il faut se rendre
         * @param {float} zoom Niveau de zoom
         */
        loadmap(lng=3.4297,lat=46.1319,zoom=12){
            mapboxgl.accessToken = this.mapbox.token // ON CHARGE LE TOKEN
            this.mapbox.map = new mapboxgl.Map({ // on créer la map
                container: 'map',
                center: [lng,lat], // on se place
                zoom: zoom,
                style: 'mapbox://styles/axel77g/cknz1zlqx4fv717p8c6jlvs11'
            });   
        },
        /**
         * 
         * @param {float} lng longitude ou il faut se rendre
         * @param {float} lat  latitude ou il faut se rendre
         * @param {float} zoom Niveau de zoom
         */
        addMarker(lng=0,lat=0, color="#96340d"){
            //On ajoute le marker
            let marker = new mapboxgl.Marker({
                color: color,
                draggable: false
            })
            .setLngLat([lng, lat])//on le place
            .addTo(this.mapbox.map); // on l'ajoute a la map
        },
        /**
         * Déplace la vision de la carte a des coordonées précises
         * @param {float} lng longitude ou il faut se rendre
         * @param {float} lat  latitude ou il faut se rendre
         * @param {float} zoom Niveau de zoom
         */
        mapMove(lat=0,lng=0,zoom=15){
            console.log("ici");
            this.mapbox.map.flyTo({center: [lat, lng], zoom: zoom});
        },

    }
})


