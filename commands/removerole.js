module.exports.run = (client, message, args) => { 
  const roletoremove = args.slice(1).join(" ");
  const role = message.guild.roles.find(r => r.name === `${roletoremove}`);
  const member = message.mentions.members.first();
  if (!message.member.guild.me.hasPermission("MANAGE_ROLES")) {
    return message.reply("i don't have permisson to do that");
  } else if (!role) {
    return message.reply("I couldn't find a role by that name");
  } if (!member) {
    return message.reply("you need to mention someone first in order for me to find them");
  } else {
    member.removeRole(role).catch(console.error);
    return message.channel.send("success!");
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Administrator"
};

exports.help = {
  name: "removerole",
  category: "Moderation",
  description: "remove a role by name to a user",
  usage: "removerole @user role"
};
