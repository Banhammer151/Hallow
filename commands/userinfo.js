var Discord = require("discord.js");
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const inline = true;
  // eslint-disable-next-line no-unused-vars
  const resence = true;
  const status = {
    online: ":greenTick: Online",
    idle: ":yellow_heart:  Idle",
    dnd: ":octagonal_sign:  Do Not Disturb",
    offline: ":grey_question:  Offline/Invisible"
  };
    
  const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
  const target = message.mentions.users.first() || message.author;
  let bot;
  if (member.user.bot === true) {
    bot = ":robot:  Yes";
  } else {
    bot = ":boy:  No";
  }

  const embed = new Discord.RichEmbed()
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
    .setTimestamp();
  
  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "userinfo",
  category: "Miscelaneous",
  description: "Get info about user",
  usage: "userinfo @user"
};
