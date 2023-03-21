import Map from "ol/Map";
import Tile from "ol/layer/Tile";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { toLonLat, fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import OSM from "ol/source/OSM";
import { Icon, Style } from "ol/style";
import Point from "ol/geom/Point";
import Overlay from "ol/Overlay";

const idAttribute = "id";
const lonAttribute = "lon";
const latAttribute = "lat";
const zoomAttribute = "zoom";
const markerAttribute = "marker";
const logAttribute = "log-position";

class MapComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const addressInput = document.createElement("div");
    addressInput.setAttribute("class", "address-holder");
    addressInput.innerHTML = `
        <input type="text" class="address-input" />
        <button type="button" class="search-button">OK</button>
        `;

    const popupHolder = document.createElement("div");
    popupHolder.setAttribute("class", "popup");

    popupHolder.innerHTML = `
          <slot name="popup-content"></slot>
        `;
    const mapHolder = document.createElement("div");
    mapHolder.setAttribute("class", "map-holder");

    const style = document.createElement("style");
    style.textContent = `
           :root{
            width: 100%;
            height: 100%;
           }

           .map-holder{
            width: 100%;
            height: 100%;
           }

           .address-holder{
            margin: 10px 0;
           }
        `;
    shadow.appendChild(style);
    shadow.appendChild(addressInput);
    shadow.appendChild(popupHolder);
    shadow.appendChild(mapHolder);

    this.lon = 0;
    this.lat = 0;
    this.zoom = 14;
    this.marker = "images/icon.png";
    this.logPosition = false;
  }

  reverseGeocode(coords) {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords[1]}&lon=${coords[0]}&format=json`)
      .then((res) => res.json())
      .then((json) => {
        const event = new CustomEvent("address", {
          detail: {
            address: json,
          },
        });
        this.dispatchEvent(event);
      })
      .catch((e) => console.log(e));
  }

  getGeocode(query) {
    if (query.trim()) {
      fetch(`https://nominatim.openstreetmap.org/search?q=${query.split(" ").join("+")}&format=json`)
        .then((res) => res.json())
        .then((json) => {
          const event = new CustomEvent("coordinates", {
            detail: {
              coordinates: json,
            },
          });
          this.dispatchEvent(event);
        })
        .catch((e) => console.log(e));
    }
  }

  connectedCallback() {
    try {
      const shadow = this.shadowRoot;

      if (this.hasAttribute(idAttribute)) {
        this.id = this.getAttribute(idAttribute);
      } else {
        this.id = "easy-it-map";
      }

      if (this.hasAttribute(lonAttribute)) {
        this.lon = parseFloat(this.getAttribute(lonAttribute));
      }
      if (this.hasAttribute(lonAttribute)) {
        this.lat = parseFloat(this.getAttribute(latAttribute));
      }
      if (this.hasAttribute(zoomAttribute)) {
        this.zoom = parseInt(this.getAttribute(zoomAttribute));
      }
      if (this.hasAttribute(markerAttribute)) {
        this.marker = this.getAttribute(markerAttribute);
      }
      if (this.hasAttribute(logAttribute)) {
        this.logPosition = true;
      }
      const mapHolder = shadow.querySelector(".map-holder");
      const popup = shadow.querySelector(".popup");
      const closer = document.querySelector(`#${this.id} [slot=popup-content] .popup-closer`);

      if (mapHolder && this.lon && this.lat) {
        this.overlay = new Overlay({
          element: popup,
          autoPan: true,
          autoPanAnimation: {
            duration: 250,
          },
        });

        if (closer) {
          closer.addEventListener("click", (e) => {
            this.overlay.setPosition(undefined);
            closer.getBoundingClientRect();
            return false;
          });
        }

        this.view = new View({
          center: fromLonLat([this.lon, this.lat]),
          zoom: this.zoom,
        });

        this.map = new Map({
          target: mapHolder,
          layers: [
            new Tile({
              source: new OSM(),
            }),
          ],
          controls: [],
          view: this.view,
        });

        this.Marker = new Feature({
          type: "icon",
          geometry: new Point(fromLonLat([this.lon, this.lat])),
        });

        const style = new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: this.marker,
          }),
        });

        const vectorLayer = new VectorLayer({
          source: new VectorSource({
            features: [this.Marker],
          }),
          style: (feature) => {
            return style;
          },
        });

        this.map.addOverlay(this.overlay);

        this.map.on("singleclick", (e) => {
          const coordinate = e.coordinate;

          let clickOnFeature = false;
          this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
            if (!clickOnFeature) {
              if (feature) {
                this.overlay.setPosition(coordinate);
                clickOnFeature = true;
              }
            }
          });
          if (!clickOnFeature) {
            this.overlay.setPosition(undefined);
          }

          const coords = toLonLat(coordinate);
          if (this.logPosition) {
            console.log(`coordinate lon/lat ${coords}`);
          }

          this.reverseGeocode(coords);
        });

        this.map.addLayer(vectorLayer);
        this.map.render();

        const input = shadow.querySelector(".address-input");
        const button = shadow.querySelector(".search-button");

        button.addEventListener("click", (e) => {
          const query = input.value;
          if (query) {
            this.getGeocode(query);
          }
        });
      }
    } catch (e) {}
  }

  static get observedAttributes() {
    return [lonAttribute, latAttribute, zoomAttribute, markerAttribute, logAttribute];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === lonAttribute) {
      this.lon = parseFloat(newValue);
    }
    if (name === latAttribute) {
      this.lat = parseFloat(newValue);
    }
    if (name === zoomAttribute) {
      this.zoom = parseInt(newValue);
    }
    if (name === markerAttribute) {
      this.marker = newValue;
    }
    if (name === logAttribute) {
      if (newValue === "true") {
        this.logPosition = true;
      } else {
        this.logPosition = false;
      }
    }

    this.updatePosition();
  }

  updatePosition() {
    if (this.map) {
      this.view.setCenter(fromLonLat([this.lon, this.lat]));
      this.view.setZoom(this.zoom);
      if (this.Marker) {
        this.Marker.getGeometry().setCoordinates(fromLonLat([this.lon, this.lat]));
      }
    }
  }
}

customElements.define("easy-it-map", MapComponent);
