const imageWidth = window.innerWidth
const timeText = document.getElementById("time-text")
const greetingText = document.getElementById("greeting-text")
const weatherEL = document.getElementById("weather")
const greetings = ["Good morning", "Good afternoon", "Good night"]
const myName = "Ziad" 

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

function getCurrentWeather(){
    navigator.geolocation.getCurrentPosition(async position => {
        try{
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?appid=595dc0173f26820aa01b6b247c4915dc&lat=${position.coords.latitude}&units=metric&lon=${position.coords.longitude}`)
            const data = await res.json()
            console.log(data)
            const weather = {
                iconUrl : `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                iconAlt : data.weather[0].description,
                temp : data.main.temp,
                city : data.name,
                date : new Date().toDateString()
            }
            localStorage.setItem("weather", JSON.stringify(weather))
        }catch(err){
            console.log(err)
        }
        
    })
}

function renderWeather(){
    let weather = GetstoredBg("weather")
    if(!weather || weather.date !== new Date().toDateString()){
        getCurrentWeather()
        weather = GetstoredBg("weather") 
    }

    if(weather){
        weatherEL.innerHTML = `
        <div class="weather-top">
            <img src="${weather.iconUrl}" alt="${weather.iconAlt}">
            <p class="weather-temp">${Math.round(weather.temp)}°</p>
        </div>
        <p class="city">${weather.city}</p>`
    }
}

renderWeather()
renderGreeting()
renderTime()
setInterval(renderTime, 1000)
loadbg()
