var Discord = require("discord.js");
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (args[0] == "help") {
    const helpembxd = new Discord.RichEmbed()
      .setColor("#00ff00")
      .addField("purge Command", "Usage: hpurge <amount>");

    message.channel.send(helpembxd);
    return;
  } 

  message.delete();

  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have permission to do that!");
  if (!args[0]) return message.channel.send("Please enter a number of messages to clear! `Usage: hpurge <amount>`");
  message.channel.bulkDelete(args[0]).then(() => {
    message.channel.send(`**__Cleared ${args[0]} messages.__**`).then(msg => msg.delete(2000));
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "purge",
  category: "Moderation",
  description: "Purge x ammount of messages",
  usage: "purge #"
};
