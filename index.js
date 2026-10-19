// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

const stateInput = document.querySelector("#state-input")
const fetchButton = document.querySelector("#fetch-alerts")
const alertsDisplay = document.querySelector("#alerts-display")
const errorMessage = document.querySelector("#error-message")
const loadingSpinner = document.querySelector("#loading-spinner")

fetchButton.addEventListener("click", () => {
    const stateAbbr = stateInput.value.trim().toUpperCase()
    stateInput.value = ""
    alertsDisplay.replaceChildren()
    errorMessage.textContent = ""
    errorMessage.classList.add("hidden")
    errorMessage.classList.remove("error")

    if (!/^[A-Z]{2}$/.test(stateAbbr)) {
        errorMessage.textContent = "Please enter a valid two-letter state abbreviation."
        errorMessage.classList.remove("hidden")
        errorMessage.classList.add("error")
        return
    }

    loadingSpinner.classList.remove("hidden")
    fetch(weatherApi + stateAbbr)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Weather alerts request failed (${response.status})`)
            }
            return response.json()
        })
        .then(data => {
            errorMessage.textContent = ""
            errorMessage.classList.add("hidden")

            const features = Array.isArray(data.features) ? data.features : []
            const summary = document.createElement("p")
            summary.textContent = `${data.title}: ${features.length}`
            alertsDisplay.append(summary)

            const headlines = document.createElement("ul")
            features.forEach(feature => {
                const headline = document.createElement("li")
                headline.textContent = feature.properties?.headline || "Alert headline unavailable"
                headlines.append(headline)
            })
            alertsDisplay.append(headlines)
        })
        .catch(error => {
            errorMessage.textContent = error.message
            errorMessage.classList.remove("hidden")
            errorMessage.classList.add("error")
        })
        .finally(() => {
            loadingSpinner.classList.add("hidden")
        })
})
