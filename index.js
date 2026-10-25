const imageWidth = window.innerWidth
const timeText = document.getElementById("time-text")
const greetingText = document.getElementById("greeting-text")
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


function GetstoredBg(){
    const storedData = localStorage.getItem("background")
    return storedData ? JSON.parse(storedData) : null
}


async function loadbg(){
    let img = GetstoredBg()
    if(!img || img.date !== new Date().toDateString()){
        await getNewBg()
        img = GetstoredBg()
        
    }

    if(img){
        console.log(img)
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

renderGreeting()
renderTime()
setInterval(renderTime, 1000)
loadbg()