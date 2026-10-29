import {quotes} from "./quotes.js"

const API_BASE = "https://my-personal-dashboard-sepia.vercel.app/"
const imageWidth = window.innerWidth
const imageHeight = window.innerHeight
const timeText = document.getElementById("time-text")
const greetingEL = document.getElementById("greeting")
const weatherEL = document.getElementById("weather")
const quoteText = document.getElementById("quote-text")
const nameInput = document.getElementById("name-input")
const submitNameBtn = document.getElementById("submit-name")
const greetings = ["Good morning", "Good afternoon", "Good night"]
const weatherMaxAge = 30 * 60 * 1000

const svgWrap = (inner) => `<svg class="weather-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`

const cloudPath = "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"
const rainCloud = "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"

const sun = svgWrap(`<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>`)
const moon = svgWrap(`<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>`)
const cloudSun = svgWrap(`<path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41M15.947 12.65a4 4 0 0 0-5.925-4.128M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/>`)
const cloud = svgWrap(`<path d="${cloudPath}"/>`)
const rain = svgWrap(`<path d="${rainCloud}"/><path d="M16 14v6M8 14v6M12 16v6"/>`)
const storm = svgWrap(`<path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/>`)
const snow = svgWrap(`<path d="${rainCloud}"/><path d="M8 15h.01M8 19h.01M12 17h.01M12 21h.01M16 15h.01M16 19h.01"/>`)
const fog = svgWrap(`<path d="${rainCloud}"/><path d="M16 17H7M17 21H9"/>`)

const weatherIcons = {
    "01d": sun, "01n": moon,
    "02d": cloudSun, "02n": cloud,
    "03": cloud, "04": cloud,
    "09": rain, "10": rain,
    "11": storm, "13": snow, "50": fog
}

submitNameBtn.addEventListener("click", (e) => {
    e.preventDefault()
    getUserName()
})

function getStored(item){
    const storedData = localStorage.getItem(item)
    return storedData ? JSON.parse(storedData) : null
}

async function getNewBg(){
    try{
        const res = await fetch(`${API_BASE}/api/background`)
        if(!res.ok) throw Error("couldn't get background")
        const data = await res.json()
        const bg = {
            url: `${data.urls.raw}&w=${imageWidth}&h=${imageHeight}&fit=crop`,
            date: new Date().toDateString()
        }
        localStorage.setItem("background", JSON.stringify(bg))
    }catch(err){
        console.log("There was an error with the API", err)
    }
}

async function loadbg(){
    let img = getStored("background")
    if(!img || img.date !== new Date().toDateString()){
        await getNewBg()
        img = getStored("background")
    }

    if(img){
        document.body.style.backgroundImage = `url("${img.url}")`
    }
}

function renderTime(){
    const time = new Date().toLocaleTimeString("en-us", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    })

    timeText.textContent = time
}

function getUserName(){
    const name = nameInput.value.trim()
    if(!name) return
    localStorage.setItem("name", JSON.stringify(name))
    renderGreeting(name)
}

function checkName(){
    const name = getStored("name")
    if(name){
        renderGreeting(name)
    }
}

function renderGreeting(name){
    const hourTime = new Date().getHours()
    let greeting = greetings[2]
    if(hourTime < 12){
        greeting = greetings[0]
    }else if(hourTime < 18){
        greeting = greetings[1]
    }

    const heading = document.createElement("h2")
    heading.textContent = `${greeting}, ${name}`
    greetingEL.replaceChildren(heading)
}

function getWeatherIcon(code = ""){
    return weatherIcons[code] ?? weatherIcons[code.slice(0, 2)] ?? cloud
}

function drawWeather(weather){
    weatherEL.innerHTML = `
        <div class="weather-top">
            <span class="weather-icon"></span>
            <p class="weather-temp">${Math.round(weather.temp)}°</p>
        </div>
        <p class="city"></p>`
    const icon = weatherEL.querySelector(".weather-icon")
    icon.innerHTML = getWeatherIcon(weather.icon)
    icon.title = weather.iconAlt
    weatherEL.querySelector(".city").textContent = weather.city
}

function getCoords(){
    return new Promise((resolve, reject) => {
        const saved = getStored("coords")
        if(saved) return resolve(saved)

        navigator.geolocation.getCurrentPosition(position => {
            const coords = {
                lat: position.coords.latitude,
                lon: position.coords.longitude
            }
            localStorage.setItem("coords", JSON.stringify(coords))
            resolve(coords)
        }, reject)
    })
}

async function getCurrentWeather(){
    try{
        const {lat, lon} = await getCoords()
       const res = await fetch(`${API_BASE}/api/weather?lat=${lat}&lon=${lon}`)
        if(!res.ok){
            throw Error("couldn't get weather")
        }
        const data = await res.json()
        const weather = {
            icon : data.weather[0].icon,
            iconAlt : data.weather[0].description,
            temp : data.main.temp,
            city : data.name,
            time : Date.now()
        }
        localStorage.setItem("weather", JSON.stringify(weather))
        drawWeather(weather)
    }catch(err){
        console.log(err)
        weatherEL.textContent = err.code === 1 ? "Location blocked" : "Weather unavailable"
    }
}

function renderWeather(){
    const weather = getStored("weather")
    if(weather && weather.icon && Date.now() - weather.time < weatherMaxAge){
       drawWeather(weather)
    }else{
        getCurrentWeather()
    }
}

function renderQoute(){
    const getRandom = (arr)=> arr[Math.floor(Math.random()* arr.length)]
    const qoute = getRandom(quotes)
    quoteText.textContent= qoute
}

checkName()
renderQoute()
renderWeather()
renderTime()
setInterval(renderTime, 1000)
loadbg()