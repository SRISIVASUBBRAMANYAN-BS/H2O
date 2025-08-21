// Data Storage
const users = {
  admin: { username: "adminwsin2025", password: "2025admin", name: "Administrator", type: "admin" },
  publichealth: { username: "phwsin2025", password: "2025ph", name: "Public Health Officer", type: "publichealth" },
}

const dataEntryUsers = JSON.parse(localStorage.getItem("dataEntryUsers")) || {}
const hospitalUsers = JSON.parse(localStorage.getItem("hospitalUsers")) || {}
const locations = JSON.parse(localStorage.getItem("locations")) || []
const waterQualityData = JSON.parse(localStorage.getItem("waterQualityData")) || []
const patientsData = JSON.parse(localStorage.getItem("patientsData")) || []

// Current user session
let currentUser = null

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already logged in
  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    showDashboard(currentUser.type)
  }

  // Setup event listeners
  setupEventListeners()

  // Load initial data
  loadInitialData()
})

function setupEventListeners() {
  // Login form
  document.getElementById("loginForm").addEventListener("submit", handleLogin)

  // Admin forms
  document.getElementById("createDataEntryForm").addEventListener("submit", createDataEntryUser)
  document.getElementById("createHospitalForm").addEventListener("submit", createHospitalUser)

  // Data entry forms
  document.getElementById("addLocationForm").addEventListener("submit", addLocation)
  document.getElementById("waterQualityForm").addEventListener("submit", saveWaterQualityData)

  // Hospital form
  document.getElementById("patientForm").addEventListener("submit", registerPatient)

  // BMI calculation
  document.getElementById("patientHeight").addEventListener("input", calculateBMI)
  document.getElementById("patientWeight").addEventListener("input", calculateBMI)
}

function handleLogin(e) {
  e.preventDefault()

  const userType = document.getElementById("userType").value
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  const errorDiv = document.getElementById("loginError")

  let user = null

  // Check credentials based on user type
  if (userType === "admin" && users.admin.username === username && users.admin.password === password) {
    user = users.admin
  } else if (
    userType === "publichealth" &&
    users.publichealth.username === username &&
    users.publichealth.password === password
  ) {
    user = users.publichealth
  } else if (userType === "dataentry" && dataEntryUsers[username] && dataEntryUsers[username].password === password) {
    user = dataEntryUsers[username]
  } else if (userType === "hospital" && hospitalUsers[username] && hospitalUsers[username].password === password) {
    user = hospitalUsers[username]
  }

  if (user) {
    currentUser = user
    localStorage.setItem("currentUser", JSON.stringify(user))
    showDashboard(userType)
    errorDiv.textContent = ""
  } else {
    errorDiv.textContent = "Invalid credentials. Please try again."
  }
}

function showDashboard(userType) {
  // Hide all pages
  document.querySelectorAll(".page").forEach((page) => page.classList.remove("active"))

  // Show appropriate dashboard
  switch (userType) {
    case "admin":
      document.getElementById("adminPage").classList.add("active")
      document.getElementById("adminWelcome").textContent = `Welcome, ${currentUser.name}`
      loadAdminData()
      break
    case "dataentry":
      document.getElementById("dataEntryPage").classList.add("active")
      document.getElementById("dataEntryWelcome").textContent = `Welcome, ${currentUser.name}`
      loadDataEntryData()
      break
    case "hospital":
      document.getElementById("hospitalPage").classList.add("active")
      document.getElementById("hospitalWelcome").textContent = `Welcome, ${currentUser.name}`
      loadHospitalData()
      break
    case "publichealth":
      document.getElementById("publicHealthPage").classList.add("active")
      document.getElementById("publicHealthWelcome").textContent = `Welcome, ${currentUser.name}`
      loadPublicHealthData()
      break
  }
}

function logout() {
  currentUser = null
  localStorage.removeItem("currentUser")
  document.querySelectorAll(".page").forEach((page) => page.classList.remove("active"))
  document.getElementById("loginPage").classList.add("active")
  document.getElementById("loginForm").reset()
}

// Admin Functions
function createDataEntryUser(e) {
  e.preventDefault()

  const name = document.getElementById("dataEntryName").value
  const username = document.getElementById("dataEntryUsername").value
  const password = document.getElementById("dataEntryPassword").value
  const email = document.getElementById("dataEntryEmail").value
  const phone = document.getElementById("dataEntryPhone").value

  if (dataEntryUsers[username]) {
    alert("Username already exists!")
    return
  }

  dataEntryUsers[username] = {
    name,
    username,
    password,
    email,
    phone,
    type: "dataentry",
  }

  localStorage.setItem("dataEntryUsers", JSON.stringify(dataEntryUsers))
  document.getElementById("createDataEntryForm").reset()
  loadAdminData()
  alert("Data Entry user created successfully!")
}

