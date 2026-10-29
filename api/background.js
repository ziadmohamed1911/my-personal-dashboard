export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?orientation=landscape&query=marvel&client_id=${process.env.UNSPLASH_KEY}`
    )

    if (!response.ok) {
      return res.status(response.status).json({ error: "Unsplash error" })
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Failed to fetch background" })
  }
}