// Toggle guideline content
function toggleGuideline(header) {
  const content = header.nextElementSibling;
  const icon = header.querySelector("i");

  // Close all other open guidelines in the same category
  const category = header.closest(".category-section");
  const allHeaders = category.querySelectorAll(".guideline-header");
  const allContents = category.querySelectorAll(".guideline-content");

  allHeaders.forEach((h) => {
    if (h !== header) {
      h.classList.remove("active");
      h.querySelector("i").style.transform = "rotate(0deg)";
    }
  });

  allContents.forEach((c) => {
    if (c !== content) {
      c.classList.remove("active");
    }
  });

  // Toggle current guideline
  header.classList.toggle("active");
  content.classList.toggle("active");

  if (header.classList.contains("active")) {
    icon.style.transform = "rotate(180deg)";
  } else {
    icon.style.transform = "rotate(0deg)";
  }
}

// Show more guidelines
function showMoreGuidelines(category) {
  const moreSection = document.getElementById(category + "-more");
  const button = event.target;

  if (moreSection.style.display === "none" || !moreSection.style.display) {
    moreSection.style.display = "block";
    button.innerHTML =
      '<i class="fas fa-minus"></i> Show Less ' +
      (category === "safety" ? "Safety Guidelines" : "Health Policies");
  } else {
    moreSection.style.display = "none";
    button.innerHTML =
      '<i class="fas fa-plus"></i> View More ' +
      (category === "safety" ? "Safety Guidelines" : "Health Policies");
  }
}
async function fetchHospitals(location) {
  const apiKey = "de775fdfbff3403c8e75c745e980e9d8";
  const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    location
  )}&apiKey=${apiKey}`;

  // 1. Geocode the city name
  const geoRes = await fetch(geocodeUrl);
  const geoData = await geoRes.json();
  if (!geoData.features || geoData.features.length === 0) return [];

  const { lat, lon } = geoData.features[0].properties;

  // 2. Fetch hospitals near that lat/lon
  const placesUrl = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${lon},${lat},5000&limit=20&apiKey=${apiKey}`;
  const placesRes = await fetch(placesUrl);
  const placesData = await placesRes.json();

  return placesData.features.map((feat) => ({
    name: feat.properties.name,
    address: feat.properties.address_line1 || "",
    lat: feat.properties.lat,
    lon: feat.properties.lon,
  }));
}


// // Example usage:
// fetchHospitals("Gurgaon").then((hospitals) => {
//   console.log("Hospitals:", hospitals);
// });


async function findHospitals() {
  const location = document.getElementById("locationInput").value.trim();
  const resultsContainer = document.getElementById("hospitalsResults");
 if (!location) {
   alert("Please enter a location to search for hospitals.");
   return;
 }

  // Google Places
  const hospitals = await fetchHospitals(location);
 resultsContainer.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Searching for hospitals in ${location}...</p>
        </div>
    `;
  // Or OpenStreetMap
  // const hospitals = await fetchHospitalsOSM(location);

  displayHospitals(hospitals, location);
}
function displayHospitals(hospitals, location) {
  const resultsContainer = document.getElementById("hospitalsResults");

  let hospitalsHTML = `
        <div class="search-results">
            <h3>Hospitals found in <span style="color:#667eea">${location}</span></h3>
            <div class="hospitals-grid">
    `;
if(hospitals.length==0) {
    resultsContainer.innerHTML = `<p>No hospitals found</p>`;
    return;
}
  hospitals.forEach((hospital) => {
    hospitalsHTML += `
      <div class="hospital-card">
        <div class="hospital-icon">
          <i class="fas fa-hospital"></i>
        </div>
        <h4>${hospital.name}</h4>
        <p class="hospital-location">${
          hospital.address || hospital.formatted_address || hospital.vicinity || location
        }</p>
      </div>
    `;
  });

//   hospitalsHTML += `</div></div>`;
  resultsContainer.innerHTML = hospitalsHTML;
}


// Display hospitals in the results container
// function displayHospitals(hospitals, location) {
//   const resultsContainer = document.getElementById("hospitalsResults");

//   let hospitalsHTML = `
//         <div class="search-results">
//             <h3>Hospitals found in ${location}</h3>
//             <div class="hospitals-grid">
//     `;

//   hospitals.forEach((hospital) => {
//     hospitalsHTML += `
//             <div class="hospital-card" data-type="${hospital.type}">
//                 <div class="hospital-icon">
//                     <i class="fas fa-hospital"></i>
//                 </div>
//                 <h4>${hospital.name}</h4>
//                 <p class="hospital-location">${location}</p>
//                 <div class="hospital-specialties">
//                     ${hospital.specialties
//                       .map(
//                         (specialty) =>
//                           `<span class="specialty-tag">${specialty}</span>`
//                       )
//                       .join("")}
//                 </div>
//                 <div class="hospital-contact">
//                     <i class="fas fa-phone"></i>
//                     <span>${hospital.phone}</span>
//                 </div>
//                 <div class="hospital-actions">
//                     <button class="action-btn" onclick="getDirections('${
//                       hospital.name
//                     }', '${location}')">
//                         <i class="fas fa-directions"></i>
//                         Get Directions
//                     </button>
//                 </div>
//             </div>
//         `;
//   });

//   hospitalsHTML += `
//             </div>
//             <div class="search-note">
//                 <p><i class="fas fa-info-circle"></i> 
//                 For actual hospital information and real-time availability, please contact the hospitals directly or use official healthcare directories.</p>
//             </div>
//         </div>
//     `;

//   resultsContainer.innerHTML = hospitalsHTML;
// }

// Get directions to hospital
function getDirections(hospitalName, location) {
  const query = encodeURIComponent(`${hospitalName}, ${location}`);
  const mapsUrl = `https://www.google.com/maps/search/${query}`;
  window.open(mapsUrl, "_blank");
}

// Filter hospitals by type
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      const filterType = this.getAttribute("data-type");
      filterHospitals(filterType);
    });
  });
});

