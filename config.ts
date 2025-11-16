const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
export const config = {
  server: {
    port: parseInt(process.env.PORT || "5000"),
    allowedOrigins : [allowedOrigins,"http://localhost:3001"],
    secure: process.env.NODE_ENV === "production" || false,
    logLevel: process.env.LOG_LEVEL || "info",
    jwtSecret: process.env.JWT_SECRET,
  },
}
