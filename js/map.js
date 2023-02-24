import { data } from "./data.js";

const OutdoorGuide = {
  checkboxStates: {
    terrains: null,
    activities: null,
  },
  shouldShowAll: true,
  filterTitle: document.querySelectorAll(".pa__filter-title"),
  showMoreBtn: document.querySelector(".pa__filter-more"),
  showAllBtn: document.querySelector(".pa__show-all"),

  init() {
    OutdoorGuide.binds();
    OutdoorGuide.loadMap();
  },
  binds() {
    this.filterTitle.forEach((button) => {
      button.addEventListener("click", OutdoorGuide.toggleFilterSection);
    });
    this.showMoreBtn.addEventListener("click", OutdoorGuide.showMoreFilter);

    document
      .querySelectorAll(".pa__inputs input[type='radio']")
      .forEach((input) => {
        input.addEventListener("click", OutdoorGuide.selectFilterOption);
      });
    OutdoorGuide.showAllBtn.addEventListener(
      "click",
      OutdoorGuide.resetFilters
    );
    document
      .querySelector(".pa__filters-toggle")
      .addEventListener("click", OutdoorGuide.mapMobileMenuExpand);
  },

  loadMap() {
    let activityMap = L.map("pa__map").setView([39.236508, 35.062866], 5);

    activityMap.attributionControl.setPrefix(false);
    // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    // L.tileLayer("http://tile.stamen.com/terrain/{z}/{x}/{y}.png",
    // const mapLink = '<a href="http://www.esri.com/">Esri</a>';
    // const wholink =
    //   "i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community";
    // L.tileLayer(
    //   "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    //   {
    //     attribution: "&copy; " + mapLink + ", " + wholink,
    //     // maxZoom: 18,
    //   }
    // ).addTo(activityMap);

    L.tileLayer("http://tile.stamen.com/terrain/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(activityMap);

    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
    }).addTo(activityMap);
    const geojsonLayer = L.geoJSON(null, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: "img/icons/" + feature.properties.terrain + ".svg",
            shadowUrl: "",
            iconSize: [42, 42],
          }),
        }).bindPopup(
          '<div class="pa-popup-title">' +
            feature.properties.name +
            "</div>" +
            feature.properties.description
        );
      },

      filter: (feature) => {
        const isTerrainChecked =
          OutdoorGuide.checkboxStates.terrains === feature.properties.terrain;
        const isActivityChecked =
          OutdoorGuide.checkboxStates.activities ===
          feature.properties.activity;

        return (
          isTerrainChecked || isActivityChecked || OutdoorGuide.shouldShowAll
        );
      },
    });
    for (let input of document.querySelectorAll(".region")) {
      input.onclick = function () {
        let zoneId = this.parentElement.dataset.pazone;
        let allLabels = document.querySelectorAll("label[data-pazone]");

        if (this.parentElement.classList.contains("pa__active")) {
          this.parentElement.classList.remove("pa__active");
          activityMap.fitBounds([data.geoBounds.all]);
        } else {
          allLabels.forEach((el) => el.classList.remove("pa__active"));
          this.parentElement.classList.add("pa__active");
          activityMap.fitBounds(data.geoBounds[zoneId]);
        }
      };
    }
    function updateCheckboxStates(e) {
      switch (e.target.name) {
        case "activity":
          OutdoorGuide.checkboxStates.terrains = null;
          OutdoorGuide.checkboxStates.activities = e.target.value;
          break;
        case "terrain":
          OutdoorGuide.checkboxStates.activities = null;
          OutdoorGuide.checkboxStates.terrains = e.target.value;
          break;
      }
    }
    for (let input of document.querySelectorAll("input[type='radio']")) {
      input.onchange = (e) => {
        clusterGroup.clearLayers();
        geojsonLayer.clearLayers();
        updateCheckboxStates(e);
        geojsonLayer.addData(data.geoData).addTo(clusterGroup);
      };
    }

    geojsonLayer.addData(data.geoData).addTo(clusterGroup);
  },

  toggleFilterSection() {
    this.parentNode.classList.toggle("pa__collapsed");
  },

  showMoreFilter() {
    let allHidden = this.parentElement.querySelectorAll(".pa__hidden");
    allHidden.forEach((filter) => {
      filter.classList.remove("pa__hidden");
      this.classList.add("pa__hidden");
    });
  },

  selectFilterOption() {
    OutdoorGuide.shouldShowAll = false;
    let siblings = this.closest(".pa__inputs").querySelectorAll("input");

    siblings.forEach((sibling) => {
      sibling.checked = false;
      sibling.parentNode.classList.remove("pa__active");
    });
    this.checked = true;
    this.parentNode.classList.add("pa__active");

    if (this.name === "terrain") {
      OutdoorGuide.hideActivityByTerrain(this.value);
    }

    OutdoorGuide.showAllBtn.classList.remove("pa__active");
  },

  hideActivityByTerrain(terrain) {
    let inputs = document.querySelectorAll("input[data-terrain]");
    inputs.forEach((input) => {
      input.checked = false;
      if (input.dataset.terrain !== terrain) {
        input.disabled = true;
        input.parentElement.classList.add("pa__hidden");
      } else if (input.dataset.terrain === terrain) {
        input.disabled = false;

        input.parentElement.classList.remove("pa__hidden");
      }
    });
  },

  resetFilters() {
    OutdoorGuide.checkboxStates = {
      terrains: null,
      activities: null,
    };
    OutdoorGuide.shouldShowAll = true;

    const allInputs = document.querySelectorAll("input[type='radio']");

    allInputs.forEach((input) => {
      input.checked = false;
      input.disabled = false;
      input.parentElement.classList.remove("pa__hidden");
      input.parentElement.classList.remove("pa__active");
    });
    this.checked = true;

    this.classList.add("pa__active");

    this.querySelector("input").dispatchEvent(
      new Event("change", { bubbles: true })
    );
  },

  mapMobileMenuExpand() {
    const filters = document.querySelector(".pa__filters");
    filters.classList.toggle("pa__mobile-hidden");
  },
};
document.addEventListener("DOMContentLoaded", OutdoorGuide.init);
