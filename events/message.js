// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, message) => {
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;
  const swearWords = ["pornhub", "xxvideos", "redtube", "privatepage", "porn"];
  if ( swearWords.some(word => message.content.includes(word)) ) {
    message.delete();
  // Or just do message.delete();
  }
  if (message.guild) {
    // We'll use the key often enough that simplifying it is worth the trouble.
    const key = `${message.guild.id}-${message.author.id}`;

    // Triggers on new users we haven't seen before.
    client.points.ensure(`${message.guild.id}-${message.author.id}`, {
      user: message.author.id,
      username: message.author.tag,
      guild: message.guild.id,
      points: 0,
      level: 1
    });
    client.warnings.ensure(`${message.guild.id}-${message.author.id}`, {
      user: message.author.id,
      guild: message.guild.id,
      warnings: 0,
      lastwarningtime: new Date()
    });
    client.points.inc(key, "points");
    client.money.ensure(`${message.guild.id}-${message.author.id}`,{
      user: message.author.id,
      guild: message.guild.id,
      cash: 0,
      dailytime: 0
    });
    // Calculate the user's current level
    const curLevel = Math.floor(0.1 * Math.sqrt(client.points.get(key, "points")));
    const level1 = message.guild.roles.find(r => r.name === "Spirit");
    const level5 = message.guild.roles.find(r => r.name === "Ghost");
    const level10 = message.guild.roles.find(r => r.name === "Wraith");
    const level20 = message.guild.roles.find(r => r.name === "Phantom");
    const level35 = message.guild.roles.find(r => r.name === "Revenant");
    const level50 = message.guild.roles.find(r => r.name === "Demon");
    const level70 = message.guild.roles.find(r => r.name === "Devil");
    const level100 = message.guild.roles.find(r => r.name === "Beast");
    // Act upon level up by sending a message and updating the user's level in enmap.
    if (curLevel === 1 || curLevel > 1 && !message.member.roles.has(level1.id)) {
      message.member.addRole(level1).catch(console.error);
    }
    if (curLevel === 5 || curLevel > 5 && !message.member.roles.has(level5.id)) {
      message.member.addRole(level5).catch(console.error);
    }
    if (curLevel === 10 || curLevel > 10 && !message.member.roles.has(level10.id)) {
      message.member.addRole(level10).catch(console.error);
    }
    if (curLevel === 20 || curLevel > 20 && !message.member.roles.has(level20.id)) {
      message.member.addRole(level20).catch(console.error);
    }
    if (curLevel === 35 || curLevel > 35 && !message.member.roles.has(level35.id)) {
      message.member.addRole(level35).catch(console.error);
    }
    if (curLevel === 50 || curLevel > 50 && !message.member.roles.has(level50.id)) {
      message.member.addRole(level50).catch(console.error);
    }
    if (curLevel === 70 || curLevel > 70 && !message.member.roles.has(level70.id)) {
      message.member.addRole(level70).catch(console.error);
    }
    if (curLevel === 100 || curLevel > 100 && !message.member.roles.has(level100.id)) {
      message.member.addRole(level100).catch(console.error);
    }

    if (client.points.get(key, "level") < curLevel) {
      message.reply(`You've leveled up to level **${curLevel}**!`);
      client.points.set(key, curLevel, "level");
    }
  }
  // Grab the settings for this server from Enmap.
  // If there is no guild, get default conf (DMs)
  const settings = message.settings = client.getSettings(message.guild);

  // Checks if the bot was mentioned, with no message after it, returns the prefix.
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {
    return message.reply(`My prefix on this guild is \`${settings.prefix}\``);
  }

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if (message.content.indexOf(settings.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // If the member on a guild is invisible or not cached, fetch them.
  if (message.guild && !message.member) await message.guild.fetchMember(message.author);

  // Get the user or member's permission level from the elevation
  const level = client.permlevel(message);

  // Check whether the command, or alias, exist in the collections defined
  // in app.js.
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  // using this const varName = thing OR otherthign; is a pretty efficient
  // and clean way to grab one of 2 values!
  if (!cmd) return;

  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === "true") {
      return message.channel.send(`You do not have permission to use this command.
  Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
  This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
    } else {
      return;
    }
  }

  // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
  // The "level" command module argument will be deprecated in the future.
  message.author.permLevel = level;
  
  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  // If the command exists, **AND** the user has permission, run it.
  client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
  cmd.run(client, message, args, level);
};
