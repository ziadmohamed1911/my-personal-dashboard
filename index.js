const imageWidth = window.innerWidth

async function getNewBg(){
    try{
        const res = await fetch("https://api.unsplash.com/photos/random?query=marvel&client_id=9MxwUBKNowdv3PC57aGwu1Q5_RjZkiov6ljSWreicCI")
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
        document.body.style.backgroundImage = `url("https://images.unsplash.com/photo-1417325384643-aac51acc9e5d?w=${imageWidth}")`
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
        img = GetstoredBg
    }

    if(img){
        document.body.style.backgroundImage = `url("${img.url}")`
    }
}

function renderTime(){
    const time = new Date().toLocaleTimeString({ timeStyle: "short"})
    console.log(time)
}

loadbg()