const ms = require("ms");
/* eslint-disable linebreak-style */
var Discord = require("discord.js");
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  const tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!tomute) return message.channel.send("Please tag user to mute!");
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Sorry, you don't have permissions to use this!");
  if (tomute.hasPermission("MANAGE_MESSAGES")) return message.channel.send("I cant mute this user");
  if (tomute.id === message.author.id) return message.channel.send("You cannot mute yourself!");
  let muterole = message.guild.roles.find(r => r.name === "Hallow Mute");
  if (message.mentions.users.size < 1) return message.reply("You must mention someone to warn them.");
  if (!muterole) {
    try {
      muterole = await message.guild.createRole({
        name: "Hallow Mute",
        color: "#000000",
        permissions:[]
      });
      // eslint-disable-next-line no-unused-vars
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    } catch (e) {
      console.log(e.stack);
    }
  }
  const reason = args.slice(1).join(" ");
  
  if (message.mentions.users.size < 1) return message.reply("You must mention someone to warn them.");
  if (reason.length < 1) return message.reply("You must have a reason for the warning.");
  const mutetime = args[1];
  if (!mutetime) return message.channel.send("You didn't specify a time!");
  setTimeout(function() {
    tomute.removeRole(muterole.id);
    message.channel.send(`<@${tomute.id}> has been unmuted!`);
  }, ms(mutetime));
  const dmsEmbed = new Discord.RichEmbed()
    .setTitle("Muted")
    .setColor("#00ff00")
    .setDescription(`You have been muted on \`${message.guild.name}\``)
    .addField("Muted by", message.author.tag)
    .addField("Duration", mutetime)
    .addField("Reason", reason);
  
  tomute.send(dmsEmbed);
  const settings = client.getSettings(message.guild);
  const kick = new Discord.RichEmbed()
    .setColor("#00ff00")
    .setTitle(`User Muted | ${tomute.user.tag}`)
    .addField("User", tomute, true)
    .addField("Moderator", message.author, true)
    .addField("Reason For Mute", reason)
    .addField("Muted Time", mutetime)
    .setTimestamp()
    .setFooter(tomute.id); 
  message.guild.channels.find(c => c.name === settings.modLogChannel).send(kick).then().catch(err => console.log(err));
  await(tomute.addRole(muterole.id));
  message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "mute",
  category: "Moderation",
  description: "Mute a user.",
  usage: "mute @user 1h"
};
