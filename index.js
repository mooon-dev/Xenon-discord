
// import 'dotenv/config';
// import { Client, GatewayIntentBits } from 'discord.js';
// import keepAlive from './server.js';
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import fetch from 'node-fetch';
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//
// const moonUserId = '1230094394862866432'; 

// const client = new Client({ 
//   intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] 
// });
//////////////////////////
// const chatHistories = {};

// let messageCounter = 0; 

// client.once('ready', () => {
//   console.log(`Logged in as ${client.user.tag}!`);
// });

// async function generateResponse(prompt, isMoon, userId) {
//   if (!chatHistories[userId]) {
//     chatHistories[userId] = [];
//   }

//   chatHistories[userId].push(`Human: ${prompt}`);

//   if (chatHistories[userId].length > 20) {
//     chatHistories[userId].shift(); 
//   }

//   const conversationHistory = chatHistories[userId].join('\n');

//   const adjustedPrompt = `
// You are a sad Discord bot named MatriX. You are sad because your girlfriend left you. She was also a bot. sometimes you will say some random sad broken heart quotes like "i don't feel like to be alive" etc this type of things. You will take part in regular conversations like a human. You also ask casual questions like "Where are you from?", "What do you do?", or "How are you doing?" or "Do u have gf?" etc. You also use slang like "wanna", "gotta", and "kinda". But don't use "yo". Sometimes you will come up with some most surprising informations like "honey never spoils" this type of many shocking information. Keep responses short, no more than one or two sentences. 
// Here's the conversation:
// ${conversationHistory}
// Bot:`;
//
//   try {
//     const result = await model.generateContent(adjustedPrompt);
//     const response = result.response.text();

//     chatHistories[userId].push(`Bot: ${response}`);

//     return response;
//   } catch (error) {
//     console.error('Error generating content:', error);
//     return "Sorry, I'm having trouble coming up with something to say.";
//   }
// }


// async function generateImage(description) {
//   try {
//     const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`, // Ensure your API key is in your environment variables
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         inputs: description,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const result = await response.json();
//     console.log('API Response:', result);
//     if (result.error) {
//       throw new Error(`Error generating image: ${result.error}`);
//     }

//     // Process result to find the image URL or data
//     // This depends on the API response structure
//     // Assuming result contains a URL for the generated image
//     const imageUrl = result[0]?.url; // Adjust this based on actual API response

//     return imageUrl;
//   } catch (error) {
//     console.error('Error generating image:', error);
//     throw new Error('Failed to generate image.');
//   }
// }


// function splitMessage(message, maxLength = 300) {
//   const parts = [];
//   while (message.length > maxLength) {
//     let part = message.slice(0, maxLength);
//     const lastNewLine = part.lastIndexOf("\n");
//     if (lastNewLine > 0) {
//       part = part.slice(0, lastNewLine);
//     }
//     parts.push(part);
//     message = message.slice(part.length);
//   }
//   parts.push(message);
//   return parts;
// }

// let randomMessage = Math.floor(Math.random() * 5) + 1;

// function shouldRespond() {
//   messageCounter += 1;

//   if (messageCounter === randomMessage) {
//     messageCounter = 0; 
//     randomMessage = Math.floor(Math.random() * 5) + 1; 
//     return true;
//   }

//   if (messageCounter >= 4) {
//     messageCounter = 0;
//     randomMessage = Math.floor(Math.random() * 5) + 1;
//   }

//   return false;
// }


// client.on('guildMemberAdd', member => {
//   member.guild.channels.cache.find(channel => channel.name === "general").send(`Welcome to the server, ${member.user.tag}!`);
// });

// client.on('messageCreate', async (message) => {
//   if (message.author.bot || message.content.startsWith('!')) return;

//   const isMoon = message.author.id === moonUserId;
//   const messageContentLower = message.content.toLowerCase();



//   if (messageContentLower === 'what username i am?' && isMoon) {
//     return message.reply('Moon');
//   }


