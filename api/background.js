export default async function handler(req, res) {
  try {
    const res = await fetch(`https://my-personal-dashboard-sepia.vercel.app//api/background`)
    const data = await response.json()
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch background" })
  }

}