require('dotenv').config();

const {
    default: sansekaiConnect,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    delay,
    jidDecode
} = require("@whiskeysockets/baileys");

// Create a simple store replacement
const makeInMemoryStore = (config) => ({
    bind: (ev) => console.log('Store bound to events'),
    writeToFile: (path) => console.log('Writing store to file'),
    readFromFile: (path) => console.log('Reading store from file')
});

const { QuickDB } = require('quick.db');
const { MongoDriver   } = require('quickmongo');
const { Collection } = require('discord.js');

// Handlers
const MessageHandler = require('./Handlers/Message');
const EventsHandler = require('./Handlers/Events');
const { groups } = require('./Handlers/Mods');
const econ = require("./Database/Models/economy");
const contact = require('./Structures/Contact');
const utils = require('./Structures/Functions');
const CardHandler = require('./Handlers/card')
const PokeHandler = require('./Handlers/poke')
const express = require("express");
const app = express();
const { imageSync } = require('qr-image');
const mongoose = require('mongoose');
const pino = require('pino');
const axios = require('axios');
const { Boom } = require('@hapi/boom');
const { join } = require('path');
const { readdirSync } = require('fs-extra');
const chalk = require('chalk');

const port = 5000; // Fixed port for Replit environment
// MongoDB driver with provided URL
const driver = new MongoDriver('mongodb+srv://rpguser:Omotoyosi@cluster0.tafi6f0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
const log = pino({ level: 'silent' });
const path= require("path");
let sessionName = 'horlapookie'
const fs = require("fs");

// Function to read and decode session from file
function getSessionFromFile() {
    try {
        const sessionId = fs.readFileSync('./session-id.txt', 'utf8').trim();
        const sessionData = JSON.parse(Buffer.from(sessionId, 'base64').toString());
        
        // Create auth directory if it doesn't exist
        const authDir = './auth_info';
        if (!fs.existsSync(authDir)) {
            fs.mkdirSync(authDir, { recursive: true });
        }
        
        // Write session data to auth files
        fs.writeFileSync(path.join(authDir, 'creds.json'), JSON.stringify(sessionData, null, 2));
        
        return authDir;
    } catch (error) {
        console.log('No session file found or invalid session, will use default session handling');
        return `./${sessionName}`;
    }
}
// Response maps
const m1 = new Map();
const m2 = new Map();
const m3 = new Map();
const m4 = new Map();
const m5 = new Map();
const m6 = new Map();
const m7 = new Map();
const m8 = new Map();
const m9 = new Map();
const m10 = new Map();
const m11 = new Map();
let QR_GENERATE
const color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text);
};