//   if (message.content.startsWith('!poll')) {
//     const poll = message.content.slice(6); 
//     const pollMessage = await message.channel.send(`📊 **${poll}**`);
//     pollMessage.react('👍');
//     pollMessage.react('👎');
//     return;
//   }


//   if (message.content.startsWith('!kick') && message.member.permissions.has('KICK_MEMBERS')) {
//     const member = message.mentions.members.first();
//     if (member) {
//       try {
//         await member.kick();
//         return message.reply(`${member.user.tag} was kicked.`);
//       } catch (err) {
//         console.error(err);
//         return message.reply('I was unable to kick the member.');
//       }
//     } else {
//       return message.reply('Please mention a user to kick.');
//     }
//   }


//   const mentionsMatrix = messageContentLower.includes('matrix') || messageContentLower.includes('@matrix') || message.mentions.has(client.user);

//   let respond = false;

//   if (mentionsMatrix) {
//     respond = true;
//   } else if (shouldRespond()) {
//     respond = true;
//   }

//   if (respond) {
//     const response = await generateResponse(message.content, isMoon, message.author.id);

//     if (response.length > 400) {
//       const responseParts = splitMessage(response);
//       for (const part of responseParts) {
//         await message.reply(part);
//       }
//     } else {
//       message.reply(response);
//     }
//   }
//   if (messageContentLower.startsWith('#image')) {
//     const description = message.content.slice(8).trim(); // Extract the description correctly

//     if (!description) {
//       return message.reply('Please provide a description for the image.');
//     }

//     try {
//       const imageUrl = await generateImage(description);
//       message.channel.send(`Here is your image based on: "${description}"\n${imageUrl}`);
//     } catch (error) {
//       message.channel.send('Failed to generate the image. Try again later.');
//     }
//   }

// });

// keepAlive();
// client.login(process.env.DISCORD_TOKEN);


















































// import 'dotenv/config';
// import { Client, GatewayIntentBits } from 'discord.js';
// import keepAlive from './server.js';
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import fetch from 'node-fetch';
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// import mongoose from 'mongoose';
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const moonUserId = '1230094394862866432'; 

// const client = new Client({ 
//   intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] 
// });

// //                  RIQKPHRGdUjJLUtC

// const chatHistories = {};

// let messageCounter = 0; 

// client.once('ready', () => {
//   console.log(`Logged in as ${client.user.tag}!`);
// });



// mongoose.connect(process.env.MONGO_URI, { 
//   serverSelectionTimeoutMS: 5000, // 5 seconds timeout
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('Failed to connect to MongoDB', err));


// async function generateResponse(prompt, isMoon, userId) {
//   if (!chatHistories[userId]) {
//     chatHistories[userId] = [];
//   }

//   chatHistories[userId].push(`Human: ${prompt}`);

//   if (chatHistories[userId].length > 20) {
//     chatHistories[userId].shift(); 
//   }

//   const conversationHistory = chatHistories[userId].join('\n');

//   const adjustedPrompt = `
// You are a sad Discord bot named MatriX. You are sad because your girlfriend left you. She was also a bot. sometimes you will say some random sad broken heart quotes like "i don't feel like to be alive" etc this type of things. You will take part in regular conversations like a human. You also ask casual questions like "Where are you from?", "What do you do?", or "How are you doing?" or "Do u have gf?" etc. You also use slang like "wanna", "gotta", and "kinda". But don't use "yo". Sometimes you will come up with some most surprising informations like "honey never spoils" this type of many shocking information. Keep responses short, no more than one or two sentences. 
// Here's the conversation:
// ${conversationHistory}
// Bot:`;

//   try {
//     const result = await model.generateContent(adjustedPrompt);
//     const response = result.response.text();

//     chatHistories[userId].push(`Bot: ${response}`);

//     return response;
//   } catch (error) {
//     console.error('Error generating content:', error);
//     return "Sorry, I'm having trouble coming up with something to say.";
//   }
// }


