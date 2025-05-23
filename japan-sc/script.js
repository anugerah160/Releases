document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Toggle
  const hamburger = document.querySelector(".hamburger-menu")
  const navLinks = document.querySelector(".nav-links")
  const authButtons = document.querySelector(".auth-buttons") // Get auth buttons

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active")
    authButtons.classList.toggle("active") // Toggle visibility for auth buttons too
  })

  // Smooth Scrolling for Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      // Close mobile menu if open
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active")
        authButtons.classList.remove("active")
      }

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        const offsetTop = targetElement.offsetTop
        window.scrollTo({
          top: offsetTop - 70, // Adjust for fixed navbar height
          behavior: "smooth",
        })
      }
    })
  })

  // Scroll-triggered Animations
  const animateElements = document.querySelectorAll(
    ".animate-left, .animate-right, .animate-fade-in, .animate-bottom"
  )

  const observerOptions = {
    root: null, // viewport
    rootMargin: "0px",
    threshold: 0.1, // 10% of element needs to be visible
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in-view")
        observer.unobserve(entry.target) // Stop observing once animated
      }
    })
  }, observerOptions)

  animateElements.forEach((element) => {
    observer.observe(element)
  })

  // FAQ Accordion
  const accordionHeaders = document.querySelectorAll(".accordion-header")

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const accordionItem = header.parentElement
      const accordionContent = header.nextElementSibling

      // Close other open accordions
      document.querySelectorAll(".accordion-item.active").forEach((item) => {
        if (item !== accordionItem) {
          item.classList.remove("active")
          item.querySelector(".accordion-content").style.maxHeight = 0
        }
      })

      // Toggle current accordion
      accordionItem.classList.toggle("active")
      if (accordionItem.classList.contains("active")) {
        accordionContent.style.maxHeight = accordionContent.scrollHeight + "px"
      } else {
        accordionContent.style.maxHeight = 0
      }
    })
  })

  // Testimonial Carousel (Basic implementation)
  const testimonialCards = document.querySelectorAll(".testimonial-card")
  const carouselDotsContainer = document.querySelector(".carousel-dots")
  let currentIndex = 0

  if (testimonialCards.length > 0) {
    // Create dots
    testimonialCards.forEach((_, index) => {
      const dot = document.createElement("span")
      dot.classList.add("dot")
      if (index === 0) dot.classList.add("active")
      dot.addEventListener("click", () => {
        showTestimonial(index)
      })
      carouselDotsContainer.appendChild(dot)
    })

    const dots = document.querySelectorAll(".dot")

    const showTestimonial = (index) => {
      testimonialCards.forEach((card, i) => {
        card.style.display = "none" // Hide all
        if (i === index) {
          card.style.display = "block" // Show current
        }
      })
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index)
      })
      currentIndex = index
    }

    // Initial display
    showTestimonial(0)

    // Optional: Auto-slide
    let autoSlideInterval
    const startAutoSlide = () => {
      autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonialCards.length
        showTestimonial(currentIndex)
      }, 5000) // Change slide every 5 seconds
    }

    const stopAutoSlide = () => {
      clearInterval(autoSlideInterval)
    }

    // Pause auto-slide on hover
    testimonialCards.forEach((card) => {
      card.addEventListener("mouseenter", stopAutoSlide)
      card.addEventListener("mouseleave", startAutoSlide)
    })

    carouselDotsContainer.addEventListener("mouseenter", stopAutoSlide)
    carouselDotsContainer.addEventListener("mouseleave", startAutoSlide)

    startAutoSlide() // Start auto-sliding
  }
})
