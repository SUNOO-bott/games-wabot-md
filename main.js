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

const { DisconnectReason, useMultiFileAuthState } = (await import('@whiskeysockets/baileys')).default
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

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
  global.db.chain = _.chain(global.db.data)
}
loadDatabase()

global.chat = async (m, sock) => {
  sock.readMessages([m.key])
}

async function connectionOptions() {
  const { state, saveCreds } = await useMultiFileAuthState('./session')
  return {
    printQRInTerminal: true,
    logger: pino({ level: 'fatal' }),
    auth: state,
    browser: ['Sunoo Bot', 'Safari', '1.0.0']
  }
}

async function start() {
  const conn = makeWASocket(await connectionOptions())
  conn.isInit = false

  conn.welcome = 'Halo @user Selamat datang di @subject'
  conn.bye = 'Sayonara @user'
  conn.spromote = '@user telah menjadi admin!'
  conn.sdemote = '@user telah diberhentikan dari admin!'
  conn.sDesc = 'Deskripsi grup telah diubah menjadi @desc'
  conn.sSubject = 'Judul grup telah diubah menjadi @subject'
  conn.sIcon = 'Icon grup telah diubah!'

  conn.ev.on('messages.upsert', async chatUpdate => {
    if (!chatUpdate.messages) return
    let m = chatUpdate.messages[0]
    if (!m.message) return
    m.message = (Object.keys(m.message)[0] === 'ephemeralMessage')? m.message.ephemeralMessage.message : m.message
    if (m.key && m.key.remoteJid === 'status@broadcast') return
    if (!conn.public &&!m.key.fromMe && chatUpdate.type === 'notify') return
    if (m.key.id.startsWith('BAE5') && m.key.id.length === 16) return
    m = serialize(m, conn)
    m.exp = 0
    m.limit = false
    try {
      let plugins = Object.values(global.plugins).filter(plugin =>!plugin.disabled)
      for (let plugin of plugins) {
        if (!plugin) continue
        if (plugin.before) await plugin.before.call(conn, m, { conn })
        if (typeof plugin.all === 'function') await plugin.all.call(conn, m, { chatUpdate, conn })
      }
      if (typeof m.text!== 'string') m.text = ''
      let _user = global.db.data.users[m.sender]
      let user = global.db.data.users[m.sender]
      if (typeof user!== 'object') global.db.data.users[m.sender] = {}
      if (user) {
        if (!('exp' in user)) user.exp = 0
        if (!('limit' in user)) user.limit = 10
        if (!('lastclaim' in user)) user.lastclaim = 0
        if (!('registered' in user)) user.registered = false
        if (!user.registered) {
          if (!('name' in user)) user.name = m.name
          if (!('age' in user)) user.age = -1
          if (!('regTime' in user)) user.regTime = -1
        }
        if (!('afk' in user)) user.afk = -1
        if (!('afkReason' in user)) user.afkReason = ''
        if (!('banned' in user)) user.banned = false
        if (!('warn' in user)) user.warn = 0
        if (!('level' in user)) user.level = 0
        if (!('role' in user)) user.role = 'Beginner'
        if (!('autolevelup' in user)) user.autolevelup = true
      } else global.db.data.users[m.sender] = {
        exp: 0,
        limit: 10,
        lastclaim: 0,
        registered: false,
        name: m.name,
        age: -1,
        regTime: -1,
        afk: -1,
        afkReason: '',
        banned: false,
        warn: 0,
        level: 0,
        role: 'Beginner',
        autolevelup: true
      }

      let chat = global.db.data.chats[m.chat]
      if (typeof chat!== 'object') global.db.data.chats[m.chat] = {}
      if (chat) {
        if (!('isBanned' in chat)) chat.isBanned = false
        if (!('welcome' in chat)) chat.welcome = true
        if (!('detect' in chat)) chat.detect = true
        if (!('sWelcome' in chat)) chat.sWelcome = ''
        if (!('sBye' in chat)) chat.sBye = ''
        if (!('sPromote' in chat)) chat.sPromote = ''
        if (!('sDemote' in chat)) chat.sDemote = ''
        if (!('delete' in chat)) chat.delete = true
        if (!('antidelete' in chat)) chat.antidelete = false
        if (!('antibadword' in chat)) chat.antibadword = false
        if (!('antibadwordNokick' in chat)) chat.antibadwordNokick = false
        if (!('antiLink' in chat)) chat.antiLink = false
        if (!('antiLinkNokick' in chat)) chat.antiLinkNokick = false
      } else global.db.data.chats[m.chat] = {
        isBanned: false,
        welcome: true,
        detect: true,
        sWelcome: '',
        sBye: '',
        sPromote: '',
        sDemote: '',
        delete: true,
        antidelete: false,
        antibadword: false,
        antibadwordNokick: false,
        antiLink: false,
        antiLinkNokick: false
      }

      let settings = global.db.data.settings[conn.user.jid]
      if (typeof settings!== 'object') global.db.data.settings[conn.user.jid] = {}
      if (settings) {
        if (!('self' in settings)) settings.self = false
        if (!('restrict' in settings)) settings.restrict = false
        if (!('autoread' in settings)) settings.autoread = false
      } else global.db.data.settings[conn.user.jid] = {
        self: false,
        restrict: false,
        autoread: false
      }

      for (let name in plugins) {
        let plugin = plugins[name]
        if (!plugin) continue
        if (plugin.disabled) continue
        if (!plugin.command) continue
        const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
        let _prefix = plugin.customPrefix? plugin.customPrefix : conn.prefix? conn.prefix : global.prefix
        let match = (_prefix instanceof RegExp? [[_prefix.exec(m.text), _prefix]] : Array.isArray(_prefix)? _prefix.map(p => {
          let re = p instanceof RegExp? p : new RegExp(str2Regex(p))
          return [re.exec(m.text), re]
        }) : typeof _prefix === 'string'? [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] : [[[], new RegExp]])
        let prefix = match[0][0]
        if (!prefix) continue
        let usedPrefix = prefix[0]
        let command = m.text.replace(usedPrefix, '').trim().split` `.shift().toLowerCase()
        let isAccept = plugin.command instanceof RegExp? plugin.command.test(command) : Array.isArray(plugin.command)? plugin.command.some(cmd => cmd instanceof RegExp? cmd.test(command) : cmd === command) : typeof plugin.command === 'string'? plugin.command === command : false
        if (!isAccept) continue
        m.plugin = name
        if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
          let chat = global.db.data.chats[m.chat]
          let user = global.db.data.users[m.sender]
          if (chat.isBanned) return
          if (user.banned) return
        }
        let fail = plugin.fail || global.dfail
        let isOwner = m.fromMe || conn.user.jid == m.sender || m.sender.split`@`[0] in global.owner
        let isMods = isOwner || m.sender.split`@`[0] in global.mods
        let isPrems = isOwner || isMods || m.sender.split`@`[0] in global.prems
        let groupMetadata = m.isGroup? await conn.groupMetadata(m.chat).catch(_ => ({})) : {}
        let participants = m.isGroup? groupMetadata.participants : []
        let user_ = m.isGroup? participants.find(u => conn.decodeJid(u.id) === m.sender) : {}
        let bot_ = m.isGroup? participants.find(u => conn.decodeJid(u.id) == conn.user.jid) : {}
        let isAdmin = user_?.admin == 'admin' || false
        let isBotAdmin = bot_?.admin == 'admin' || false
        let isBot = m.id.startsWith('BAE5') && m.id.length === 16
        let isROwner = [conn.user.jid,...global.owner.map(([number]) => number + '@s.whatsapp.net')].includes(m.sender)
        let args = m.text.trim().split` `.slice(1)
        let text = args.join` `
        let extra = {
          match,
          usedPrefix,
          noPrefix: m.text.replace(usedPrefix, ''),
          args,
          command,
          text,
          conn,
          participants,
          groupMetadata,
          user,
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