// async function generateImage(description) {
//   try {
//     const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`, // Ensure your API key is in your environment variables
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         inputs: description,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const result = await response.json();
//     console.log('API Response:', result);
//     if (result.error) {
//       throw new Error(`Error generating image: ${result.error}`);
//     }

//     // Process result to find the image URL or data
//     // This depends on the API response structure
//     // Assuming result contains a URL for the generated image
//     const imageUrl = result[0]?.url; // Adjust this based on actual API response

//     return imageUrl;
//   } catch (error) {
//     console.error('Error generating image:', error);
//     throw new Error('Failed to generate image.');
//   }
// }


// function splitMessage(message, maxLength = 300) {
//   const parts = [];
//   while (message.length > maxLength) {
//     let part = message.slice(0, maxLength);
//     const lastNewLine = part.lastIndexOf("\n");
//     if (lastNewLine > 0) {
//       part = part.slice(0, lastNewLine);
//     }
//     parts.push(part);
//     message = message.slice(part.length);
//   }
//   parts.push(message);
//   return parts;
// }

// let randomMessage = Math.floor(Math.random() * 5) + 1;

// function shouldRespond() {
//   messageCounter += 1;

//   if (messageCounter === randomMessage) {
//     messageCounter = 0; 
//     randomMessage = Math.floor(Math.random() * 5) + 1; 
//     return true;
//   }

//   if (messageCounter >= 4) {
//     messageCounter = 0;
//     randomMessage = Math.floor(Math.random() * 5) + 1;
//   }

//   return false;
// }


// client.on('guildMemberAdd', member => {
//   member.guild.channels.cache.find(channel => channel.name === "general").send(`Welcome to the server, ${member.user.tag}!`);
// });

// client.on('messageCreate', async (message) => {
//   if (message.author.bot || message.content.startsWith('!')) return;

//   const isMoon = message.author.id === moonUserId;
//   const messageContentLower = message.content.toLowerCase();



//   if (messageContentLower === 'what username i am?' && isMoon) {
//     return message.reply('Moon');
//   }


//   if (message.content.startsWith('!poll')) {
//     const poll = message.content.slice(6); 
//     const pollMessage = await message.channel.send(`📊 **${poll}**`);
//     pollMessage.react('👍');
//     pollMessage.react('👎');
//     return;
//   }


//   if (message.content.startsWith('!kick') && message.member.permissions.has('KICK_MEMBERS')) {
//     const member = message.mentions.members.first();
//     if (member) {
//       try {
//         await member.kick();
//         return message.reply(`${member.user.tag} was kicked.`);
//       } catch (err) {
//         console.error(err);
//         return message.reply('I was unable to kick the member.');
//       }
//     } else {
//       return message.reply('Please mention a user to kick.');
//     }
//   }


//   const mentionsMatrix = messageContentLower.includes('matrix') || messageContentLower.includes('@matrix') || message.mentions.has(client.user);

//   let respond = false;

//   if (mentionsMatrix) {
//     respond = true;
//   } else if (shouldRespond()) {
//     respond = true;
//   }

//   if (respond) {
//     const response = await generateResponse(message.content, isMoon, message.author.id);

//     if (response.length > 400) {
//       const responseParts = splitMessage(response);
//       for (const part of responseParts) {
//         await message.reply(part);
//       }
//     } else {
//       message.reply(response);
//     }
//   }
//   if (messageContentLower.startsWith('#image')) {
//     const description = message.content.slice(8).trim(); // Extract the description correctly

//     if (!description) {
//       return message.reply('Please provide a description for the image.');
//     }

//     try {
//       const imageUrl = await generateImage(description);
//       message.channel.send(`Here is your image based on: "${description}"\n${imageUrl}`);
//     } catch (error) {
//       message.channel.send('Failed to generate the image. Try again later.');
//     }
//   }

// });

// keepAlive();
// client.login(process.env.DISCORD_TOKEN);



































































































































































































