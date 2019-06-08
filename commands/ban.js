/* eslint-disable linebreak-style */
var Discord = require("discord.js");
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const settings = client.getSettings(message.guild);
  const xdemb = new Discord.RichEmbed()
    .setColor("#00ff00")
    .setTitle("Ban Command")
    .addField("Description:", "Ban a member", true)
    .addField("Usage:", "hban [user] [reason]", true)
    .addField("Example:", "hban @user spam");

  if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Sorry you don't have permission to use this!");

  const member = message.mentions.members.first();
  if (!member) return message.channel.send(xdemb);
  if (!member.bannable) return message.channel.send("I can't ban this user!");
    

  if (member.id === message.author.id) return message.channel.send("You can't ban your self");

  const reason = args.slice(1).join(" ");
  let res;
  if (!reason) {
    res = "No reason given";
  } else {
    res = reason;
  }

  await member.ban(reason).catch(error => message.channel.send(`Sorry, I coldn't ban because of: ${error}`));

  const bean = new Discord.RichEmbed()
    .setColor("#00ff00")
    .setTitle(`Ban | ${member.user.tag}`)
    .addField("User", member, true)
    .addField("Moderator", message.author, true)
    .addField("Reason", res)
    .setTimestamp();

  message.guild.channels.find(c => c.name === settings.modLogChannel).send(bean).then().catch(err => console.log(err));

};
  
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};
  
exports.help = {
  name: "ban",
  category: "Moderation",
  description: "Server Moderation Ban.",
  usage: "ban"
};
  