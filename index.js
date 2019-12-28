const express = require("express")
const Expo = require("expo-server-sdk").default
const cors = require("cors")

const expo = new Expo()
const expressServer = express()

expressServer.use(cors())
expressServer.listen(process.env.PORT || 3000, () => {
    console.log('====================================');
    console.log("Serveur en écoute sur " + (process.env.PORT || 3000));
    console.log('====================================');

    expressServer.get("/", function (req, res) {
        const token = req.query.token;
        if (!Expo.isExpoPushToken(token)) {
            console.log('====================================');
            console.log("Invalid token");
            console.log('====================================');
            res.send({ err: "Invalid token" })
        } else {
            let messages = [
                {
                    // see expo doc 
                    to: token,
                    sound: "default",
                    body: "Notification test",
                    data: { test: "azerty" }
                }
            ]
            expo.sendPushNotificationsAsync(messages).then(ticket => {
                res.send({ ticket: ticket })
            }).catch(err => {
                console.log('====================================');
                console.log("Erreur d'envoi !");
                console.log('====================================');
                res.send({ err: "Erreur d'envoi" });
            })
        }
    })
})