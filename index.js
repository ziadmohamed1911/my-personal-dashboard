import {quotes} from "./quotes.js"

const imageWidth = window.innerWidth
const timeText = document.getElementById("time-text")
const greetingText = document.getElementById("greeting-text")
const weatherEL = document.getElementById("weather")
const quoteText = document.getElementById("quote-text")
const greetings = ["Good morning", "Good afternoon", "Good night"]
const myName = "Ziad" 
const weatherMaxAge = 30 * 60 * 1000

async function getNewBg(){
    try{
        const res = await fetch("https://api.unsplash.com/photos/random?query=marvel&client_id=Zyahzk9XJf18wQ_RnIpcrWbm9bVcNbujYTT-6Bq0dSU")
        if(!res.ok){
            throw Error("couldn't get image")
        }
        const data = await res.json()
        const img = {
            url : `${data.urls.raw}?w=${imageWidth}`,
            date : new Date().toDateString()
        }
        localStorage.setItem("background", JSON.stringify(img))
    }catch(err){
        document.body.style.backgroundImage = `url("https://images.unsplash.com/photo-1568833450751-fba3c6b2d129?w=${imageWidth}")`
    }
}


function GetstoredBg(item){
    const storedData = localStorage.getItem(item)
    return storedData ? JSON.parse(storedData) : null
}


async function loadbg(){
    let img = GetstoredBg("background")
    if(!img || img.date !== new Date().toDateString()){
        await getNewBg()
        img = GetstoredBg("background")
        
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

function renderGreeting(){
    const hourTime = new Date().getHours()
    if(hourTime < 12){
        greetingText.textContent = `${greetings[0]}, ${myName}`
    }else if(hourTime < 18){
        greetingText.textContent = `${greetings[1]}, ${myName}`
    }else{
        greetingText.textContent = `${greetings[2]}, ${myName}`
    }
}

function drawWeather(weather){
    weatherEL.innerHTML = `
        <div class="weather-top">
            <img src="${weather.iconUrl}">
            <p class="weather-temp">${Math.round(weather.temp)}°</p>
        </div>
        <p class="city"></p>`
        weatherEL.querySelector("img").alt = weather.iconAlt
        weatherEL.querySelector(".city").textContent = weather.city
}

function getCurrentWeather(){
    navigator.geolocation.getCurrentPosition(async position => {
        try{
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?appid=595dc0173f26820aa01b6b247c4915dc&lat=${position.coords.latitude}&units=metric&lon=${position.coords.longitude}`)
            if(!res.ok){
                throw Error("couldn't get weather")
            }
            const data = await res.json()
            const weather = {
                iconUrl : `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                iconAlt : data.weather[0].description,
                temp : data.main.temp,
                city : data.name,
                time : Date.now()
            }
            localStorage.setItem("weather", JSON.stringify(weather))
            drawWeather(weather)
        }catch(err){
            console.log(err)
            weatherEL.textContent = "Weather unavailable"
        }
        
    },() => {
        weatherEL.textContent = "Location blocked"
    })
}

function renderWeather(){
    const weather = GetstoredBg("weather")
    if(weather && Date.now() - weather.time < weatherMaxAge){
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

renderQoute()
renderWeather()
renderGreeting()
renderTime()
setInterval(renderTime, 1000)
loadbg()
