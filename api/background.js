export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?orientation=landscape&query=nature&client_id=${process.env.UNSPLASH_KEY}`
    )
    const data = await response.json()
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch background" })
  }

}