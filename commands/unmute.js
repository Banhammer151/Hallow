/* eslint-disable linebreak-style */
var Discord = require("discord.js");
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You don't have the `Manage Messages` permissions");

  const toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if (!toMute) return message.channel.send("Please mention an user or ID to mute!");

  const role = message.guild.roles.find(r => r.name === "Hallow Mute");
  
  if (!role || !toMute.roles.has(role.id)) return message.channel.send("This user is not muted!");

  await toMute.removeRole(role);
  message.channel.send("The user has been unmuted!");
  const settings = client.getSettings(message.guild);
  const kick = new Discord.RichEmbed()
    .setColor("#00ff00")
    .setTitle(`User UnMuted | ${toMute.user.tag}`)
    .addField("User", toMute, true)
    .addField("Moderator", message.author, true)
    .setTimestamp()
    .setFooter(toMute.id); 
  message.guild.channels.find(c => c.name === settings.modLogChannel).send(kick).then().catch(err => console.log(err));
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "unmute",
  category: "Moderation",
  description: "unmute a user",
  usage: "unmute @user"
};