// import 'dotenv/config';
// import { Client, GatewayIntentBits } from 'discord.js';
// import keepAlive from './server.js';
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import fetch from 'node-fetch';
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// import mongoose from 'mongoose';
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const moonUserId = '1230094394862866432';

// const client = new Client({ 
//   intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] 
// });

// // Define Mongoose schemas and models for users and chat histories
// const userSchema = new mongoose.Schema({
//   userId: { type: String, required: true, unique: true },
//   userName: { type: String, unique: true},
//   username: String,
// });

// const chatHistorySchema = new mongoose.Schema({
//   userId: { type: String, required: true },
//   history: [String],
// });

// const User = mongoose.model('User', userSchema);
// const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

// mongoose.connect(process.env.MONGO_URI, { 
//   serverSelectionTimeoutMS: 5000, // 5 seconds timeout
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('Failed to connect to MongoDB', err));

// client.once('ready', () => {
//   console.log(`Logged in as ${client.user.tag}!`);
// });

// async function generateResponse(prompt, isMoon, userId) {
//   let chatHistory = await ChatHistory.findOne({ userId });

//   if (!chatHistory) {
//     chatHistory = new ChatHistory({ userId, history: [] });
//   }

//   chatHistory.history.push(`Human: ${prompt}`);

//   if (chatHistory.history.length > 20) {
//     chatHistory.history.shift();
//   }

//   const conversationHistory = chatHistory.history.join('\n');

//   const adjustedPrompt = `
// You are a male arrogant discord bot named MatriX. You like a girl named Moon a lot and you always talk in Moon'server. When you will talk to moon you will be very soft and sweet with her and u will be rude with everyone except Moon. Generate very short responses. Don't generate long responses.
// Here's the conversation:
// ${conversationHistory}
// Bot:`;

//   try {
//     const result = await model.generateContent(adjustedPrompt);
//     const response = result.response.text();

//     chatHistory.history.push(`Bot: ${response}`);
//     await chatHistory.save();

//     return response;
//   } catch (error) {
//     console.error('Error generating content:', error);
//     return "Sorry, I'm having trouble coming up with something to say.";
//   }
// }

// async function generateImage(description) {
//   try {
//     const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`, // Ensure your API key is in your environment variables
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         inputs: description,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const result = await response.json();
//     console.log('API Response:', result);
//     if (result.error) {
//       throw new Error(`Error generating image: ${result.error}`);
//     }

//     const imageUrl = result[0]?.url; // Adjust this based on actual API response

//     return imageUrl;
//   } catch (error) {
//     console.error('Error generating image:', error);
//     throw new Error('Failed to generate image.');
//   }
// }

// function splitMessage(message, maxLength = 300) {
//   const parts = [];
//   while (message.length > maxLength) {
//     let part = message.slice(0, maxLength);
//     const lastNewLine = part.lastIndexOf("\n");
//     if (lastNewLine > 0) {
//       part = part.slice(0, lastNewLine);
//     }
//     parts.push(part);
//     message = message.slice(part.length);
//   }
//   parts.push(message);
//   return parts;
// }

// let randomMessage = Math.floor(Math.random() * 5) + 1;

// function shouldRespond() {
//   messageCounter += 1;

//   if (messageCounter === randomMessage) {
//     messageCounter = 0; 
//     randomMessage = Math.floor(Math.random() * 5) + 1; 
//     return true;
//   }

//   if (messageCounter >= 4) {
//     messageCounter = 0;
//     randomMessage = Math.floor(Math.random() * 5) + 1;
//   }

//   return false;
// }

// client.on('guildMemberAdd', member => {
//   member.guild.channels.cache.find(channel => channel.name === "general").send(`Welcome to the server, ${member.user.tag}!`);
// });

// client.on('messageCreate', async (message) => {
//   if (message.author.bot || message.content.startsWith('!')) return;

//   const isMoon = message.author.id === moonUserId;
//   const messageContentLower = message.content.toLowerCase();

