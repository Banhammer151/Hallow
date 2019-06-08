exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  // Limited to guild owner - adjust to your own preference!
  if (message.author.id !== message.guild.ownerID) 
    return message.reply("You're not the boss of me, you can't do that!");

  // const user = message.mentions.users.first() || client.users.get(args[0]);
  // if (!user) return message.reply("You must mention someone or give their ID!");

  // const pointsToAdd = parseInt(args[1], 10);
  // if (!pointsToAdd) 
  //   return message.reply("You didn't tell me how many points to give...");

  // // Ensure there is a points entry for this user.
  // client.points.ensure(`${message.guild.id}-${user.id}`, {
  //   user: message.author.id,
  //   guild: message.guild.id,
  //   points: 0,
  //   level: 1
  // });

  // // Get their current points.
  // let userPoints = client.points.get(`${message.guild.id}-${user.id}`, "points");
  // userPoints += pointsToAdd;


  // // And we save it!
  // client.points.set(`${message.guild.id}-${user.id}`, userPoints, "points");

  // message.channel.send(`${user.tag} has received ${pointsToAdd} Experience and now stands at ${userPoints} Exp.`);
  var membersArray = message.guild.members.array();

for(var guildMemberId in membersArray) {
   console.log(guildMemberId, membersArray[guildMemberId].user.username);
}
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Server Owner"
};

exports.help = {
  name: "addexpeveryone",
  category: "Economy",
  description: "add exp to everyone",
  usage: "addexp #"
};
