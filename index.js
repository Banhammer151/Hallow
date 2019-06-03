var Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const config = require("./config.json");
const sql = new SQLite('./scores.sqlite');
const Enmap = require("enmap");
const ms = require("ms");
var client = new Discord.Client();
client.warnings = new Enmap({name: "warnings"});
client.points = new Enmap({name: "points"});
client.money = new Enmap({name: "money"});

client.on("ready", () => {
  console.log("I'm ready to do work!");
 
});
function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
const dailymoney = new Set();
const slowmode_mentions = new Map();
const slowmode_links = new Map();
const slowmode_attachments = new Map();
const ratelimit = 300000; // within 5 minutes
const logChannel = "567380303207858177"; // logs channel id

client.on("message", async message => {
	if (message.author.bot || !message.guild) return;
	const swearWords = ["pornhub", "xxvideos", "redtube", "privatepage", "porn"];
	if( swearWords.some(word => message.content.includes(word)) ) {
  	message.delete();
  // Or just do message.delete();
   }
   client.warnings.ensure(`${message.guild.id}-${message.author.id}`, {
	user: message.author.id,
	guild: message.guild.id,
	warnings: 0,
	lastwarningtime: new Date()
  });
  if (message.author.bot) return;
  
  // If this is not in a DM, execute the points code.
  if (message.guild) {
    // We'll use the key often enough that simplifying it is worth the trouble.
    const key = `${message.guild.id}-${message.author.id}`;

    // Triggers on new users we haven't seen before.
    client.points.ensure(`${message.guild.id}-${message.author.id}`, {
      user: message.author.id,
      guild: message.guild.id,
      points: 0,
      level: 1
    });
		client.warnings.ensure(`${message.guild.id}-${message.author.id}`, {
			user: message.author.id,
			guild: message.guild.id,
			warnings: 0,
			lastwarningtime: new Date()
			});
    client.points.inc(key, "points");
    client.money.ensure(`${message.guild.id}-${message.author.id}`,{
		user: message.author.id,
		guild: message.guild.id,
		cash: 0,
		dailytime: 0
	});
    // Calculate the user's current level
    const curLevel = Math.floor(0.1 * Math.sqrt(client.points.get(key, "points")));
    
    // Act upon level up by sending a message and updating the user's level in enmap.
    if (client.points.get(key, "level") < curLevel) {
      message.reply(`You've leveled up to level **${curLevel}**!`);
      client.points.set(key, curLevel, "level");
    }
  }
	//if (message.content.indexOf(config.prefix) !== 0) return;
  
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if (command === "ping") {
		let startTime = Date.now();
		message.channel.send("Ping...").then(newMessage => {
			let endTime = Date.now();
			newMessage.edit("Pong! Took `" + Math.round(endTime - startTime) + "ms`!");
		});
	}
	if (command === "daily"){
	var OneDay = new Date().getTime() + (1 * 24 * 60 * 60 * 1000)
										 //day hour  min  sec  msec
	const key = `${message.guild.id}-${message.author.id}`;
	var yourDate = client.money.get(key, "dailytime");
	if (dailymoney.has(message.author.id)) {
		message.channel.send("please try again after 24 hours");
	} else {
	   // the user can type the command ... your command code goes here :)
	   		let now = Date.now();
		const key = `${message.guild.id}-${message.author.id}`;
		let money = client.money.get(key, "cash");
		let change = randomIntFromInterval(1, 500);
		let gainage = money + change
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
	if(command === "kick"){
		if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Sorry, you don't have permissions to use this!");
    
  let xdemb = new Discord.RichEmbed()
  .setColor("#00ff00")
  .setTitle("Kick Command")
  .addField("Description:", `Kick a member`, true)
  .addField("Usage:", "hkick [user] [reason]", true)
  .addField("Example:" ,"hkick @user spam")

    let member = message.mentions.members.first();
    if(!member) return message.channel.send(xdemb)
      
    if(!member.kickable) 
      return message.channel.send("I cannot kick this user!");
    
    let reason = args.slice(1).join(' ');
    if(!reason) {
      res = "No reason given";
    }
    else {
      res = `${reason}`
    }
    
    await member.kick(reason)
      .catch(error => message.reply(`Sorry, I couldn't kick because of : ${error}`));

      let kick = new Discord.RichEmbed()
      .setColor("#00ff00")
      .setTitle(`Kick | ${member.user.tag}`)
      .addField("User", member, true)
      .addField("Moderator", message.author, true)
      .addField("Reason", res)
      .setTimestamp()
	  .setFooter(member.id);
	  message.guild.channels.get(logChannel).send(kick).then().catch(err => console.log(err));

	}
	if(command === "unmute"){
		if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You don't have the `Manage Messages` permissions")

        let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if(!toMute) return message.channel.send("Please mention an user or ID to mute!");

        let role = message.guild.roles.find(r => r.name === "Hallow Mute")
        
        if(!role || !toMute.roles.has(role.id)) return message.channel.send("This user is not muted!");

        await toMute.removeRole(role);
        message.channel.send("The user has been unmuted!");


	}
	if(command === "purge"){
		if(args[0] == "help"){
			let helpembxd = new Discord.RichEmbed()
			.setColor("#00ff00")
			.addField("purge Command", "Usage: hpurge <amount>")
	
			message.channel.send(helpembxd);
			return;
		} 
	
		message.delete()
	
		if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have permission to do that!");
		if(!args[0]) return message.channel.send("Please enter a number of messages to clear! `Usage: hpurge <amount>`");
		message.channel.bulkDelete(args[0]).then(() => {
		message.channel.send(`**__Cleared ${args[0]} messages.__**`).then(msg => msg.delete(2000));
	});
	}
	if(command === "warnings"){
		let user = message.mentions.users.first();

		const key = `${message.guild.id}-${user.id}`;		
		const warningcount = client.warnings.get(key, "warnings");
		console.log(warningcount);
		let logembed = new Discord.RichEmbed()
		.setTitle("Warnings")
		.setColor("#00ff00")
		.setDescription(`user warning count`)
		.addField("Number of Warnings", warningcount);
		
		message.channel.send(logembed).then(msg => msg.delete(2000)).catch(err => console.log(err));
		
	}
	if(command === "clearwarnings"){
		if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have permission to do that!");
		let user = message.mentions.users.first();
		const key = `${message.guild.id}-${user.id}`;	
		client.warnings.set(key, 0, "warnings");
		return message.reply(`I've set ${user} warnings to **0** like you asked me to.... even though I think their still naughty.`)	
	}
	if(command === "warn"){
		if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have premission to do that!");
		let reason = args.slice(1).join(' ');
		let user = message.mentions.users.first();
		if (message.mentions.users.size < 1) return message.reply('You must mention someone to warn them.');
		if (reason.length < 1) return message.reply('You must have a reason for the warning.');
	  
		let dmsEmbed = new Discord.RichEmbed()
		.setTitle("Warn")
		.setColor("#00ff00")
		.setDescription(`You have been warned on \`${message.guild.name}\``)
		.addField("Warned by", message.author.tag)
		.addField("Reason", reason);
	  
		user.send(dmsEmbed);
		let date = new Date();
		const key = `${message.guild.id}-${user.id}`;
		client.warnings.inc(key, "warnings");
		client.warnings.set(key, date, "lastwarningtime");
		const warningcount = client.warnings.get(key, "warnings");
		console.log(warningcount);
		let logembed = new Discord.RichEmbed()
		.setTitle("Warn")
		.setColor("#00ff00")
		.setDescription(`user has been warned on \`${message.guild.name}\``)
		.addField("Warned by", message.author.tag)
		.addField("Number of Warnings", warningcount)
		.addField("Reason", reason);
		message.guild.channels.get(logChannel).send(logembed).then().catch(err => console.log(err));
		return message.channel.send(`${user.tag} has been warned they now have ${warningcount} warnings`);

	  
	}
	if(command === "mute"){
		//!mute @user 1s/m/h/d

		let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		if(!tomute) return message.channel.send("Please tag user to mute!");
		if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Sorry, you don't have permissions to use this!");
		if(tomute.hasPermission("MANAGE_MESSAGES")) return message.channel.send("I cant mute this user");
		if (tomute.id === message.author.id) return message.channel.send("You cannot mute yourself!");
		let muterole = message.guild.roles.find(`name`, "Hallow Mute");
	  
		if(!muterole){
		  try{
			muterole = await message.guild.createRole({
			  name: "Hallow Mute",
			  color: "#000000",
			  permissions:[]
			})
			message.guild.channels.forEach(async (channel, id) => {
			  await channel.overwritePermissions(muterole, {
				SEND_MESSAGES: false,
				ADD_REACTIONS: false
			  });
			});
		  }catch(e){
			console.log(e.stack);
		  }
		}
		
       
		let mutetime = args[1];
		if(!mutetime) return message.channel.send("You didn't specify a time!");
	  
		await(tomute.addRole(muterole.id));
		message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);
	  
		setTimeout(function(){
		  tomute.removeRole(muterole.id);
		  message.channel.send(`<@${tomute.id}> has been unmuted!`);
		}, ms(mutetime));
	  
	 
	}
	if (command === "ban"){
		let xdemb = new Discord.RichEmbed()
        .setColor("#00ff00")
        .setTitle("Ban Command")
        .addField("Description:", `Ban a member`, true)
        .addField("Usage:", `hban [user] [reason]`, true)
        .addField("Example:", `hban @user spam`)

        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Sorry you don't have permission to use this!");

        let member = message.mentions.members.first();
        if(!member) return message.channel.send(xdemb)
        if(!member.bannable) return message.channel.send("I can't ban this user!")
        

        if(member.id === message.author.id) return message.channel.send("You can't ban your self")

        let reason = args.slice(1).join(" ");

        if(!reason) {
            res = "No reason given";
        } else {
            res = reason
        }

        await member.ban(reason).catch(error => message.channel.send(`Sorry, I coldn't ban because of: ${error}`));

        let bean = new Discord.RichEmbed()
        .setColor("#00ff00")
        .setTitle(`Ban | ${member.user.tag}`)
        .addField("User", member, true)
        .addField("Moderator", message.author, true)
        .addField("Reason", res)
        .setTimestamp()

        message.guild.channels.get(logChannel).send(bean).then().catch(err => console.log(err));

	}
	if(command === "serverinfo"){
		function checkDays(date) {
			let now = new Date();
			let diff = now.getTime() - date.getTime();
			let days = Math.floor(diff / 86400000);
			return days + (days == 1 ? " day" : " days") + " ago";
		};
		let verifLevels = ["None", "Low", "Medium", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
		let region = {
			"brazil": ":flag_br: Brazil",
			"eu-central": ":flag_eu: Central Europe",
			"singapore": ":flag_sg: Singapore",
			"us-central": ":flag_us: U.S. Central",
			"sydney": ":flag_au: Sydney",
			"us-east": ":flag_us: U.S. East",
			"us-south": ":flag_us: U.S. South",
			"us-west": ":flag_us: U.S. West",
			"eu-west": ":flag_eu: Western Europe",
			"vip-us-east": ":flag_us: VIP U.S. East",
			"london": ":flag_gb: London",
			"amsterdam": ":flag_nl: Amsterdam",
			"hongkong": ":flag_hk: Hong Kong",
			"russia": ":flag_ru: Russia",
			"southafrica": ":flag_za:  South Africa"
		};
		const embed = new Discord.RichEmbed()
			.setAuthor(message.guild.name, message.guild.iconURL)
			.addField("Name", message.guild.name, true)
			.addField("ID", message.guild.id, true)
			.addField("Owner", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
			.addField("Region", region[message.guild.region], true)
			.addField("Total | Humans | Bots", `${message.guild.members.size} | ${message.guild.members.filter(member => !member.user.bot).size} | ${message.guild.members.filter(member => member.user.bot).size}`, true)
			.addField("Verification Level", verifLevels[message.guild.verificationLevel], true)
			.addField("Channels", message.guild.channels.size, true)
			.addField("Roles", message.guild.roles.size, true)
			.addField("Creation Date", `${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`, true)
			.setThumbnail(message.guild.iconURL)
		return message.channel.send({embed});
	}
	if(command === "userinfo"){
		let inline = true
		let resence = true
		const status = {
			online: ":greenTick: Online",
			idle: ":yellow_heart:  Idle",
			dnd: ":octagonal_sign:  Do Not Disturb",
			offline: ":grey_question:  Offline/Invisible"
		  }
			
	const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
	let target = message.mentions.users.first() || message.author
	
	if (member.user.bot === true) {
		bot = ":robot:  Yes";
	  } else {
		bot = ":boy:  No";
	  }
	
				let embed = new Discord.RichEmbed()
					//.setAuthor(member.user.username)
					.setThumbnail((target.displayAvatarURL))
					.setColor("#00ff00")
					.addField("Full Username", `${member.user.tag}`, inline)
					.addField("ID", member.user.id, inline)
					.addField("Nickname", `${member.nickname !== null ? `<:yes:425632265993846795> Nickname: ${member.nickname}` : "<:no:425632070036094986> None"}`, true)
					.addField("Bot", `${bot}`,inline, true)
					.addField("Status", `${status[member.user.presence.status]}`, inline, true)
					.addField("Playing", `${member.user.presence.game ? `🎮 ${member.user.presence.game.name}` : "<:no:425632070036094986> Not playing"}`,inline, true)
					.addField("Roles", `${member.roles.filter(r => r.id !== message.guild.id).map(roles => `\`${roles.name}\``).join(" **|** ") || "<:no:425632070036094986> No Roles"}`, true)
					.addField("Joined Discord At", member.user.createdAt)
					.setFooter(`Information about ${member.user.username}`)
					.setTimestamp()
		
				message.channel.send(embed);
	
	}
  
	if(command === "points") {
		const key = `${message.guild.id}-${message.author.id}`;
		return message.channel.send(`You are level ${client.points.get(key, "level")}!`);
	  
	}
	
	// if(command === "give") {
	//   // Limited to guild owner - adjust to your own preference!
	//   if(!message.author.id === message.guild.owner) return message.reply("You're not the boss of me, you can't do that!");
	
	//   // Try to get the user from mention. If not found, get the ID given and get a user from that ID. 
	//   const user = message.mentions.users.first() || client.users.get(args[0]);
	//   if(!user) return message.reply("You must mention someone or give their ID!");
	
	//   // Read the amount of points to give to the user. 
	//   const pointsToAdd = parseInt(args[1], 10);
	//   if(!pointsToAdd) return message.reply("You didn't tell me how many points to give...");
	
	//   // Get their current points. This can't use `score` because it's not the same user ;)
	//   let userscore = client.getScore.get(user.id, message.guild.id);
	  
	//   // It's possible to give points to a user we haven't seen, so we need to initiate defaults here too!
	//   if (!userscore) {
	// 	userscore = { id: `${message.guild.id}-${user.id}`, user: user.id, guild: message.guild.id, points: 0, level: 1 };
	//   }
	  
	//   // Increment the score. 
	//   userscore.points += pointsToAdd;
	
	//   // We also want to update their level (but we won't notify them if it changes)
	//   let userLevel = Math.floor(0.1 * Math.sqrt(score.points));
	//   userscore.level = userLevel;
	
	//   // And we save it!
	//   client.setScore.run(userscore);
	
	//   return message.channel.send(`${user.tag} has received ${pointsToAdd} points and now stands at ${userscore.points} points.`);
	// }
	
	if(command === "leaderboard") {
	   // Get a filtered list (for this guild only), and convert to an array while we're at it.
	   const filtered = client.points.filter( p => p.guild === message.guild.id ).array();

	   // Sort it to get the top results... well... at the top. Y'know.
	   const sorted = filtered.sort((a, b) => b.points - a.points);
	 
	   // Slice it, dice it, get the top 10 of it!
	   const top10 = sorted.splice(0, 10);
	 
	   // Now shake it and show it! (as a nice embed, too!)
	   const embed = new Discord.RichEmbed()
		 .setTitle("Leaderboard")
		 .setAuthor(client.user.username, client.user.avatarURL)
		 .setDescription("Our top 10 points leaders!")
		 .setColor(0x00AE86);
	   for(const data of top10) {
		 embed.addField(client.users.get(data.user).tag, `${data.points} points (level ${data.level})`);
	   }
	   return message.channel.send({embed});
  }

	function log(logmessage) {
		if (message.guild.channels.has(logChannel)) {
			message.guild.channels.get(logChannel).send({ embed: logmessage}).then().catch(err => console.log(err));
		}
	}

	// set the max mentions/links/attachments that are allowed
	let banLevel = {
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
			log(new Discord.RichEmbed().setTitle(':hammer: Banned').setColor(0xFF0000).setTimestamp().addField('User', `${message.author.tag} (${message.author.id})`).addField('Reason', `Posting too many links (${entry_links}x)`));
			slowmode_links.delete(message.author.id);
		})
		.catch(e => {
			log(new Discord.RichEmbed().setTitle(':x: ERROR').setColor(0x000001).setTimestamp().addField('User', `${message.author.tag} (${message.author.id})`).addField('Reason', `Could not ban because they have a higher role`));
		});
	} else {
		setTimeout(()=> {
			entry_links -= message.embeds.length;
			if(entry_links <= 0) slowmode_links.delete(message.author.id);
		}, ratelimit);
	}

	if (entry_mentions > banLevel.mentions) {
		message.member.ban(1).then(member => {
			message.channel.send(`:ok_hand: banned \`${message.author.tag}\` for \`mention spam\``);
			log(new Discord.RichEmbed().setTitle(':hammer: Banned').setColor(0xFF0000).setTimestamp().addField('User', `${message.author.tag} (${message.author.id})`).addField('Reason', `Mentioning too many users (${entry_mentions}x)`));
			slowmode_mentions.delete(message.author.id);
		})
		.catch(e => {
			log(new Discord.RichEmbed().setTitle(':x: ERROR').setColor(0x000001).setTimestamp().addField('User', `${message.author.tag} (${message.author.id})`).addField('Reason', `Could not ban because they have a higher role`));
		});
	} else {
		setTimeout(()=> {
			entry_mentions -= message.mentions.users.size + message.mentions.roles.size;
			if(entry_mentions <= 0) slowmode_mentions.delete(message.author.id);
		}, ratelimit);
	}

	if (entry_attachments > banLevel.attachments) {
		message.member.ban(1).then(member => {
			message.channel.send(`:ok_hand: banned \`${message.author.tag}\` for \`image spam\``);
			log(new Discord.RichEmbed().setTitle(':hammer: Banned').setColor(0xFF0000).setTimestamp().addField('User', `${message.author.tag} (${message.author.id})`).addField('Reason', `Posting too many images (${entry_attachments}x)`));
			slowmode_attachments.delete(message.author.id);
		})
		.catch(e => {
			log(new Discord.RichEmbed().setTitle(':x: ERROR').setColor(0x000001).setTimestamp().addField('User', `${message.author.tag} (${message.author.id})`).addField('Reason', `Could not ban because they have a higher role`));
		});
	} else {
		setTimeout(()=> {
			entry_attachments -= message.attachments.size;
			if(entry_attachments <= 0) slowmode_attachments.delete(message.author.id);
		}, ratelimit);
	}

	

});

process.on("unhandledRejection", err => {
	console.error("Uncaught Promise Error: \n" + err.stack);
});
client.login(config.token);