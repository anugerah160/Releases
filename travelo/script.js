// JavaScript for scroll-triggered animations
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(".animate-on-scroll")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible")
        } else {
          // Optional: remove 'is-visible' if you want elements to re-animate on scroll back up
          // entry.target.classList.remove('is-visible');
        }
      })
    },
    {
      threshold: 0.2, // Trigger when 20% of the element is visible
      rootMargin: "0px 0px -50px 0px", // Adjusts the viewport margin for triggering
    }
  )

  animateElements.forEach((element) => {
    observer.observe(element)
  })

  // Modal functionality
  const destinationModal = document.getElementById("destinationModal")
  const modalTitle = document.getElementById("modalTitle")
  const modalImage = document.getElementById("modalImage")
  const modalDescription = document.getElementById("modalDescription")
  const modalCloseBtn = document.querySelector(".modal-close-btn")
  const viewDetailsButtons = document.querySelectorAll(".view-details-btn")

  const destinations = {
    kyoto: {
      title: "Ancient Kyoto: Temples & Traditions",
      image: "images/kyoto.png",
      description:
        "Immerse yourself in the historical heart of Japan. Explore iconic temples like Kinkaku-ji and Fushimi Inari-taisha, stroll through serene bamboo groves in Arashiyama, and experience traditional tea ceremonies. Discover the elegance of geisha districts and the tranquility of ancient gardens. This journey offers a deep dive into Japan's rich cultural heritage.",
    },
    tokyo: {
      title: "Vibrant Tokyo: Modern Metropolis",
      image: "images/ori/tokyo.png",
      description:
        "Dive into the electrifying energy of Tokyo, a city where futuristic skyscrapers meet historic shrines. Explore the bustling Shibuya crossing, shop in trendy Harajuku, visit the serene Meiji Jingu Shrine, and enjoy panoramic city views from the Tokyo Skytree. Experience world-class dining, vibrant nightlife, and cutting-edge technology.",
    },
    fuji: {
      title: "Majestic Fuji: Nature's Masterpiece",
      image: "images/ori/fuji.png",
      description:
        "Witness the breathtaking grandeur of Mount Fuji, Japan's highest peak and an iconic symbol. Explore the picturesque Fuji Five Lakes region, take stunning photographs, and enjoy serene boat rides. Visit traditional villages and hot springs, offering a perfect blend of natural beauty and relaxation with stunning mountain backdrops.",
    },
    hokkaido: {
      title: "Snowy Hokkaido: Winter Wonderland",
      image: "images/ori/hokkaido.png",
      description:
        "Embark on an adventure to Hokkaido, Japan's northernmost island, famous for its pristine natural landscapes and winter sports. Enjoy skiing and snowboarding in world-renowned resorts, explore the vibrant Sapporo Snow Festival, and relax in natural hot springs. Discover vast national parks, delicious seafood, and unique indigenous culture.",
    },
  }

  viewDetailsButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const destinationKey = event.target.closest(".card").dataset.destination
      const data = destinations[destinationKey]

      if (data) {
        modalTitle.textContent = data.title
        modalImage.src = data.image
        modalImage.alt = data.title
        modalDescription.textContent = data.description
        destinationModal.classList.remove("hidden") // Show modal
        setTimeout(() => {
          destinationModal.classList.add("is-visible") // Trigger transition
        }, 10) // Small delay to ensure 'display' is set before transition
      }
    })
  })

  modalCloseBtn.addEventListener("click", () => {
    destinationModal.classList.remove("is-visible") // Trigger transition
    setTimeout(() => {
      destinationModal.classList.add("hidden") // Hide modal after transition
    }, 300) // Match CSS transition duration
  })

  // Close modal when clicking outside content
  destinationModal.addEventListener("click", (event) => {
    if (event.target === destinationModal) {
      modalCloseBtn.click()
    }
  })

  // LLM call for Journey Planner
  const generateItineraryBtn = document.getElementById("generateItineraryBtn")
  const plannerPrompt = document.getElementById("plannerPrompt")
  const itineraryOutput = document.getElementById("itineraryOutput")
  const plannerLoading = document.getElementById("plannerLoading")
  const resetPlannerBtn = document.getElementById("resetPlannerBtn")

  if (generateItineraryBtn) {
    generateItineraryBtn.addEventListener("click", async () => {
      const userPrompt = plannerPrompt.value

      if (!userPrompt.trim()) {
        itineraryOutput.innerHTML =
          '<p class="error-message">Please describe your preferences for the journey.</p>'
        return
      }

      // Show loading state
      generateItineraryBtn.disabled = true
      generateItineraryBtn.textContent = "Crafting..."
      plannerLoading.style.display = "flex" // Show loading spinner
      resetPlannerBtn.style.display = "none" // Hide reset button during generation
      itineraryOutput.innerHTML = "" // Clear previous output

      try {
        let chatHistory = []
        chatHistory.push({
          role: "user",
          parts: [
            {
              text: `Generate a short (2-3 day) travel itinerary for Japan based on these preferences: "${userPrompt}". Focus on locations or activities that might appeal to a traveler, and suggest a theme or character type if possible. Keep it concise and engaging.`,
            },
          ],
        })
        const payload = { contents: chatHistory }
        const apiUrl =
          "https://generateitinerary-421122701269.europe-west1.run.app/generateItinerary"
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        const result = await response.json()

        if (
          result.candidates &&
          result.candidates.length > 0 &&
          result.candidates[0].content &&
          result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0
        ) {
          const text = result.candidates[0].content.parts[0].text
          const htmlFormatted = marked.parse(text)
          itineraryOutput.innerHTML = `
                            <div class="bg-white p-6 rounded-lg shadow-md mt-4 prose prose-indigo max-w-none">
                                ${htmlFormatted}
                            </div>`
        } else {
          itineraryOutput.innerHTML =
            '<p class="error-message">Could not generate itinerary. Please try again.</p>'
        }
      } catch (error) {
        console.error("Error generating itinerary:", error)
        itineraryOutput.innerHTML =
          '<p class="error-message">An error occurred while generating the itinerary. Please try again later.</p>'
      } finally {
        // Hide loading state and show reset button
        generateItineraryBtn.disabled = false
        generateItineraryBtn.textContent = "Generate My Journey"
        plannerLoading.style.display = "none"
        resetPlannerBtn.style.display = "inline-block" // Show reset button
      }
    })
  }

  // Reset Planner functionality
  if (resetPlannerBtn) {
    resetPlannerBtn.addEventListener("click", () => {
      plannerPrompt.value = "" // Clear input
      itineraryOutput.innerHTML = "" // Clear output
      resetPlannerBtn.style.display = "none" // Hide reset button
    })
  }
})
