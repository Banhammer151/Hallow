exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  // Limited to guild owner - adjust to your own preference!
  if (message.author.id !== message.guild.ownerID) 
    return message.reply("You're not the boss of me, you can't do that!");

  //const user = message.mentions.users.first() || client.users.get(args[0]);
  //if (!user) return message.reply("You must mention someone or give their ID!");

  const pointsToAdd = parseInt(args[0], 10);
  if (!pointsToAdd) 
    return message.reply("You didn't tell me how many points to give...");
  var membersArray = message.guild.members.array();
  for (var guildMemberId in membersArray) {
    console.log(guildMemberId, membersArray[guildMemberId].user.id);
    client.points.ensure(`${message.guild.id}-${membersArray[guildMemberId].user.id}`, {
      user: membersArray[guildMemberId].user.id,
      guild: message.guild.id,
      points: 0,
      level: 1
    });
    let userPoints = client.points.get(`${message.guild.id}-${membersArray[guildMemberId].user.id}`, "points");
    userPoints += pointsToAdd;
    client.points.set(`${message.guild.id}-${membersArray[guildMemberId].user.id}`, userPoints, "points");
  }
  // Ensure there is a points entry for this user.
  

  // Get their current points.
 


  // And we save it!
 

  message.channel.send(`Yay! everyone got ${pointsToAdd} Souls!`);
  


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
