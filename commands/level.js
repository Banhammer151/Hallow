exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const key = `${message.guild.id}-${message.author.id}`;
  return message.channel.send(`You are level ${client.points.get(key, "level")}!`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "level",
  category: "Economy",
  description: "Check your level.",
  usage: "level"
};