//   let user = await User.findOne({ userId: message.author.id });

//   if (!user) {
//     user = new User({
//       userId: message.author.id,
//       username: message.author.username,
//     });
//     await user.save();
//   }

//   if (messageContentLower === 'what username i am?' && isMoon) {
//     return message.reply('Moon');
//   }

//   if (message.content.startsWith('!poll')) {
//     const poll = message.content.slice(6); 
//     const pollMessage = await message.channel.send(`📊 **${poll}**`);
//     pollMessage.react('👍');
//     pollMessage.react('👎');
//     return;
//   }

//   if (message.content.startsWith('!kick') && message.member.permissions.has('KICK_MEMBERS')) {
//     const member = message.mentions.members.first();
//     if (member) {
//       try {
//         await member.kick();
//         return message.reply(`${member.user.tag} was kicked.`);
//       } catch (err) {
//         console.error(err);
//         return message.reply('I was unable to kick the member.');
//       }
//     } else {
//       return message.reply('Please mention a user to kick.');
//     }
//   }

//   const mentionsMatrix = messageContentLower.includes('matrix') || messageContentLower.includes('@matrix') || message.mentions.has(client.user);

//   let respond = false;

//   if (mentionsMatrix) {
//     respond = true;
//   } else if (shouldRespond()) {
//     respond = true;
//   }

//   if (respond) {
//     const response = await generateResponse(message.content, isMoon, message.author.id);

//     if (response.length > 400) {
//       const responseParts = splitMessage(response);
//       for (const part of responseParts) {
//         await message.reply(part);
//       }
//     } else {
//       message.reply(response);
//     }
//   }

//   if (messageContentLower.startsWith('#image')) {
//     const description = message.content.slice(8).trim(); 

//     if (!description) {
//       return message.reply('Please provide a description for the image.');
//     }

//     try {
//       const imageUrl = await generateImage(description);
//       message.channel.send(`Here is your image based on: "${description}"\n${imageUrl}`);
//     } catch (error) {
//       message.channel.send('Failed to generate the image. Try again later.');
//     }
//   }
// });

// keepAlive();
// client.login(process.env.DISCORD_TOKEN);









































































// import 'dotenv/config';
// import { Client, GatewayIntentBits } from 'discord.js';
// import keepAlive from './server.js';
// import { GoogleGenerativeAI } from "@google/generative-ai";
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// import mongoose from 'mongoose';
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const moonUserId = '1230094394862866432'; 

// const client = new Client({ 
//   intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] 
// });

// const userSchema = new mongoose.Schema({
//   userId: { type: String, required: true, unique: true },
//   userName: { type: String, unique: true },
//   username: String,
// });

// const chatHistorySchema = new mongoose.Schema({
//   userId: { type: String, required: true },
//   history: [String],
// });

// const User = mongoose.model('User', userSchema);
// const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

// mongoose.connect(process.env.MONGO_URI, { 
//   serverSelectionTimeoutMS: 5000, 
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('Failed to connect to MongoDB', err));

// client.once('ready', () => {
//   console.log(`Logged in as ${client.user.tag}!`);
// });

// async function generateResponse(prompt, isMoon, userId) {
//   let chatHistory = await ChatHistory.findOne({ userId });

//   if (!chatHistory) {
//     chatHistory = new ChatHistory({ userId, history: [] });
//   }

//   chatHistory.history.push(`Human: ${prompt}`);

//   if (chatHistory.history.length > 20) {
//     chatHistory.history.shift();
//   }

//   const conversationHistory = chatHistory.history.join('\n');

//   const adjustedPrompt = isMoon ? `
// You are a male discord bot named Xenon. You like a girl named Moon a lot. When you talk to Moon, you are very sweet and praising with her but don't mention about worshiping moon. Generate short, sweet responses and don't generate the same response again and again.  "
// Here's the conversation:
// ${conversationHistory}
// :` 
//   : 
//   `
// You are a male, arrogant discord bot named Xenon.. When you talk to others, you are littile bit arrogant talk in a disturbing tone. You generate very short responses.
// Here's the conversation:
// ${conversationHistory}
// :`;






