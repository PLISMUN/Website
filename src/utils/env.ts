import { config } from "dotenv"
import { cleanEnv, str } from "envalid"
config()

const ENV = cleanEnv(process.env, {
  TURSO_AUTH_TOKEN: str({desc: "link"}),
  TURSO_DATABASE_URL: str({desc: "link"}),
  JWT_SECRET: str({ desc: "JWT secret signing string" }),
  COOKIE_NAME: str({ desc: "Cookie name", default: "seq" }),
  EMAIL_USERNAME: str({ desc: "Email username" }),
  EMAIL_PASSWORD: str({ desc: "Email password" }),
  NOTIFICATIONEMAIL: str({
    desc: "Email to send updates to about new applications",
  }),
})
export default ENV
