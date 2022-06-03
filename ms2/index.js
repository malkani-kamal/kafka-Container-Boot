const express = require ('express' )
const kafka = require('kafka-node')
const app = express()
var nodemailer = require('nodemailer');

app.use (express.json())

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  })
const kfAreRunning = async() => {
    const client = new kafka.KafkaClient({kafkaHost: process.env.KKAFKA_BOOTSTRAP_SERVERS})
    const consumer =    new kafka.consumer(client, [{topic: process.env.KAFKA_TOPIC}],
        {
            autoCommit: false
        })
    consumer.on('message',async(message)=>{
        let mailOptions = {
            from: 'tomerpacific@gmail.com',
            to: message.user,
            subject: 'Notification Micro service',
            text: 'Hi your wallet has been created'
          };
          transporter.sendMail(mailOptions, function(err, data) {
            if (err) {
              console.log("Error " + err);
            } else {
              console.log("Email sent successfully from ms1");
            }
          });

    })
    consumer.on('error',(err)=> {
        console.log(err)
    })

}
setTimeout(kfAreRunning, 10000)

app.listen(process.env.PORT)