function createHospitalUser(e) {
  e.preventDefault()

  const name = document.getElementById("hospitalName").value
  const username = document.getElementById("hospitalUsername").value
  const password = document.getElementById("hospitalPassword").value
  const location = document.getElementById("hospitalLocation").value
  const village = document.getElementById("hospitalVillage").value
  const taluk = document.getElementById("hospitalTaluk").value
  const district = document.getElementById("hospitalDistrict").value
  const zone = document.getElementById("hospitalZone").value
  const country = document.getElementById("hospitalCountry").value

  if (hospitalUsers[username]) {
    alert("Username already exists!")
    return
  }

  hospitalUsers[username] = {
    name,
    username,
    password,
    location,
    village,
    taluk,
    district,
    zone,
    country,
    type: "hospital",
  }

  localStorage.setItem("hospitalUsers", JSON.stringify(hospitalUsers))
  document.getElementById("createHospitalForm").reset()
  loadAdminData()
  alert("Hospital user created successfully!")
}

function loadAdminData() {
  const usersList = document.getElementById("usersList")
  usersList.innerHTML = ""

  // Display data entry users
  Object.values(dataEntryUsers).forEach((user) => {
    const userDiv = document.createElement("div")
    userDiv.className = "user-item"
    userDiv.innerHTML = `
            <strong>Data Entry:</strong> ${user.name} (${user.username})<br>
            <strong>Email:</strong> ${user.email}<br>
            <strong>Phone:</strong> ${user.phone}
        `
    usersList.appendChild(userDiv)
  })

  // Display hospital users
  Object.values(hospitalUsers).forEach((user) => {
    const userDiv = document.createElement("div")
    userDiv.className = "user-item"
    userDiv.innerHTML = `
            <strong>Hospital:</strong> ${user.name} (${user.username})<br>
            <strong>Location:</strong> ${user.village}, ${user.taluk}, ${user.district}, ${user.zone}, ${user.country}
        `
    usersList.appendChild(userDiv)
  })
}

// Data Entry Functions
function addLocation(e) {
  e.preventDefault()

  const village = document.getElementById("locationVillage").value
  const taluk = document.getElementById("locationTaluk").value
  const district = document.getElementById("locationDistrict").value
  const zone = document.getElementById("locationZone").value
  const country = document.getElementById("locationCountry").value

  const location = { village, taluk, district, zone, country, id: Date.now() }
  locations.push(location)

  localStorage.setItem("locations", JSON.stringify(locations))
  document.getElementById("addLocationForm").reset()
  loadDataEntryData()
  alert("Location added successfully!")
}

function saveWaterQualityData(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const data = {}

  // Get all form fields
  const fields = [
    "waterQualityLocation",
    "colour",
    "odour",
    "taste",
    "turbidity",
    "ph",
    "ec",
    "tds",
    "hardness",
    "alkalinity",
    "chlorides",
    "sulphates",
    "nitrates",
    "fluoride",
    "iron",
    "calcium",
    "magnesium",
    "sodium",
    "potassium",
    "manganese",
    "ammonia",
    "dissolvedOxygen",
    "bod",
    "cod",
    "lead",
    "arsenic",
    "mercury",
    "cadmium",
    "chromium",
    "copper",
    "zinc",
    "nickel",
    "totalColiform",
    "fecalColiform",
    "pathogenicBacteria",
    "pesticides",
    "detergents",
    "oilGrease",
    "radioactive",
    "sar",
  ]

  fields.forEach((field) => {
    const element = document.getElementById(field)
    if (element) {
      data[field] = element.value
    }
  })

  data.id = Date.now()
  data.date = new Date().toISOString()
  data.enteredBy = currentUser.name

  waterQualityData.push(data)
  localStorage.setItem("waterQualityData", JSON.stringify(waterQualityData))

  document.getElementById("waterQualityForm").reset()
  alert("Water quality data saved successfully!")
}

function loadDataEntryData() {
  // Load locations list
  const addedLocations = document.getElementById("addedLocations")
  addedLocations.innerHTML = ""

  locations.forEach((location) => {
    const locationDiv = document.createElement("div")
    locationDiv.className = "location-item"
    locationDiv.innerHTML = `
            <strong>Location:</strong> ${location.village}, ${location.taluk}, ${location.district}, ${location.zone}, ${location.country}
        `
    addedLocations.appendChild(locationDiv)
  })

  // Update location selectors
  updateLocationSelectors()
}

