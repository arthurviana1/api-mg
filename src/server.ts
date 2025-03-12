import fastify from "fastify";
import Mailgun from "mailgun.js";
import FormData from "form-data";
import dotenv from "dotenv";
import cors from "@fastify/cors";

dotenv.config();

const app = fastify();

type NodeMail = {
  from: string,
  to: string,
  subject: string,
  text: string,
  html: string
}

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
})



const mailgun = new Mailgun(FormData)
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || '',
})

app.post("/send-email", async(request, response) => {
    const{from, to, subject, text, html} = request.body as NodeMail;   
    const domain = process.env.MAILGUN_DOMAIN || ''

    const mailOptions = {
        from,
        to,
        subject,
        text,
        html
    }

    try {
        await mg.messages.create(domain, mailOptions)
        console.log('Email enviado com sucesso')
        response.status(200)
    } catch (error) {
        console.log(error)
        response.status(500)

    }
})


app.listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 5000,
}).then(() => {
    console.log('Servidor funcionando')
})
