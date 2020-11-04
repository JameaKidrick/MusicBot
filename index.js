require('dotenv').config()
const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const bot = new Discord.Client();
const token = process.env.DISCORD_BOT_TOKEN;
const prefix = '!'
const version = '1.0.1'
const servers = {};

bot.on('ready', () => {
  console.log('I am online! <3')
}); // when the bot is online, it will send a message to the console

// bot.on('message', (message) => {
//   if(message.content === 'HELLO'){
//     console.log(message)
//     message.reply(`Hello! Welcome to ${message.guild.name}! I hope you enjoy your stay <3`)
//   }
// })

bot.on('message', (message) => {
  let args = message.content.substring(prefix.length).split(' ')

  switch(args[0]){
    case 'ping': // same as if(args[0] === ping){}
      // message.reply('pong!') // this will reply to a specific person by pinging them
      message.channel.send('pong!') // this will send a message to the channel without pinging anyone
      break;

    case 'website':
      message.channel.send('www.jameakidrick.com')
      break;

    // COMMAND THAT ACCEPTS A SECOND ARGUMENT
    case 'info':
      if(args[1] === 'version'){
        message.channel.send(`Version ${version}`);
      }else if(!args[1]){
        message.channel.send('Please add a second argument. *Example: !info version*')
      }else{
        message.channel.send(`Invalid argument. Instead of *${args[1]}*, try *version*.`)
      }
      break;

    // COMMAND TO DELETE A CERTAIN AMOUNT OF MESSAGES
    case 'clear':
      message.channel.bulkDelete(args[1])
      break;

    // TIME-SENSITIVE COMMAND AND RESPONSE
    case 'spec':
      message.reply('See or Change?')
      const filter = m => m.author.id === message.author.id
      message.channel.awaitMessages(filter, {
        max: 1,
        time: 10000
      })
      .then(collected => {
        if(collected.first().content === 'See'){
          return message.channel.send("You Want To See Someones Spec OK!");
        }else if(collected.first().content === 'Change'){
          return message.channel.send("You Want To Change Your Spec OK!");
        }
      })
      .catch(collected => {
        message.reply('Command timed out. Please try again and reply within 10 seconds. <3');
      });
      break;

    /******************************* MUSIC DISCORD BOT *******************************/
    case 'play':
      const playSong = (connection, message) => {
        var server = servers[message.guild.id]

        server.dispatcher = connection.play(ytdl(server.queue[0].url, {filter: 'audioonly'}))
        console.log('CURRENT QUEUE', server.queue)
        server.dispatcher.on('finish', () => {
          server.queue.shift();
          if(server.queue[0]){
            playSong(connection, message)
          } else {
            console.log('LEAVING VOICE CHANNEL')
            connection.disconnect();
          }
        })
      }


      if(!args[1]){
        return message.reply('Please provide a link.\n`Example: !play https://youtu.be/dQw4w9WgXcQ`')
      }

      if(!message.member.voice.channel){
        return message.reply('Please join a voice channel to play the music.')
      }

      if(!servers[message.guild.id]){
        servers[message.guild.id] = {
          queue: []
        }
      }

      var server = servers[message.guild.id];

      server.queue.push({url: args[1]});

      if(!message.guild.voice || message.guild.voice.connection === null){
        message.member.voice.channel.join()
          .then(connection => {
            console.log('PLAYING')
            playSong(connection, message)
          })
      }
    break;

    case 'skip':
      var server = servers[message.guild.id];

      if(server.dispatcher){
        server.dispatcher.end();
        message.channel.send('Skipping this song.')
      }
    break;

    case 'stop':
      var server = servers[message.guild.id];
      if(message.member.voice.channel){
        for(let i = server.queue.length - 1; i >= 0; i --){
          server.queue.splice(i, 1);
        }
          
        server.queue = [];
        server.dispatcher.end();
        message.channel.send('Ending the queue and leaving the voice channel!')
        console.log('Stopped the queue')
      }

      if(message.guild.connection){
        message.member.voice.connection.disconnect()
      }
    break;

    case 'check':
      console.log(message.guild.voice.connection === null)
    break;

    case 'join':
      if(!message.guild.voiceConnection){
        message.member.voice.channel.join()
          .then(connection => {
            console.log('I\'M HERE!!!')
            console.log(message.guild.voice.connection === null)
          })
      }
    break;

    case 'leave':
      message.member.voice.channel.leave()
      console.log(message.guild.voice.connection === null)
    break;
  }
})

bot.login(token); // logs into bot