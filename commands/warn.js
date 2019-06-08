/* eslint-disable linebreak-style */
var Discord = require("discord.js");
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const settings = client.getSettings(message.guild);
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have premission to do that!");
  const reason = args.slice(1).join(" ");
  const user = message.mentions.users.first();
  if (message.mentions.users.size < 1) return message.reply("You must mention someone to warn them.");
  if (reason.length < 1) return message.reply("You must have a reason for the warning.");
  
  const dmsEmbed = new Discord.RichEmbed()
    .setTitle("Warn")
    .setColor("#00ff00")
    .setDescription(`You have been warned on \`${message.guild.name}\``)
    .addField("Warned by", message.author.tag)
    .addField("Reason", reason);
  
  user.send(dmsEmbed);
  const date = new Date();
  const key = `${message.guild.id}-${user.id}`;
  client.warnings.inc(key, "warnings");
  client.warnings.set(key, date, "lastwarningtime");
  const warningcount = client.warnings.get(key, "warnings");
  console.log(warningcount);
  const logembed = new Discord.RichEmbed()
    .setTitle("Warn")
    .setColor("#00ff00")
    .setDescription(`${user.tag} has been warned on \`${message.guild.name}\``)
    .addField("Warned by", message.author.tag)
    .addField("Number of Warnings", warningcount)
    .addField("Reason", reason);
  message.guild.channels.find(c => c.name === settings.modLogChannel).send(logembed).then().catch(err => console.log(err));

  return message.channel.send(`${user.tag} has been warned they now have ${warningcount} warnings`);

  
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "warn",
  category: "Moderation",
  description: "Warn a user.",
  usage: "warn @user [reason]"
};
