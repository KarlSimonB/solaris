document.addEventListener("DOMContentLoaded", async () => {
  const apiUrl = "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com";
  const apiKey = "solaris-2ngXkR6S02ijFrTP";
  const celestialBodiesContainer = document.getElementById("celestial-bodies");
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const closeModal = document.getElementById("close-modal");
  const searchInput = document.getElementById("search");

  let bodies = []; // STORE CELESTIAL BODIES FOR SEARCH

  const orderedBodies = [
    { name: "Solen", class: "sun" },
    { name: "Merkurius", class: "mercury" },
    { name: "Venus", class: "venus" },
    { name: "Jorden", class: "earth" },
    { name: "Mars", class: "mars" },
    { name: "Jupiter", class: "jupiter" },
    { name: "Saturnus", class: "saturn" },
    { name: "Uranus", class: "uranus" },
    { name: "Neptunus", class: "neptune" },
  ];

  const typeTranslations = {
    star: "Stjärna",
    planet: "Planet",
    moon: "Måne",
    asteroid: "Asteroid",
    dwarf_planet: "Dvärgplanet",
    comet: "Komet",
  };

  /**
   * FETCH CELESTIAL BODIES, INIT APP.
   */
  try {
    console.log("Fetching celestial bodies...");

    const response = await fetch(`${apiUrl}/bodies`, {
      method: "GET",
      headers: { "x-zocom": apiKey },
    });

    if (!response.ok) {
      throw new Error(`HTTP Status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    bodies = data.bodies; // Save fetched data globally

    const matchedBodies = orderedBodies.map((ordered) => {
      const body = bodies.find((b) => b.name === ordered.name);
      return body
        ? { ...body, class: ordered.class }
        : { name: ordered.name, class: ordered.class, desc: "No data available." };
    });

    displayBodies(matchedBodies);
  } catch (error) {
    console.error("Failed to fetch celestial bodies:", error.message);
    celestialBodiesContainer.innerHTML = `<p>Error loading celestial bodies. Please try again later.</p>`;
  }

  /**
   * ADD SEARCH FUNCTION.
   */
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredBodies = orderedBodies.filter((ordered) =>
      ordered.name.toLowerCase().includes(searchTerm)
    );
    const filteredData = filteredBodies.map((filtered) => {
      const body = bodies.find((b) => b.name === filtered.name);
      return body
        ? { ...body, class: filtered.class }
        : { name: filtered.name, class: filtered.class, desc: "No data available." };
    });
    displayBodies(filteredData);
  });

  /**
   * DISPLAY CELESTIAL BODIES.
   * @param {Array} bodiesToDisplay - List of celestial bodies to display.
   */
  function displayBodies(bodiesToDisplay) {
    celestialBodiesContainer.innerHTML = ""; // Clear previous results

    if (bodiesToDisplay.length === 0) {
      celestialBodiesContainer.innerHTML = `<p class="no-results">Inga resultat hittades.</p>`;
      return;
    }

    bodiesToDisplay.forEach((body) => {
      const card = document.createElement("div");
      card.classList.add("card", body.class || body.name.toLowerCase().replace(/[^a-z0-9]/g, "-"));

      if (body.class === "sun") {
        card.innerHTML = `<div class="sun-label">Solen</div>`;
      } else {
        card.innerHTML = `<h3>${body.name}</h3>`;
      }

      card.addEventListener("click", () => openModal(body));
      celestialBodiesContainer.appendChild(card);
    });
  }

  /**
   * CELESTIAL BODIES INFO AFTER CLICK.
   * @param {Object} body - The celestial body to display.
   */
  function openModal(body) {
    const isSun = body.name === "Solen";
    modalBody.innerHTML = `
      <h2>${body.name} (${body.latinName || "Ingen latinskt namn tillgängligt"})</h2>
      <p><span>Typ:</span> ${typeTranslations[body.type] || "Okänd"}</p>
      ${
        !isSun
          ? `<p><span>Avstånd från solen:</span> ${
              body.distance ? body.distance.toLocaleString() : "Okänt"
            } km</p>
             <p><span>Omloppsperiod:</span> ${body.orbitalPeriod || "Okänd"}</p>`
          : ""
      }
      <p><span>Rotationsperiod:</span> ${
        body.rotation ? body.rotation.toLocaleString() + " jorddagar" : "Okänd"
      }</p>
      <p><span>Genomsnittlig temperatur:</span> ${
        body.temp?.day || body.temp?.night
          ? `Dag: ${body.temp?.day || "N/A"}°C / Natt: ${body.temp?.night || "N/A"}°C`
          : "Okänd"
      }</p>
      <p><span>Beskrivning:</span> ${
        body.desc || "Ingen beskrivning tillgänglig för denna himlakropp."
      }</p>
      <p><span>Månar:</span> ${
        body.moons && body.moons.length > 0 ? body.moons.join(", ") : "Inga"
      }</p>
    `;
    modal.style.display = "flex";
    modal.style.opacity = "1";
  }

  /**
   * Close modal functionality.
   */
  closeModal.addEventListener("click", () => {
    modal.style.opacity = "0";
    setTimeout(() => (modal.style.display = "none"), 300);
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});






  

  
  
  
  
    