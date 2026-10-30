export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
  
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const lat = Number(req.query.lat)
  const lon = Number(req.query.lon)

  if (
    !Number.isFinite(lat) || !Number.isFinite(lon) ||
    Math.abs(lat) > 90 || Math.abs(lon) > 180
  ) {
    return res.status(400).json({ error: "Invalid coordinates" })
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_KEY}`
    )

    if (!process.env.WEATHER_KEY) {
    return res.status(500).json({ error: "Weather key not configured" })
  }
    if (!response.ok) {
      return res.status(response.status).json({ error: "Weather provider error" })
    }

    const data = await response.json()
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=300")
    return res.status(200).json(data)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Failed to fetch weather" })
  }
}