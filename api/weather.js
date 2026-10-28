export default async function handler(req, res) {
  const { lat, lon } = req.query

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_KEY}`
    )
    const data = await response.json()
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather" })
  }
}