function updateLocationSelectors() {
  const selectors = ["waterQualityLocation", "patientLocation", "zoneSelector", "waterQualityZoneSelector"]

  selectors.forEach((selectorId) => {
    const selector = document.getElementById(selectorId)
    if (selector) {
      selector.innerHTML = '<option value="">Select Location</option>'
      locations.forEach((location) => {
        const option = document.createElement("option")
        option.value = JSON.stringify(location)
        option.textContent = `${location.village}, ${location.taluk}, ${location.district}, ${location.zone}`
        selector.appendChild(option)
      })
    }
  })
}

// Hospital Functions
function registerPatient(e) {
  e.preventDefault()

  const patientData = {
    name: document.getElementById("patientName").value,
    location: document.getElementById("patientLocation").value,
    age: document.getElementById("patientAge").value,
    gender: document.getElementById("patientGender").value,
    bloodGroup: document.getElementById("patientBloodGroup").value,
    condition: document.getElementById("patientCondition").value,
    height: document.getElementById("patientHeight").value,
    weight: document.getElementById("patientWeight").value,
    bmi: document.getElementById("patientBMI").value,
    pressure: document.getElementById("patientPressure").value,
    sugar: document.getElementById("patientSugar").value,
    others: document.getElementById("patientOthers").value,
    hospital: currentUser.name,
    date: new Date().toISOString(),
    id: Date.now(),
  }

  patientsData.push(patientData)
  localStorage.setItem("patientsData", JSON.stringify(patientsData))

  document.getElementById("patientForm").reset()
  loadHospitalData()
  alert("Patient registered successfully!")
}

function calculateBMI() {
  const height = Number.parseFloat(document.getElementById("patientHeight").value)
  const weight = Number.parseFloat(document.getElementById("patientWeight").value)

  if (height && weight) {
    const heightInMeters = height / 100
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2)
    document.getElementById("patientBMI").value = bmi
  }
}

function loadHospitalData() {
  updateLocationSelectors()

  const patientsList = document.getElementById("patientsList")
  patientsList.innerHTML = ""

  const hospitalPatients = patientsData.filter((patient) => patient.hospital === currentUser.name)

  hospitalPatients.forEach((patient) => {
    const patientDiv = document.createElement("div")
    patientDiv.className = "patient-item"
    const date = new Date(patient.date).toLocaleString()
    patientDiv.innerHTML = `
            <strong>Name:</strong> ${patient.name}<br>
            <strong>Age:</strong> ${patient.age} | <strong>Gender:</strong> ${patient.gender}<br>
            <strong>Condition:</strong> ${patient.condition}<br>
            <strong>BMI:</strong> ${patient.bmi}<br>
            <strong>Date:</strong> ${date}
        `
    patientsList.appendChild(patientDiv)
  })
}

// Public Health Functions
function loadPublicHealthData() {
  updateLocationSelectors()
  updateAnalyticsStats()
  loadAnalyticsCharts()
  updateHospitalSelector()
}

function updateAnalyticsStats() {
  const uniqueZones = [...new Set(locations.map((loc) => loc.zone))]
  const uniqueHospitals = Object.keys(hospitalUsers).length
  const totalPatients = patientsData.length
  const totalWaterTests = waterQualityData.length

  document.getElementById("totalZones").textContent = uniqueZones.length
  document.getElementById("totalHospitals").textContent = uniqueHospitals
  document.getElementById("totalPatients").textContent = totalPatients
  document.getElementById("totalWaterTests").textContent = totalWaterTests
}

function loadAnalyticsCharts() {
  // Patients Chart
  const patientsCtx = document.getElementById("patientsChart").getContext("2d")
  const monthlyPatients = getMonthlyPatients()

  new window.Chart(patientsCtx, {
    type: "line",
    data: {
      labels: monthlyPatients.labels,
      datasets: [
        {
          label: "Patients Registered",
          data: monthlyPatients.data,
          borderColor: "#667eea",
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Monthly Patient Registration",
        },
      },
    },
  })

  // Water Quality Chart
  const waterCtx = document.getElementById("waterQualityChart").getContext("2d")
  const waterQualityStats = getWaterQualityStats()

  new window.Chart(waterCtx, {
    type: "bar",
    data: {
      labels: waterQualityStats.labels,
      datasets: [
        {
          label: "Water Quality Tests",
          data: waterQualityStats.data,
          backgroundColor: "#764ba2",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Water Quality Tests by Zone",
        },
      },
    },
  })
}

function getMonthlyPatients() {
  const monthlyData = {}
  patientsData.forEach((patient) => {
    const date = new Date(patient.date)
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
    monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1
  })

  return {
    labels: Object.keys(monthlyData),
    data: Object.values(monthlyData),
  }
}

function getWaterQualityStats() {
  const zoneData = {}
  waterQualityData.forEach((test) => {
    if (test.waterQualityLocation) {
      const location = JSON.parse(test.waterQualityLocation)
      zoneData[location.zone] = (zoneData[location.zone] || 0) + 1
    }
  })

  return {
    labels: Object.keys(zoneData),
    data: Object.values(zoneData),
  }
}

