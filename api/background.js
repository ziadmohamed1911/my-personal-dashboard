const QUERY = "marvel"

export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
  
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const params = new URLSearchParams({
      query: QUERY,
      orientation: "landscape",
      order_by: "relevant",
      per_page: "10",
      client_id: process.env.UNSPLASH_KEY
    })

    const response = await fetch(`https://api.unsplash.com/search/photos?${params}`)

    if (!response.ok) {
      return res.status(response.status).json({ error: "Unsplash error" })
    }

    const data = await response.json()

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: "No photos found" })
    }

    // return a single photo object, so the frontend code keeps working unchanged
    const photo = data.results[Math.floor(Math.random() * data.results.length)]
    return res.status(200).json(photo)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Failed to fetch background" })
  }
}