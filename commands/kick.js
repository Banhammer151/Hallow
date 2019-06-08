/* eslint-disable linebreak-style */
var Discord = require("discord.js");
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Sorry, you don't have permissions to use this!");
  const settings = client.getSettings(message.guild);
  const xdemb = new Discord.RichEmbed()
    .setColor("#00ff00")
    .setTitle("Kick Command")
    .addField("Description:", "Kick a member", true)
    .addField("Usage:", "hkick [user] [reason]", true)
    .addField("Example:" ,"hkick @user spam");
  
  const member = message.mentions.members.first();
  if (!member) return message.channel.send(xdemb);
        
  if (!member.kickable) 
    return message.channel.send("I cannot kick this user!");
  let res;
  const reason = args.slice(1).join(" ");
  if (!reason) {
    res = "No reason given";
  }
  else {
    res = `${reason}`;
  }
      
  await member.kick(reason)
    .catch(error => message.reply(`Sorry, I couldn't kick because of : ${error}`));
  
  const kick = new Discord.RichEmbed()
    .setColor("#00ff00")
    .setTitle(`Kick | ${member.user.tag}`)
    .addField("User", member, true)
    .addField("Moderator", message.author, true)
    .addField("Reason", res)
    .setTimestamp()
    .setFooter(member.id); 
  message.guild.channels.find(c => c.name === settings.modLogChannel).send(kick).then().catch(err => console.log(err));
  
};
    
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};
    
exports.help = {
  name: "kick",
  category: "Moderation",
  description: "Server Moderation Kick.",
  usage: "kick @user"
};
    