// Filter hospitals based on type
function filterHospitals(type) {
  const hospitalCards = document.querySelectorAll(".hospital-card");

  hospitalCards.forEach((card) => {
    if (type === "all" || card.getAttribute("data-type") === type) {
      card.style.display = "block";
      card.style.animation = "fadeInUp 0.5s ease-out";
    } else {
      card.style.display = "none";
    }
  });
}

// Smooth scrolling for navigation links
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});

// Add loading spinner styles
const loadingStyles = `
    .loading-state {
        text-align: center;
        padding: 3rem;
        color: #6b46c1;
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #e0e7ff;
        border-top: 4px solid #6b46c1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .search-results {
        animation: fadeInUp 0.6s ease-out;
    }
    
    .search-note {
        background: #f0f9ff;
        border: 1px solid #bae6fd;
        border-radius: 10px;
        padding: 1rem;
        margin-top: 2rem;
        color: #0369a1;
    }
    
    .search-note i {
        margin-right: 0.5rem;
        color: #0284c7;
    }
    
    .hospital-actions {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e2e8f0;
    }
    
    .action-btn {
        background: linear-gradient(135deg, #6b46c1, #8b5cf6);
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        justify-content: center;
    }
    
    .action-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(107, 70, 193, 0.3);
    }
`;

// Inject loading styles
const styleSheet = document.createElement("style");
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet);

// Add intersection observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = "running";
    }
  });
}, observerOptions);

// Observe all animated elements
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    ".contact-card, .ngo-card, .hospital-card, .section"
  );
  animatedElements.forEach((el) => {
    observer.observe(el);
  });
});

// Emergency contact quick dial functionality
function quickDial(number) {
  if (confirm(`Do you want to call ${number}?`)) {
    window.location.href = `tel:${number}`;
  }
}

// Add click handlers to contact numbers
document.addEventListener("DOMContentLoaded", () => {
  const contactNumbers = document.querySelectorAll(".contact-number");

  contactNumbers.forEach((numberElement) => {
    numberElement.style.cursor = "pointer";
    numberElement.addEventListener("click", function () {
      const number = this.textContent.trim();
      quickDial(number);
    });
  });
});

// Add accessibility features
document.addEventListener("DOMContentLoaded", () => {
  // Add keyboard navigation for guideline toggles
  const guidelineHeaders = document.querySelectorAll(".guideline-header");

  guidelineHeaders.forEach((header) => {
    header.setAttribute("tabindex", "0");
    header.setAttribute("role", "button");
    header.setAttribute("aria-expanded", "false");

    header.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleGuideline(this);
        this.setAttribute(
          "aria-expanded",
          this.classList.contains("active") ? "true" : "false"
        );
      }
    });
  });

  // Add ARIA labels to contact cards
  const contactCards = document.querySelectorAll(".contact-card");
  contactCards.forEach((card) => {
    const title = card.querySelector("h3").textContent;
    const number = card.querySelector(".contact-number").textContent;
    card.setAttribute("aria-label", `${title}: ${number}`);
  });
});