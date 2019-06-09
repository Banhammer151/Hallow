/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-empty */

const SQLite = require("better-sqlite3");
const config = require("./config.json");
const sql = new SQLite("./scores.sqlite");
const Enmap = require("enmap");

var client = new Discord.Client();




client.on("ready", () => {
  console.log("I'm ready to do work!");
 
});

client.slowmode_mentions = new Map();
client.slowmode_links = new Map();
client.slowmode_attachments = new Map();
client.ratelimit = 300000; // within 5 minutes
client.logChannel = "567380303207858177"; // logs channel id

client.on("message", async message => {
  if (message.author.bot || !message.guild) return;

  if (message.author.bot) return;
  
  // If this is not in a DM, execute the points code.

  //if (message.content.indexOf(config.prefix) !== 0) return;
  
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command === "ping") {
    const startTime = Date.now();
    message.channel.send("Ping...").then(newMessage => {
      const endTime = Date.now();
      newMessage.edit("Pong! Took `" + Math.round(endTime - startTime) + "ms`!");
    });
  }
  if (command === "daily") {
    var OneDay = new Date().getTime() + (1 * 24 * 60 * 60 * 1000);
										 //day hour  min  sec  msec
    const key = `${message.guild.id}-${message.author.id}`;
    var yourDate = client.money.get(key, "dailytime");
    if (dailymoney.has(message.author.id)) {
      message.channel.send("please try again after 24 hours");
    } else {
	   // the user can type the command ... your command code goes here :)
	   		const now = Date.now();
      const key = `${message.guild.id}-${message.author.id}`;
      const money = client.money.get(key, "cash");
      const change = randomIntFromInterval(1, 500);
      const gainage = money + change;
      message.reply(`You've gained ${change}`);
      client.money.set(key, gainage, "cash");
      client.money.set(key, now, "dailytime");
      // Adds the user to the set so that they can't talk for a minute
      dailymoney.add(message.author.id);
      setTimeout(() => {
	  // Removes the user from the set after a minute
	  dailymoney.delete(message.author.id);
      }, 86400000);
    }
  }
  if (command === "kick") {
	
  }
  if (command === "unmute") {



  }
  if (command === "purge") {
	
  }
  if (command === "warnings") {
    const user = message.mentions.users.first();

    const key = `${message.guild.id}-${user.id}`;		
    const warningcount = client.warnings.get(key, "warnings");
    console.log(warningcount);
    const logembed = new Discord.RichEmbed()
      .setTitle("Warnings")
      .setColor("#00ff00")
      .setDescription("user warning count")
      .addField("Number of Warnings", warningcount);
		
    message.channel.send(logembed).then(msg => msg.delete(2000)).catch(err => console.log(err));
		
  }
  if (command === "clearwarnings") {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have permission to do that!");
    const user = message.mentions.users.first();
    const key = `${message.guild.id}-${user.id}`;	
    client.warnings.set(key, 0, "warnings");
    return message.reply(`I've set ${user} warnings to **0** like you asked me to.... even though I think their still naughty.`);	
  }
  if (command === "warn") {
		
  }
  if (command === "mute") {
    //!mute @user 1s/m/h/d

  }

	
  if (command === "leaderboard") {

  }

  function log(logmessage) {
    if (message.guild.channels.has(logChannel)) {
      message.guild.channels.get(logChannel).send({ embed: logmessage}).then().catch(err => console.log(err));
    }
  }

  // set the max mentions/links/attachments that are allowed
  const banLevel = {
    "mentions": 5,
    "links": 10,
    "attachments": 10
  };

  // Ignore bots, DMs, Webhooks, if this bot has no perms, and Mods
  if (message.author.bot || !message.guild || !message.member || !message.guild.member(client.user).hasPermission("BAN_MEMBERS") || message.member.hasPermission("MANAGE_MESSAGES")) return;

  // Ignore if 1 mention and it's a bot (bot interaction)
  if (message.mentions.users.size == 1) return;
 
  // If there is no trace of the author in the slowmode map, add them.
  let entry_mentions = slowmode_mentions.get(message.author.id);
  let entry_links = slowmode_links.get(message.author.id);
  let entry_attachments = slowmode_attachments.get(message.author.id);
 

  if (!entry_mentions) {
    entry_mentions = 0;
    slowmode_mentions.set(message.author.id, entry_mentions);
  }
  if (!entry_links) {
    entry_links = 0;
    slowmode_links.set(message.author.id, entry_links);
  }
  if (!entry_attachments) {
    entry_attachments = 0;
    slowmode_attachments.set(message.author.id, entry_attachments);
  }

  // Count the unique user and roles mentions, links and attachments
  entry_mentions += message.mentions.users.size + message.mentions.roles.size;
  entry_links += message.embeds.length;
  entry_attachments += message.attachments.size;
  // Set all the amounts in the slowmode maps
  slowmode_mentions.set(message.author.id, entry_mentions);
  slowmode_links.set(message.author.id, entry_links);
  slowmode_attachments.set(message.author.id, entry_attachments);

  // If the total number of links in the last ratelimit is above the server ban level, ban user
  if (entry_links > banLevel.links) {
    message.member.ban(1).then(member => {
      message.channel.send(`:ok_hand: banned \`${message.author.tag}\` for \`link spam\``);
      log(new Discord.RichEmbed().setTitle(":hammer: Banned").setColor(0xFF0000).setTimestamp().addField("User", `${message.author.tag} (${message.author.id})`).addField("Reason", `Posting too many links (${entry_links}x)`));
      slowmode_links.delete(message.author.id);
    })
      .catch(e => {
        log(new Discord.RichEmbed().setTitle(":x: ERROR").setColor(0x000001).setTimestamp().addField("User", `${message.author.tag} (${message.author.id})`).addField("Reason", "Could not ban because they have a higher role"));
      });
  } else {
    setTimeout(()=> {
      entry_links -= message.embeds.length;
      if (entry_links <= 0) slowmode_links.delete(message.author.id);
    }, ratelimit);
  }

  if (entry_mentions > banLevel.mentions) {
    message.member.ban(1).then(member => {
      message.channel.send(`:ok_hand: banned \`${message.author.tag}\` for \`mention spam\``);
      log(new Discord.RichEmbed().setTitle(":hammer: Banned").setColor(0xFF0000).setTimestamp().addField("User", `${message.author.tag} (${message.author.id})`).addField("Reason", `Mentioning too many users (${entry_mentions}x)`));
      slowmode_mentions.delete(message.author.id);
    })
      .catch(e => {
        log(new Discord.RichEmbed().setTitle(":x: ERROR").setColor(0x000001).setTimestamp().addField("User", `${message.author.tag} (${message.author.id})`).addField("Reason", "Could not ban because they have a higher role"));
      });
  } else {
    setTimeout(()=> {
      entry_mentions -= message.mentions.users.size + message.mentions.roles.size;
      if (entry_mentions <= 0) slowmode_mentions.delete(message.author.id);
    }, ratelimit);
  }

  if (entry_attachments > banLevel.attachments) {
    message.member.ban(1).then(member => {
      message.channel.send(`:ok_hand: banned \`${message.author.tag}\` for \`image spam\``);
      log(new Discord.RichEmbed().setTitle(":hammer: Banned").setColor(0xFF0000).setTimestamp().addField("User", `${message.author.tag} (${message.author.id})`).addField("Reason", `Posting too many images (${entry_attachments}x)`));
      slowmode_attachments.delete(message.author.id);
    })
      .catch(e => {
        log(new Discord.RichEmbed().setTitle(":x: ERROR").setColor(0x000001).setTimestamp().addField("User", `${message.author.tag} (${message.author.id})`).addField("Reason", "Could not ban because they have a higher role"));
      });
  } else {
    setTimeout(()=> {
      entry_attachments -= message.attachments.size;
      if (entry_attachments <= 0) slowmode_attachments.delete(message.author.id);
    }, ratelimit);
  }

	

});

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
});
client.login(config.token);