function updateHospitalSelector() {
  const hospitalSelector = document.getElementById("hospitalSelector")
  hospitalSelector.innerHTML = '<option value="">Select Hospital</option>'

  Object.values(hospitalUsers).forEach((hospital) => {
    const option = document.createElement("option")
    option.value = hospital.name
    option.textContent = hospital.name
    hospitalSelector.appendChild(option)
  })
}

// Tab Functions
function showAdminTab(tabName) {
  document.querySelectorAll("#adminPage .tab-btn").forEach((btn) => btn.classList.remove("active"))
  document.querySelectorAll("#adminPage .tab-content").forEach((content) => content.classList.remove("active"))

  event.target.classList.add("active")
  document.getElementById(tabName + "Tab").classList.add("active")
}

function showDataEntryTab(tabName) {
  document.querySelectorAll("#dataEntryPage .tab-btn").forEach((btn) => btn.classList.remove("active"))
  document.querySelectorAll("#dataEntryPage .tab-content").forEach((content) => content.classList.remove("active"))

  event.target.classList.add("active")
  document.getElementById(tabName + "DataTab").classList.add("active")

  if (tabName === "waterquality") {
    document.getElementById("waterqualityTab").classList.add("active")
  }
}

function showAnalyticsTab(tabName) {
  document.querySelectorAll("#publicHealthPage .tab-btn").forEach((btn) => btn.classList.remove("active"))
  document.querySelectorAll("#publicHealthPage .tab-content").forEach((content) => content.classList.remove("active"))

  event.target.classList.add("active")
  document.getElementById(tabName + "Analytics").classList.add("active")
}

// Download Functions
function downloadZoneReport() {
  const { jsPDF } = window.jspdf
  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.text("Zone Analysis Report", 20, 20)

  doc.setFontSize(12)
  let yPosition = 40

  const uniqueZones = [...new Set(locations.map((loc) => loc.zone))]
  uniqueZones.forEach((zone) => {
    const zoneLocations = locations.filter((loc) => loc.zone === zone)
    const zonePatients = patientsData.filter((patient) => {
      if (patient.location) {
        const patientLocation = JSON.parse(patient.location)
        return patientLocation.zone === zone
      }
      return false
    })

    doc.text(`Zone: ${zone}`, 20, yPosition)
    doc.text(`Locations: ${zoneLocations.length}`, 20, yPosition + 10)
    doc.text(`Patients: ${zonePatients.length}`, 20, yPosition + 20)
    yPosition += 40

    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }
  })

  doc.save("zone-report.pdf")
}

function downloadPatientReport() {
  const { jsPDF } = window.jspdf
  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.text("Patient Report", 20, 20)

  doc.setFontSize(12)
  let yPosition = 40

  patientsData.forEach((patient) => {
    const date = new Date(patient.date).toLocaleDateString()
    doc.text(`Name: ${patient.name}`, 20, yPosition)
    doc.text(`Age: ${patient.age} | Gender: ${patient.gender}`, 20, yPosition + 10)
    doc.text(`Condition: ${patient.condition}`, 20, yPosition + 20)
    doc.text(`Hospital: ${patient.hospital}`, 20, yPosition + 30)
    doc.text(`Date: ${date}`, 20, yPosition + 40)
    yPosition += 60

    if (yPosition > 240) {
      doc.addPage()
      yPosition = 20
    }
  })

  doc.save("patient-report.pdf")
}

function downloadWaterQualityReport() {
  const { jsPDF } = window.jspdf
  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.text("Water Quality Report", 20, 20)

  doc.setFontSize(12)
  let yPosition = 40

  waterQualityData.forEach((test) => {
    const date = new Date(test.date).toLocaleDateString()
    let location = "Unknown"
    if (test.waterQualityLocation) {
      const loc = JSON.parse(test.waterQualityLocation)
      location = `${loc.village}, ${loc.zone}`
    }

    doc.text(`Location: ${location}`, 20, yPosition)
    doc.text(`pH: ${test.ph || "N/A"}`, 20, yPosition + 10)
    doc.text(`TDS: ${test.tds || "N/A"} mg/L`, 20, yPosition + 20)
    doc.text(`Date: ${date}`, 20, yPosition + 30)
    doc.text(`Entered by: ${test.enteredBy}`, 20, yPosition + 40)
    yPosition += 60

    if (yPosition > 240) {
      doc.addPage()
      yPosition = 20
    }
  })

  doc.save("water-quality-report.pdf")
}

function loadInitialData() {
  // Load any initial data if needed
  updateLocationSelectors()
}