async function startZeroTwo() {


    // Connect to MongoDB
    try {
        await driver.connect();
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        throw error;
    }
    const store = makeInMemoryStore({ logger: log.child({ level: "silent", stream: "store" }) });
    const sessionPath = getSessionFromFile();
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);

    let client = sansekaiConnect({
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        version,
        printQRInTerminal: true,
        logger: pino({ level: "fatal" }).child({ level: "fatal" }),
        browser: ["Twilight", "Safari", "1.0.0"], //Don't change this connection will be closed sice bot is connected with twilight credentials
    });
    
    store.bind(client.ev);

    client.prefix = '/';
    client.name = 'Phoenix'
    client.mods = ('2347049044897,916239664935,919775689150,917379899475,923274079362').split(',');

    // Devs
    client.groups = groups();

    client.cardMap = m1
    client.aucMap = m2
    client.sellMap = m3
    client.sell = m9
    client.haigushaResponse = m10
    client.pokemonResponse = m4
    client.pokemonMoveLearningResponse = m5
    client.pokemonEvolutionResponse = m6
    client.pokemonBattleResponse = m7
    client.pokemonBattlePlayerMap = m8
    client.pokemonChallengeResponse = m11

    
    // Database
    client.DB = new QuickDB({ filePath: "./src/Database/DB.sqlite" });

    // Tables
    client.contactDB = new QuickDB({ filePath: "./src/Database/users.sqlite" });

    // Contacts
    client.contact = contact;

    // Experience
    client.exp = new QuickDB({ filePath: "./src/Database/exp.sqlite" });

    // Cards
    client.card = new QuickDB({ filePath: "./src/Database/card.sqlite" });

    // Economy 
    client.econ = require("./Database/Models/economy");
    
    // active points
    client.act = new QuickDB({ filePath: "./src/Database/act.sqlite" });

    // Events
    client.pkmn = new QuickDB({ filePath: "./src/Database/pkmn.sqlite" });
    
    // Commands
    client.cmd = new Collection();

    // Utils
    client.utils = utils;
    
    // Groups
    client.getAllGroups = async () => Object.keys(await client.groupFetchAllParticipating());

    client.public = true;

    client.log = (text, color = 'green') =>
        color ? console.log(chalk.keyword(color)(text)) : console.log(chalk.green(text));

    const loadCommands = async () => {
        const readCommand = (rootDir) => {
            readdirSync(rootDir).forEach(($dir) => {
                const commandFiles = readdirSync(join(rootDir, $dir)).filter((file) => file.endsWith('.js'))
                for (let file of commandFiles) {
                    const command = require(join(rootDir, $dir, file))
                    client.cmd.set(command.name, command)
                }
            })
            client.log('Commands loaded!')
        }
        readCommand(join(__dirname, '.', 'Commands'))
    }

    // Handle error
    const unhandledRejections = new Map();
    process.on("unhandledRejection", (reason, promise) => {
        unhandledRejections.set(promise, reason);
        console.log("Unhandled Rejection at:", promise, "reason:", reason);
    });
    process.on("rejectionHandled", (promise) => {
        unhandledRejections.delete(promise);
    });
    process.on("Something went wrong", function (err) {
        console.log("Caught exception: ", err);
    });

    client.public = true;

    client.serializeM = (m) => smsg(client, m, store);
    client.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            QR_GENERATE = qr;
        }
 
        if (connection === "close") {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            if (reason === DisconnectReason.badSession) {
                console.log(`Bad Session File, Please Delete Session and Scan Again`);
                process.exit();
            } else if (reason === DisconnectReason.connectionClosed) {
                console.log("Connection closed, reconnecting....");
                startZeroTwo();
            } else if (reason === DisconnectReason.connectionLost) {
                console.log("Connection Lost from Server, reconnecting...");
                startZeroTwo();
            } else if (reason === DisconnectReason.connectionReplaced) {
                console.log("Connection Replaced, Another New Session Opened, Please Restart Bot");
                process.exit();
            } else if (reason === DisconnectReason.loggedOut) {
                console.log(`Device Logged Out, Please Delete Folder Session RA-ONE and Scan Again.`);
                process.exit();
            } else if (reason === DisconnectReason.restartRequired) {
                console.log("Restart Required, Restarting...");
                startZeroTwo();
            } else if (reason === DisconnectReason.timedOut) {
                console.log("Connection TimedOut, Reconnecting...");
                startZeroTwo();
            } else {
                console.log(`Unknown DisconnectReason: ${reason}|${connection}`);
                startZeroTwo();
            }
        } else if (connection === "open") {
            await delay(20000);
            loadCommands();
            client.state = 'open';
            client.log('Connected to WhatsApp', 'green');
            client.log('Total Mods: ' + client.mods.length);
            client.ev.on('messages.upsert', async (messages) => await MessageHandler(messages, client));
            client.ev.on('group-participants.update', async (event) => await EventsHandler(event, client));
            client.ev.on('contacts.update', async (update) => await contact.saveContacts(update, client));
 
        }
    });

    client.ev.on("creds.update", saveCreds);
    client.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
          let decode = jidDecode(jid) || {};
          return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
        } else return jid;
      };

      await CardHandler(client);
      await PokeHandler(client); 
    return client;
}

startZeroTwo();
// Remove MongoDB requirement check
// Web interface for QR code
app.get('/', (req, res) => {
    if (QR_GENERATE) {
        const qrImage = imageSync(QR_GENERATE, { type: 'png' });
        res.status(200).setHeader('Content-Type', 'image/png').send(qrImage);
    } else {
        res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Phoenix Bot Status</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .status { color: green; font-size: 24px; }
            </style>
        </head>
        <body>
            <h1>Phoenix WhatsApp Bot</h1>
            <div class="status">Bot is connected to WhatsApp!</div>
            <p>The bot is running and ready to receive messages.</p>
        </body>
        </html>
        `);
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Skip MongoDB connection requirement for startup
// The bot will work with SQLite databases

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


 
