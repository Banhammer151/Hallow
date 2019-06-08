exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  //var OneDay = new Date().getTime() + (1 * 24 * 60 * 60 * 1000);
  //day hour  min  sec  msec
  //const key = `${message.guild.id}-${message.author.id}`;
  //var yourDate = client.money.get(key, "dailytime");
  if (client.dailymoney.has(message.author.id)) {
    message.channel.send("please try again after 24 hours");
  } else {
    // the user can type the command ... your command code goes here :)
    const now = Date.now();
    const key = `${message.guild.id}-${message.author.id}`;
    const money = client.money.get(key, "cash");
    const change = randomIntFromInterval(1, 500);
    const gainage = money + change;
    message.reply(`You've gained ${change}`);
    client.money.set(key, gainage, "cash");
    client.money.set(key, now, "dailytime");
    // Adds the user to the set so that they can't talk for a minute
    client.dailymoney.add(message.author.id);
    setTimeout(() => {
      // Removes the user from the set after a minute
      client.dailymoney.delete(message.author.id);
    }, 86400000);
  }
  function randomIntFromInterval(min,max) // min and max included
  {
    return Math.floor(Math.random()*(max-min+1)+min);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "daily",
  category: "Miscelaneous",
  description: "It like... Pings. Then Pongs. And it's not Ping Pong.",
  usage: "daily"
};
