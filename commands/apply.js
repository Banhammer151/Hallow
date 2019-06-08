/* eslint-disable linebreak-style */

var Discord = require("discord.js");
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (message.guild) {
    return message.reply("Please run this command via DM");
  }
  //const quiz = require("../applicationquestions.json");
  console.log(message.content.length);
  //const filter = m =>m.content.length > 1;
  //const collector = message.channel.createMessageCollector(filter, { time: 15000 });
  var question = 0;
  message.author.send("Name: (Discord Name&Tag)");
  const filter = m => m.content.length > 0 && m.author.id === message.author.id;
  const collector = message.channel.createMessageCollector(filter, { time: 3000000 });

  collector.on("collect", m => {
    console.log(`Collected ${m.content}`);
    question++;
    if (question == 1) return message.author.send("Age:");
    if (question == 2) return message.author.send("Mic: Y/N");
    if (question == 3) return message.author.send("Past Experience:");
    if (question == 4) return message.author.send("Time Zone:");
    if (question == 5) return message.author.send("1. Someone is posting said image/text in the wrong channel, what do you do?");
    if (question == 6) return message.author.send("2. Users begin arguing to one and other, how do you handle this?");
    if (question == 7) return message.author.send("3. Said user is spamming unkind words/profanity and will not stop, what do you do?");
    if (question == 8) return message.author.send("4. A user breaks more than one rule, how severe shall your punishment be?");
    if (question == 9) return message.author.send("5. A User(s) \"troll\" the server, by disrespecting, spamming, not following rules. What do you do?");
    //if (question == 10) message.author.send("**You require no more than 2 warns, and be Lvl. 5 Serious applications ONLY, trying to be funny or joke around will lead to a severe punishment.**");
    if (question == 10) {collector.stop();}

  });

  collector.on("end", collected => {
    var coll = collected.array();
    if (coll[0] === undefined) {
      return;
    } else {
      const logembed = new Discord.RichEmbed()
        .setTitle("New Applicationn")
        .setColor("#00ff00")
        .setDescription(`${message.author.tag} Has Submitted An Application`)
        .addField("Name: (Discord Name&Tag)", coll[0])
        .addField("Age:", coll[1])
        .addField("Mic: Y/N", coll[2])
        .addField("Past Experience:", coll[3])
        .addField("Time Zone:", coll[4])
        .addField("1. Someone is posting said image/text in the wrong channel, what do you do?", coll[5])
        .addField("2. Users begin arguing to one and other, how do you handle this?", coll[6])
        .addField("3. Said user is spamming unkind words/profanity and will not stop, what do you do?", coll[7])
        .addField("4. A user breaks more than one rule, how severe shall your punishment be?", coll[8])
        .addField("5. A User(s) \"troll\" the server, by disrespecting, spamming, not following rules. What do you do?", coll[9]);

      client.channels.get("571868151957159937").send(logembed);
    
      message.author.send(logembed);
    }
    console.log(`Collected ${collected.size} items`);
    
  });

};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};
  
exports.help = {
  name: "apply",
  category: "Miscelaneous",
  description: "Apply for staff",
  usage: "apply"
};
  