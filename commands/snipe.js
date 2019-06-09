/* eslint-disable linebreak-style */
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const msg = await message.channel.send("fetching last deleted message");
  const entry = await message.guild.fetchAuditLogs({type: "MESSAGE_DELETE"}).then(audit => audit.entries.first());
  let user = "";
  if (entry.extra.channel.id === message.channel.id
        && (entry.target.id === message.author.id)
        && (entry.createdTimestamp > (Date.now() - 5000))
        && (entry.extra.count >= 1)) {
    user = entry.executor.username;
  } else { 
    user = message.author.username;
  }
  msg.edit(` ${message.content}`);
  //msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
};
  
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};
  
exports.help = {
  name: "snipe",
  category: "Fun",
  description: "get the last deleted message",
  usage: "snipe"
};
  