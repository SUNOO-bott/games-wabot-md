process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
process.on('uncaughtException', console.error)

import './config.js'
import { createRequire } from 'module'
import path, { join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import * as ws from 'ws'
import fs, { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { Low, JSONFile } from 'lowdb'
import { Boom } from '@hapi/boom'
import yargs from 'yargs/yargs'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import { format } from 'util'
import pino from 'pino'

const { DisconnectReason, useMultiFileAuthState } = (await import('@whiskeysockets/baileys')).default

protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform!== 'win32') {
  return rmPrefix? /file:\/\/\//.test(pathURL)? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString()
}
global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true))
}
global.__require = function require(dir = import.meta.url) {
  return createRequire(dir)
}

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs? global.APIs[name] : name) + path + (query || apikeyqueryname? '?' + new URLSearchParams(Object.entries({...query,...(apikeyqueryname? { [apikeyqueryname]: global.APIKeys[name in global.APIs? global.APIs[name] : name] } : {}) })) : '')

global.timestamp = { start: new Date }

const __dirname = global.__dirname(import.meta.url)
const opts = yargs(process.argv.slice(2)).exitProcess(false).parse()
global.prefix = new RegExp('^[' + (opts['prefix'] || '!.#') + ']')

global.db = new Low(new JSONFile(`src/database.json`))
global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(async function () {
    if (!global.db.READ) {
      clearInterval(this)
      resolve(global.db.data == null? global.loadDatabase() : global.db.data)
    }
  }, 1 * 1000))
  if (global.db.data!== null) return
  global.db.READ = true
  await global.db.read().catch(console.error)
  global.db.READ = null
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
 ...(global.db.data || {})
  }
}
loadDatabase()

async function connectionOptions() {
  const { state, saveCreds } = await useMultiFileAuthState('./session')
  return {
    printQRInTerminal: false,
    logger: pino({ level: 'fatal' }),
    auth: state,
    browser: ['Sunoo Bot', 'Safari', '1.0.0']
  }
}

async function start() {
  const conn = makeWASocket(await connectionOptions())

  // AUTO PAIRING CODE UNTUK NOMOR 6283166363253
  if (!conn.authState.creds.registered) {
    setTimeout(async () => {
      let code = await conn.requestPairingCode('6283166363253')
      code = code?.match(/.{1,4}/g)?.join('-') || code
      console.log(chalk.black(chalk.bgGreen(` KODE PAIRING: ${code} `)))
      console.log(chalk.yellow('Buka WA 6283166363253 > Titik 3 > Perangkat Tertaut > Tautkan dengan nomor telepon'))
    }, 3000)
  }

  conn.ev.on('creds.update', saveCreds)

  conn.ev.on('messages.upsert', async chatUpdate => {
    if (!chatUpdate.messages) return
    let m = chatUpdate.messages[0]
    if (!m.message) return
    m.message = (Object.keys(m.message)[0] === 'ephemeralMessage')? m.message.ephemeralMessage.message : m.message
    if (m.key && m.key.remoteJid === 'status@broadcast') return
    m = serialize(m, conn)
    try {
      let plugins = Object.values(global.plugins).filter(plugin =>!plugin.disabled)
      for (let plugin of plugins) {
        if (!plugin ||!plugin.command) continue
        let command = m.text?.replace(global.prefix, '').trim().split` `.shift().toLowerCase()
        let isAccept = plugin.command instanceof RegExp? plugin.command.test(command) : Array.isArray(plugin.command)? plugin.command.includes(command) : plugin.command === command
        if (!isAccept) continue
        await plugin.call(conn, m, { conn })
        break
      }
    } catch (e) {
      console.error(e)
    }
  })
}

start()

watchFile(fileURLToPath(import.meta.url), () => {
  console.log(chalk.redBright("Update 'main.js'"))
  process.exit(0)
})r,
          bot: bot_,
          isOwner,
          isAdmin,
          isBotAdmin,
          isPrems,
          isROwner,
          isMods,
          isBot,
          chat,
          settings,
          fail,
          plugins
        }
        try {
          await plugin.call(conn, m, extra)
        } catch (e) {
          m.error = e
          console.error(e)
          if (fail) fail.call(conn, m, extra)
        } finally {
          if (typeof plugin.after === 'function') {
            try {
              await plugin.after.call(conn, m, extra)
            } catch (e) {
              console.error(e)
            }
          }
        }
        break
      }
    } catch (e) {
      console.error(e)
    } finally {
      if (opts['que'] && m.text) queue.shift()
      let user = global.db.data.users[m.sender]
      if (user) {
        user.exp += m.exp
        user.limit -= m.limit * 1
      }
    }
    try {
      if (!opts['noprint']) await (await import('./lib/print.js')).default(m, conn)
    } catch (e) {
      console.log(m, m.quoted, e)
    }
  })

  conn.ev.on('group-participants.update', async (anu) => {
    if (global.db.data.chats[anu.id]?.welcome) {
      let teks = ''
      let wel = global.db.data.chats[anu.id]?.sWelcome || conn.welcome
      let lea = global.db.data.chats[anu.id]?.sBye || conn.bye
      let pro = global.db.data.chats[anu.id]?.sPromote || conn.spromote
      let dem = global.db.data.chats[anu.id]?.sDemote || conn.sdemote
      for (let user of anu.participants) {
        let profile = await conn.profilePictureUrl(user, 'image').catch(_ => 'https://i.ibb.co/3fWyBVW/image.png')
        if (anu.action == 'add') teks = wel.replace('@user', '@' + user.split('@')[0]).replace('@subject', await conn.getName(anu.id))
        else if (anu.action == 'remove') teks = lea.replace('@user', '@' + user.split('@')[0]).replace('@subject', await conn.getName(anu.id))
        else if (anu.action == 'promote') teks = pro.replace('@user', '@' + user.split('@')[0])
        else if (anu.action == 'demote') teks = dem.replace('@user', '@' + user.split('@')[0])
        if (teks) conn.sendMessage(anu.id, { text: teks, mentions: [user] })
      }
    }
  })

  conn.ev.on('creds.update', saveCreds)
}

start()

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'main.js'"))
  delete require.cache[file]
  if (global.conns && global.conns.length > 0) {
    const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState!== ws.CLOSED).map((conn) => conn)])]
    for (const userr of users) userr.subreload()
  }
})
