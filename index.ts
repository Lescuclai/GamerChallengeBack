import { config } from "./config.js"
import { app } from "./src/app.js"

const port = config.server.port
app.listen(port, () => {
  console.log(`🚀 Server started at http://localhost:${port}`)
})