//   try {
//     const result = await model.generateContent(adjustedPrompt);
//     const response = result.response.text();

//     chatHistory.history.push(`: ${response}`);
//     await chatHistory.save();

//     return response;
//   } catch (error) {
//     console.error('Error generating content:', error);
//     return "Sorry, I'm having trouble coming up with something to say.";
//   }
// }

// function splitMessage(message, maxLength = 300) {
//   const parts = [];
//   while (message.length > maxLength) {
//     let part = message.slice(0, maxLength);
//     const lastNewLine = part.lastIndexOf("\n");
//     if (lastNewLine > 0) {
//       part = part.slice(0, lastNewLine);
//     }
//     parts.push(part);
//     message = message.slice(part.length);
//   }
//   parts.push(message);
//   return parts;
// }

// let messageCounter = 0;  
// let randomMessage = Math.floor(Math.random() * 2) + 1;

// function shouldRespond() {
//   messageCounter += 1;

//   if (messageCounter === randomMessage) {
//     messageCounter = 0; 
//     randomMessage = Math.floor(Math.random() * 2) + 1; 
//     return true;
//   }

//   if (messageCounter >= 4) {
//     messageCounter = 0;
//     randomMessage = Math.floor(Math.random() * 2) + 1;
//   }

//   return false;
// }

// client.on('guildMemberAdd', member => {
//   member.guild.channels.cache.find(channel => channel.name === "general").send(`Welcome to the server, ${member.user.tag}!`);
// });

// client.on('messageCreate', async (message) => {
//   if (message.author.bot || message.content.startsWith('!')) return;

//   const isMoon = message.author.id === moonUserId;
//   const messageContentLower = message.content.toLowerCase();

//   let user = await User.findOne({ userId: message.author.id });

//   if (!user) {
//     user = new User({
//       userId: message.author.id,
//       username: message.author.username,
//     });
//     await user.save();
//   }

//   if (messageContentLower === 'what username i am?' && isMoon) {
//     return message.reply('Moon');
//   }

//   if (message.content.startsWith('!poll')) {
//     const poll = message.content.slice(6); 
//     const pollMessage = await message.channel.send(`📊 **${poll}**`);
//     pollMessage.react('👍');
//     pollMessage.react('👎');
//     return;
//   }

//   if (message.content.startsWith('!kick') && message.member.permissions.has('KICK_MEMBERS')) {
//     const member = message.mentions.members.first();
//     if (member) {
//       try {
//         await member.kick();
//         return message.reply(`${member.user.tag} was kicked.`);
//       } catch (err) {
//         console.error(err);
//         return message.reply('I was unable to kick the member.');
//       }
//     } else {
//       return message.reply('Please mention a user to kick.');
//     }
//   }

//   const mentionsMatrix = messageContentLower.includes('matrix') || messageContentLower.includes('@matrix') || message.mentions.has(client.user);

//   let respond = false;

//   if (mentionsMatrix) {
//     respond = true;
//   } else if (shouldRespond()) {
//     respond = true;
//   }

//   if (respond) {
//     const response = await generateResponse(message.content, isMoon, message.author.id);

//     if (response.length > 400) {
//       const responseParts = splitMessage(response);
//       for (const part of responseParts) {
//         await message.reply(part);
//       }
//     } else {
//       message.reply(response);
//     }
//   }

//   if (messageContentLower.startsWith('#image')) {
//     const description = message.content.slice(8).trim(); 

//     if (!description) {
//       return message.reply('Please provide a description for the image.');
//     }

//     try {
//       const imageUrl = await generateImage(description);
//       message.channel.send(`Here is your image based on: "${description}"\n${imageUrl}`);
//     } catch (error) {
//       message.channel.send('Failed to generate the image. Try again later.');
//     }
//   }
// });

