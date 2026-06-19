const fs = require('fs')

let handler = async (m, { conn }) => {
let menu = `ㅤׂ   𓈈꯭⑅꯭𓈈֟  SUNOO BOT MENU ⸼   ׂ    ─┈᪲─ׅ┐  

⌓⃘꯭🎀   ֹ ִ namaㅤ : %name
⌓⃘꯭🍥   ֹ ִ tag : @%tag
⌓⃘꯭🌷   ֹ ִ status ㅤ: %status 
⌓⃘꯭🍓   ֹ ִ limit : %limit
⌓⃘꯭🎀   ֹ ִ balanceㅤ: %balance`

menu += `
───〔 𝐆 𝐑 𝐎 𝐔 𝐏 〕───
🍥 𖧧𓏻 .absen
🍥 𖧧𓏻 .add
🍥 𖧧𓏻 .addbadword
🍥 𖧧𓏻 .addlist
🍥 𖧧𓏻 .addpoin
🍥 𖧧𓏻 .afk
🍥 𖧧𓏻 .antibadword
🍥 𖧧𓏻 .antibadwordnokick
🍥 𖧧𓏻 .antibot
🍥 𖧧𓏻 .antidelete
🍥 𖧧𓏻 .antilink
🍥 𖧧𓏻 .antilinknokick
🍥 𖧧𓏻 .antiluar
🍥 𖧧𓏻 .antiviewonce
🍥 𖧧𓏻 .antiwame
🍥 𖧧𓏻 .antiwamenokick
🍥 𖧧𓏻 .blacklist
🍥 𖧧𓏻 .delblacklist
🍥 𖧧𓏻 .listblacklist
🍥 𖧧𓏻 .cekabsen
🍥 𖧧𓏻 .cekidgroup
🍥 𖧧𓏻 .cekpoint
🍥 𖧧𓏻 .ceksewa
🍥 𖧧𓏻 .ceksewabyid
🍥 𖧧𓏻 .cekwarn
🍥 𖧧𓏻 .createschedulecall
🍥 𖧧𓏻 .delbadword
🍥 𖧧𓏻 .delete
🍥 𖧧𓏻 .deleteabsen
🍥 𖧧𓏻 .deletepoin
🍥 𖧧𓏻 .deletetotalpesan
🍥 𖧧𓏻 .dellist
🍥 𖧧𓏻 .delultahku
🍥 𖧧𓏻 .delwarn
🍥 𖧧𓏻 .demote
🍥 𖧧𓏻 .demotedetector
🍥 𖧧𓏻 .descgc
🍥 𖧧𓏻 .done
🍥 𖧧𓏻 .gamemode
🍥 𖧧𓏻 .getlist
🍥 𖧧𓏻 .groupadmin
🍥 𖧧𓏻 .groupinfo
🍥 𖧧𓏻 .groupsetting
🍥 𖧧𓏻 .grouptime
🍥 𖧧𓏻 .hidetag
🍥 𖧧𓏻 .kick
🍥 𖧧𓏻 .leavegc
🍥 𖧧𓏻 .left
🍥 𖧧𓏻 .levelling
🍥 𖧧𓏻 .linkgc
🍥 𖧧𓏻 .revokelink
🍥 𖧧𓏻 .list
🍥 𖧧𓏻 .listbadword
🍥 𖧧𓏻 .listpoint
🍥 𖧧𓏻 .listtotalpesan
🍥 𖧧𓏻 .listultah
🍥 𖧧𓏻 .listwarn
🍥 𖧧𓏻 .mulaiabsen
🍥 𖧧𓏻 .mute
🍥 𖧧𓏻 .promote
🍥 𖧧𓏻 .promotedetector
🍥 𖧧𓏻 .proses
🍥 𖧧𓏻 .refreshgroup
🍥 𖧧𓏻 .resetbadword
🍥 𖧧𓏻 .resetlist
🍥 𖧧𓏻 .resetpoint
🍥 𖧧𓏻 .resettotalpesan
🍥 𖧧𓏻 .resetwarn
🍥 𖧧𓏻 .setdescgc
🍥 𖧧𓏻 .setnamegc
🍥 𖧧𓏻 .setopen
🍥 𖧧𓏻 .setclose
🍥 𖧧𓏻 .setppgc
🍥 𖧧𓏻 .setppgcpanjang
🍥 𖧧 .setproses
🍥 𖧧𓏻 .setdone
🍥 𖧧𓏻 .setwarn
🍥 𖧧𓏻 .setwelcome
🍥 𖧧𓏻 .setleft
🍥 𖧧𓏻 .setwelcometype
🍥 𖧧𓏻 .setlefttype
🍥 𖧧𓏻 .sider
🍥 𖧧𓏻 .tagall
🍥 𖧧𓏻 .tfpoint
🍥 𖧧𓏻 .totag
🍥 𖧧𓏻 .totalpesan
🍥 𖧧𓏻 .ultahku
🍥 𖧧𓏻 .vote
🍥 𖧧𓏻 .warn
🍥 𖧧𓏻 .welcome

───〔 𝐓 𝐎 𝐎 𝐋 𝐒 〕───
🌷 𖧧𓏻 .aiimage
🌷 𖧧𓏻 .blur
🌷 𖧧𓏻 .cekplatform
🌷 𖧧𓏻 .ehex
🌷 𖧧𓏻 .dhex
🌷 𖧧𓏻 .ebase64
🌷 𖧧𓏻 .dbase64
🌷 𖧧𓏻 .enc
🌷 𖧧𓏻 .dec
🌷 𖧧𓏻 .fakereply
🌷 𖧧𓏻 .hartatahta
🌷 𖧧𓏻 .jadianime
🌷 𖧧𓏻 .kirim
🌷 𖧧𓏻 .confess
🌷 𖧧𓏻 .menfess
🌷 𖧧𓏻 .nulis
🌷 𖧧𓏻 .folio
🌷 𖧧𓏻 .ocr
🌷 𖧧𓏻 .openai
🌷 𖧧𓏻 .poll
🌷 𖧧𓏻 .ptvtovideo
🌷 𖧧𓏻 .qrcode
🌷 𖧧𓏻 .qrcodereader
🌷 𖧧𓏻 .readmore
🌷 𖧧𓏻 .readviewonce
🌷 𖧧𓏻 .removebackground
🌷 𖧧𓏻 .screenshot
🌷 𖧧𓏻 .shortlink
🌷 𖧧𓏻 .myemail
🌷 𖧧𓏻 .getemail
🌷 𖧧𓏻 .tomp3
🌷 𖧧𓏻 .tovn
🌷 𖧧𓏻 .toquickvideo
🌷 𖧧𓏻 .tourl
🌷 𖧧𓏻 .toviewonce
🌷 𖧧𓏻 .translate
🌷 𖧧𓏻 .tts
🌷 𖧧𓏻 .tts2
🌷 𖧧𓏻 .upscale
🌷 𖧧𓏻 .voicejapan
🌷 𖧧𓏻 .halah
🌷 𖧧𓏻 .hilih
🌷 𖧧𓏻 .huluh
🌷 𖧧𓏻 .heleh
🌷 𖧧𓏻 .holoh
🌷 𖧧𓏻 .wait
🌷 𖧧𓏻 .ytcomment

───〔 𝐆 𝐀 𝐌 𝐄 〕───
🍓 𖧧𓏻 .akinator
🍓 𖧧𓏻 .akinatorstart
🍓 𖧧𓏻 .akinatorstop
🍓 𖧧𓏻 .asahotak
🍓 𖧧𓏻 .buylimit
🍓 𖧧𓏻 .caklontong
🍓 𖧧𓏻 .dare
🍓 𖧧𓏻 .family100
🍓 𖧧𓏻 .hint
🍓 𖧧𓏻 .math
🍓 𖧧𓏻 .nyerah
🍓 𖧧𓏻 .redeem
🍓 𖧧𓏻 .sambungkata
🍓 𖧧𓏻 .siapakahaku
🍓 𖧧𓏻 .sloth
🍓 𖧧𓏻 .suit
🍓 𖧧𓏻 .susunkalimat
🍓 𖧧𓏻 .susunkata
🍓 𖧧𓏻 .susunlirik
🍓 𖧧𓏻 .tebakbendera
🍓 𖧧𓏻 .tebakbom
🍓 𖧧𓏻 .tebakchara
🍓 𖧧𓏻 .tebakgambar
🍓 𖧧𓏻 .tebakkata
🍓 𖧧𓏻 .tebaklagu
🍓 𖧧𓏻 .tebaklaguanime
🍓 𖧧𓏻 .tebaklagukpop
🍓 𖧧𓏻 .tekateki
🍓 𖧧𓏻 .tfbalance
🍓 𖧧𓏻 .truth
🍓 𖧧𓏻 .werewolf

───〔 𝐑 𝐀 𝐍 𝐃 𝐎 𝐌 〕───
🎀 𖧧𓏻 .alay
🎀 𖧧𓏻 .apakah
🎀 𖧧𓏻 .faktaunik
🎀 𖧧𓏻 .husbu
🎀 𖧧𓏻 .jadian
🎀 𖧧𓏻 .kapankah
🎀 𖧧𓏻 .katabijak
🎀 𖧧𓏻 .loli
🎀 𖧧𓏻 .pantun
🎀 𖧧𓏻 .ppcouple
🎀 𖧧𓏻 .puisi
🎀 𖧧𓏻 .quotesanime
🎀 𖧧𓏻 .randomanime
🎀 𖧧𓏻 .randommeme
🎀 𖧧𓏻 .randomtag
🎀 𖧧𓏻 .rate
🎀 𖧧𓏻 .siapakah
🎀 𖧧𓏻 .neko
🎀 𖧧𓏻 .waifu

───〔 𝐀 𝐍 𝐎 𝐍 𝐘 𝐌 𝐎 𝐔 𝐒 〕───
🍥 𖧧𓏻 .anonymous
🍥 𖧧𓏻 .start
🍥 𖧧𓏻 .next
🍥 𖧧𓏻 .leave
🍥 𖧧𓏻 .send

───〔 𝐒 𝐓 𝐈 𝐂 𝐊 𝐄 𝐑 〕───
🌷 𖧧𓏻 .attp
🌷 𖧧𓏻 .delsetwm
🌷 𖧧𓏻 .quickchat
🌷 𖧧𓏻 .semoji
🌷 𖧧𓏻 .semojimix
🌷 𖧧𓏻 .setwm
🌷 𖧧𓏻 .sticker
🌷 𖧧𓏻 .stickercircle
🌷 𖧧𓏻 .stickerinfo
🌷 𖧧𓏻 .smeme
🌷 𖧧𓏻 .snobg
🌷 𖧧𓏻 .stickerwm
🌷 𖧧𓏻 .takesticker
🌷 𖧧𓏻 .telestick
🌷 𖧧𓏻 .toimg
🌷 𖧧𓏻 .trigger
🌷 𖧧𓏻 .ttp

───〔 𝐈 𝐍 𝐅 𝐎 〕───
🍓 𖧧𓏻 .cekpremium
🍓 𖧧𓏻 .infocovid
🍓 𖧧𓏻 .infogempa
🍓 𖧧𓏻 .infounsur
🍓 𖧧𓏻 .kodebahasa
🍓 𖧧𓏻 .leavenosewa
🍓 𖧧𓏻 .level
🍓 𖧧𓏻 .limit
🍓 𖧧𓏻 .balance
🍓 𖧧𓏻 .listban
🍓 𖧧𓏻 .listblock
🍓 𖧧𓏻 .listgroup
🍓 𖧧𓏻 .listgroupnosewa
🍓 𖧧𓏻 .listonline
🍓 𖧧𓏻 .listpremium
🍓 𖧧𓏻 .profile
🍓 𖧧𓏻 .status
🍓 𖧧𓏻 .topglobal
🍓 𖧧𓏻 .toplocal

───〔 𝐃 𝐎 𝐖 𝐍 𝐋 𝐎 𝐀 𝐃 〕───
🎀 𖧧𓏻 .ig
🎀 𖧧𓏻 .pinterest 
🎀 𖧧𓏻 .threads
🎀 𖧧𓏻 .tiktok
🎀 𖧧𓏻 .x
🎀 𖧧𓏻 .ytmp3
🎀 𖧧𓏻 .ytmp4

───〔 𝐓 𝐄 𝐗 𝐓 𝐌 𝐀 𝐊 𝐄 𝐑 〕───
🍥 𖧧𓏻 .lightglow
🍥 𖧧𓏻 .thunder
🍥 𖧧𓏻 .blackpink
🍥 𖧧𓏻 .bear
🍥 𖧧𓏻 .cloud
🍥 𖧧𓏻 .neonlight
🍥 𖧧𓏻 .sand
🍥 𖧧𓏻 .dropwater
🍥 𖧧𓏻 .magma
🍥 𖧧𓏻 .glow
🍥 𖧧𓏻 .neon
🍥 𖧧𓏻 .window
🍥 𖧧𓏻 .sky
🍥 𖧧𓏻 .pencil
🍥 𖧧𓏻 .cartoon
🍥 𖧧𓏻 .spacetext
🍥 𖧧𓏻 .greenneon
🍥 𖧧𓏻 .bisnissign
🍥 𖧧𓏻 .bokeh
🍥 𖧧𓏻 .firework
🍥 𖧧𓏻 .batman
🍥 𖧧𓏻 .holo
🍥 𖧧𓏻 .narutologo
🍥 𖧧𓏻 .glitch
🍥 𖧧𓏻 .thor
🍥 𖧧𓏻 .wolf
🍥 𖧧𓏻 .phlogo
🍥 𖧧𓏻 .avangers
🍥 𖧧𓏻 .marvel
🍥 𖧧𓏻 .halloween
🍥 𖧧𓏻 .graffiti

───〔 𝐆 𝐄 𝐍 𝐄 𝐑 𝐀 𝐋 〕───
🌷 𖧧𓏻 .owner
🌷 𖧧𓏻 .ping
🌷 𖧧𓏻 .runtime
🌷 𖧧𓏻 .promo
🌷 𖧧𓏻 .sewa
🌷 𖧧𓏻 .premium
🌷 𖧧𓏻 .payment
🌷 𖧧𓏻 .bot

footer: `      ֺ  ♡ִ⃕  link channel sunoo bot 🍭 𝅄
ㅤ╰─⟨ https://whatsapp.com/channel/0029VbCcH0k90x2tExTqkM3Z``

await conn.sendMessage(m.chat, {
  image: fs.readFileSync('./assets/sunoo.jpg'),
  caption: menu,
  mentions: [m.sender]
}, { quoted: m })
}

handler.command = /^(menu|help|\?)$/i
handler.limit = false
module.exports = handler
