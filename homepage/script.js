// Page load animation
document.addEventListener("DOMContentLoaded", () => {
  // Create floating background elements
  createFloatingElements()

  // Initialize scroll animations
  initScrollAnimations()

  // Add smooth scrolling for "Start Your Journey" button
  initSmoothScrolling()

  // Add mobile menu functionality
  initMobileMenu()

  // Add header scroll effect
  initHeaderScroll()
})

// Create floating background elements
function createFloatingElements() {
  const body = document.body
  const floatingContainer = document.createElement("div")
  floatingContainer.className = "floating-elements"

  for (let i = 0; i < 3; i++) {
    const circle = document.createElement("div")
    circle.className = "floating-circle"
    floatingContainer.appendChild(circle)
  }

  body.appendChild(floatingContainer)
}

// Initialize scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate")
      }
    })
  }, observerOptions)

  // Add scroll animation class to sections
  const sections = document.querySelectorAll(".features, .about, .contact")
  sections.forEach((section) => {
    section.classList.add("scroll-animate")
    observer.observe(section)
  })
}

// Initialize smooth scrolling
function initSmoothScrolling() {
  const startJourneyBtn = document.querySelector(".btn.primary")
  const featuresSection = document.querySelector("#features")

  if (startJourneyBtn && featuresSection) {
    startJourneyBtn.addEventListener("click", function (e) {
      e.preventDefault()

      // Add click animation
      this.style.transform = "scale(0.95)"
      setTimeout(() => {
        this.style.transform = ""
      }, 150)

      // Smooth scroll to features section
      featuresSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

      // Add highlight effect to feature cards
      setTimeout(() => {
        const featureCards = document.querySelectorAll(".feature-card")
        featureCards.forEach((card, index) => {
          setTimeout(() => {
            card.style.transform = "translateY(-10px) scale(1.02)"
            card.style.boxShadow = "0 20px 40px rgba(147, 51, 234, 0.3)"
            setTimeout(() => {
              card.style.transform = ""
              card.style.boxShadow = ""
            }, 500)
          }, index * 100)
        })
      }, 800)
    })
  }
}

// Initialize mobile menu
function initMobileMenu() {
  const menuBtn = document.getElementById("menu-btn")
  const navLinks = document.getElementById("nav-links")

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex"
      navLinks.style.flexDirection = "column"
      navLinks.style.position = "absolute"
      navLinks.style.top = "100%"
      navLinks.style.left = "0"
      navLinks.style.right = "0"
      navLinks.style.background = "rgba(255, 255, 255, 0.95)"
      navLinks.style.backdropFilter = "blur(10px)"
      navLinks.style.padding = "1rem"
      navLinks.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.1)"
    })
  }
}

// Initialize header scroll effect
function initHeaderScroll() {
  const header = document.querySelector(".header")
  let lastScrollY = window.scrollY

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY

    if (currentScrollY > 100) {
      header.style.background = "rgba(255, 255, 255, 0.98)"
      header.style.backdropFilter = "blur(15px)"
    } else {
      header.style.background = "rgba(255, 255, 255, 0.95)"
      header.style.backdropFilter = "blur(10px)"
    }

    lastScrollY = currentScrollY
  })
}

// Add particle effect on feature card hover
document.addEventListener("DOMContentLoaded", () => {
  const featureCards = document.querySelectorAll(".feature-card")

  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      createParticles(this)
    })
  })
})

function createParticles(element) {
  const rect = element.getBoundingClientRect()
  const particles = []

  for (let i = 0; i < 5; i++) {
    const particle = document.createElement("div")
    particle.style.position = "absolute"
    particle.style.width = "4px"
    particle.style.height = "4px"
    particle.style.background = "#9333ea"
    particle.style.borderRadius = "50%"
    particle.style.pointerEvents = "none"
    particle.style.zIndex = "1000"

    const x = rect.left + Math.random() * rect.width
    const y = rect.top + Math.random() * rect.height

    particle.style.left = x + "px"
    particle.style.top = y + "px"

    document.body.appendChild(particle)

    // Animate particle
    const animation = particle.animate(
      [
        { transform: "translateY(0px)", opacity: 1 },
        { transform: "translateY(-50px)", opacity: 0 },
      ],
      {
        duration: 1000,
        easing: "ease-out",
      },
    )

    animation.onfinish = () => {
      particle.remove()
    }
  }
}

// Add typing effect to hero text (optional enhancement)
function typeWriter(element, text, speed = 100) {
  let i = 0
  element.innerHTML = ""

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i)
      i++
      setTimeout(type, speed)
    }
  }

  type()
}

// Enhanced button interactions
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".btn")

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Create ripple effect
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + "px"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"
      ripple.style.position = "absolute"
      ripple.style.borderRadius = "50%"
      ripple.style.background = "rgba(255, 255, 255, 0.3)"
      ripple.style.transform = "scale(0)"
      ripple.style.animation = "ripple 0.6s linear"
      ripple.style.pointerEvents = "none"

      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })
})

// Add CSS for ripple animation
const style = document.createElement("style")
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .btn {
    position: relative;
    overflow: hidden;
  }
`
document.head.appendChild(style)