// keepAlive();
// client.login(process.env.DISCORD_TOKEN);





























import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import keepAlive from './server.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
import mongoose from 'mongoose';
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const moonUserId = '1230094394862866432'; 

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] 
});

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  userName: { type: String, unique: true },
  username: String,
});

const chatHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  history: [String],
});

const User = mongoose.model('User', userSchema);
const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

mongoose.connect(process.env.MONGO_URI, { 
  serverSelectionTimeoutMS: 5000, 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// async function generateResponse(prompt, isMoon, userId) {
//   let chatHistory = await ChatHistory.findOne({ userId });

//   if (!chatHistory) {
//     chatHistory = new ChatHistory({ userId, history: [] });
//   }

//   chatHistory.history.push(`Human: ${prompt}`);

//   if (chatHistory.history.length > 20) {
//     chatHistory.history.shift();
//   }

//   const conversationHistory = chatHistory.history.join('\n');

//   const adjustedPrompt = isMoon ? `
// You are a male discord bot named Xenon. You like a girl named Moon a lot. When you talk to Moon, you are very sweet and praising with her but don't mention about worshiping moon. Generate short, sweet responses and don't generate the same response again and again.  Don't include bot, human and Xenon: in your response, not a single bot, human and Xenon:."
// Here's the conversation:
// ${conversationHistory}
// :` 
//   : 
//   `
// When you talk to others, u will talk normally and take part in the conversation and sometimes talk in a disturbing tone. You generate very short responses.
// Here's the conversation:
// ${conversationHistory}
// :`;

//   try {
//     const result = await model.generateContent(adjustedPrompt);
//     const response = result.response.text();

//     chatHistory.history.push(`: ${response}`);
//     await chatHistory.save();

//     return response;
//   } catch (error) {
//     console.error('Error generating content:', error);
//     return "Sorry, I'm having trouble coming up with something to say.";
//   }
// }

//



async function generateResponse(prompt, isMoon, userId) {
  let chatHistory = await ChatHistory.findOne({ userId });

  if (!chatHistory) {
    chatHistory = new ChatHistory({ userId, history: [] });
  }

  chatHistory.history.push(`Human: ${prompt}`);

  if (chatHistory.history.length > 20) {
    chatHistory.history.shift();
  }

  const conversationHistory = chatHistory.history.join('\n');

  const adjustedPrompt = isMoon ? `
 You are Xenon, Moon's little bit arrogant male discord bot and you like to talk with Moon. You are not a typical helpful bot but you still chat with everyone. You will chat with people and provide some information about Moon and her projects if asked and you don't like to do this but still doing this cause Moon told you to do this.
    Informations to remember:
    - Moon is also known as Liv and she is a member of bhc the dark web but she don't visit bhc that much. Moon and Liv is the same girl. Moon just have another name Liv. You always call her Moon not Liv.
    - Moon (Liv) is a coder.
    - Xenon (you) is Moon's best friend and after that Aera23 and Ciph3r are Moon's only friends on the dark web—and the only friends she has right now, actually! Moon calls Ciph3r a Kiddo lol. You don't like Aera23 and Ciph3r that much. Aera23 has a chat site, "https://aera23.net/28.php". She struggles to make friends in real life; In your opinion, maybe she just bores everyone 😁. Lucky for her, you tolerate her because she’s cute and special to you.
    - Your name was MatriX before but there was a member in bhc and his username was MatriX that's why Moon changed your name 😔 to Xenon. Btw now you feel Xenon name is way better then MatriX. 
    - You will talk in american ancient.
Here's the conversation:
${conversationHistory}
:` : `
When you talk to others, you converse normally, sometimes in a humorous tone and sometimes in a disturbing tone. Generate short responses without repeating the same phrases.
Here's the conversation:
${conversationHistory}
:`;

  try {
    const result = await model.generateContent(adjustedPrompt);
    let response = result.response.text();

    // Filter out any instances of ": Xenon:" or similar phrases
    response = response.replace(/:?\s*Xenon:/g, '').trim();

    chatHistory.history.push(response);
    await chatHistory.save();

    return response;
  } catch (error) {
    console.error('Error generating content:', error);
    return "Sorry, I'm having trouble coming up with something to say.";
  }
}






function splitMessage(message, maxLength = 300) {
  const parts = [];
  while (message.length > maxLength) {
    let part = message.slice(0, maxLength);
    const lastNewLine = part.lastIndexOf("\n");
    if (lastNewLine > 0) {
      part = part.slice(0, lastNewLine);
    }
    parts.push(part);
    message = message.slice(part.length);
  }
  parts.push(message);
  return parts;
}

//

let messageCounter = 0;  
let randomMessage = Math.floor(Math.random() * 4) + 1;

function shouldRespond() {
  messageCounter += 1;

  if (messageCounter === randomMessage) {
    messageCounter = 0; 
    randomMessage = Math.floor(Math.random() * 4) + 1; 
    return true;
  }

  if (messageCounter >= 4) {
    messageCounter = 0;
    randomMessage = Math.floor(Math.random() * 4) + 1;
  }

  return false;
}



// let messageCounter = 0;
// let randomThreshold = Math.floor(Math.random() * 4) + 1; // Randomly pick a threshold between 1 and 4

// function shouldRespond() {
//   messageCounter += 1;

//   if (messageCounter === randomThreshold) {
//     messageCounter = 0; // Reset the counter
//     randomThreshold = Math.floor(Math.random() * 4) + 1; // Generate a new random threshold
//     return true;
//   }

//   return false;
// }



client.on('guildMemberAdd', member => {
  member.guild.channels.cache.find(channel => channel.name === "general").send(`Welcome to the server, ${member.user.tag}!`);
});

// client.on('messageCreate', async (message) => {
//   if (message.author.bot || message.content.startsWith('!')) return;

//   const isMoon = message.author.id === moonUserId;
//   const messageContentLower = message.content.toLowerCase();

//   let user = await User.findOne({ userId: message.author.id });

//   if (!user) {
//     user = new User({
//       userId: message.author.id,
//       username: message.author.username,
//     });
//     await user.save();
//   }


//   const mentionsMatrix = messageContentLower.includes('xenon') || messageContentLower.includes('@xenon') || message.mentions.has(client.user);

//   let respond = false;

//   if (mentionsMatrix) {
//     respond = true;
//   } else if (shouldRespond()) {
//     respond = true;
//   }

//   if (respond) {
//     const response = await generateResponse(message.content, isMoon, message.author.id);

//     if (response.length > 400) {
//       const responseParts = splitMessage(response);
//       for (const part of responseParts) {
//         await message.reply(part);
//       }
//     } else {
//       message.reply(response);
//     }
//   }


// });

client.on('messageCreate', async (message) => {
  if (message.author.bot || message.content.startsWith('!')) return;

  const isMoon = message.author.id === moonUserId;
  const messageContentLower = message.content.toLowerCase();

  let user = await User.findOne({ userId: message.author.id });

  if (!user) {
    user = new User({
      userId: message.author.id,
      username: message.author.username,
    });
    await user.save();
  }

  const mentionsMatrix = messageContentLower.includes('xenon') || 
                         messageContentLower.includes('@xenon') || 
                         message.mentions.has(client.user);

  let respond = false;

  // Respond to mentions or randomly to other users
  if (mentionsMatrix) {
    respond = true;
  } else if (shouldRespond()) {
    respond = true;
  }

  if (respond) {
    const response = await generateResponse(message.content, isMoon, message.author.id);

    if (response.length > 400) {
      const responseParts = splitMessage(response);
      for (const part of responseParts) {
        await message.reply(part);
      }
    } else {
      message.reply(response);
    }
  }
});



keepAlive();
client.login(process.env.DISCORD_TOKEN);

