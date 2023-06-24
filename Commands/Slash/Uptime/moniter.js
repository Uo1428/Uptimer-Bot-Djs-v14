const urlsConfig = require(`${process.cwd()}/src/database/UrlsConfig`),
  { ModalBuilder, TextInputBuilder, TextInputStyle, ApplicationCommandType, ButtonBuilder, ActionRowBuilder } = require("discord.js"),
  validUrl = require("valid-url");
module.exports = {
  name: "moniter",
  description: "moniter",
  usage: "",
  category: "uptime",
  userPerms: [""],
  botPerms: [""],
  cooldown: 5,
  guildOnly: false,
  ownerOnly: false,
  toggleOff: false,
  nsfwOnly: false,
  maintenance: false,
  type: 1,
  options: [
    {
      name: "add",
      description: "Adds monitor to your project.",
      type: 1
    },
    {
      name: "remove",
      description: "remove monitor from your projects.",
      type: 1,
      options: [
        {
          name: "url",
          description: "Enter project URL",
          type: 3
        }
      ]
    },
    {
      name: "total",
      description: "Show all projects",
      type: 1
    },
    {
      name: "projects",
      description: "Show all yours projects",
      type: 1
    },
  ],
  run: async (client, interaction) => {
    try {
      const sub = interaction.options._subcommand;
      if (sub === "total") {
        urlsConfig.countDocuments(
          {
            authorID: interaction.user.id
          }, async function(err, total) {
            return interaction.reply({
              ephemeral: true,
              embeds: [
                client.Embed()
                  .setAuthor({
                    name: `${client.user.username} Bot Total Projects`,
                    url: "https://discord.gg/pXRT2FusPb",
                    iconURL: client.user.displayAvatarURL()
                  })
                  .addFields(
                    {
                      name: "Total Projects:",
                      value: `\`\`\`yml\n${client.projectsSize}\`\`\``,
                      inline: true
                    },
                    {
                      name: "Your Projects:",
                      value: `\`\`\`yml\n${total}\`\`\``,
                      inline: true
                    })
              ]
            });
          }
        );
      } else if (sub === "add") {
        const modal = new ModalBuilder()
          .setCustomId(`moniter-add`)
          .setTitle(`Add Moniter`);
        const link_to_moniter = new TextInputBuilder()
          .setCustomId('moniter-url')
          .setLabel('URL')
          .setStyle(1)
          .setMinLength(0)
          .setPlaceholder('https://domain.com')
          .setRequired(true);
        const firstActionRow = new ActionRowBuilder().addComponents(link_to_moniter);
        modal.addComponents(firstActionRow);
        return interaction.showModal(modal);
      } else if (sub === "remove") {
        await interaction.reply({
          ephemeral: true,
          embeds: [client.loadingEmbed]
        })
        const url = interaction.options.getString("url");
        if (url) {
          if (!validUrl.isUri(url)) {
            return setTimeout(() => {
              interaction.editReply({
                embeds: [],
                content: client.emotes.MESSAGE.x + " Please provide a vaild url"
              });
            }, 2000)
          }
          urlsConfig.findOne(
            {
              URL: url,
              authorID: interaction.member.user.id,
            }, async function(err, data) {
              if (!data) {
                return interaction.editReply({
                  embeds: [client.Embed(false).setDescription(client.emotes.MESSAGE.i + " Project is not Registered!")]
                })
              } else {
                urlsConfig.findOneAndDelete({
                  URL: url,
                }).then(async () => {
                  let new_pros = await client.projects.filter((p) => p !== url);
                  client.projects = new_pros;
                  let embed = client.Embed(false)
                    .setDescription(client.emotes.MESSAGE.y + " Removed Succesfully!")
                  interaction.editReply({ embeds: [embed] });
                });
              }
            })
        } else {
          urlsConfig.find({ authorID: interaction.member.user.id }, async function(err, data) {
            if (!data || data.length === 0) {
              return interaction.editReply({
                embeds: [client.Embed(false).setDescription(client.emotes.MESSAGE.i + " You don't have any project")]
              })
            } else {
              let num_btns = [],
                btn_num1 = new ButtonBuilder()
                  .setStyle(2)
                  .setEmoji(`1️⃣`)
                  .setCustomId('1'),
                btn_num2 = new ButtonBuilder()
                  .setStyle(2)
                  .setEmoji(`2️⃣`)
                  .setCustomId(`2`),
                btn_num3 = new ButtonBuilder()
                  .setStyle(2)
                  .setEmoji(`3️⃣`)
                  .setCustomId('3'),
                btn_num4 = new ButtonBuilder()
                  .setStyle(2)
                  .setEmoji(`4️⃣`)
                  .setCustomId('4'),
                btn_num5 = new ButtonBuilder()
                  .setStyle(2)
                  .setEmoji(`5️⃣`)
                  .setCustomId('5');

              let dis1 = new ButtonBuilder()
                .setDisabled(true)
                .setStyle(2)
                .setEmoji(`955381244139569202`)
                .setCustomId('disable1'),
                back_btn = new ButtonBuilder()
                  .setDisabled(false)
                  .setStyle(1)
                  .setEmoji(`991359218970001428`)
                  .setCustomId('back'),
                dis2 = new ButtonBuilder()
                  .setDisabled(true)
                  .setStyle(2)
                  .setEmoji(`955381244139569202`)
                  .setCustomId('disable2'),
                next_btn = new ButtonBuilder()
                  .setDisabled(false)
                  .setStyle(1)
                  .setEmoji(`991359213819396126`)
                  .setCustomId('next'),
                dis3 = new ButtonBuilder()
                  .setDisabled(true)
                  .setStyle(2)
                  .setEmoji(`955381244139569202`)
                  .setCustomId('disable3');
              let embed = client.Embed().setTitle("Select what project you want remove from being uptimed.");
              const projects = sliceIntoChunks(data, 5);
              let projectCount = 0;
              let content = [];
              let currentPage = 0;
              const countConfig = new Map();

              projects[currentPage].forEach((doc) => {
                projectCount++;
                content.push(`**${projectCount}**. \`${doc.URL}\``);
                countConfig.set(projectCount, doc.URL);
              });
              embed.setDescription(content.join("\n"));
              if (content.length > 0 && content.length < 2) num_btns.push(btn_num1);
              else if (content.length > 1 && content.length < 3) num_btns.push(btn_num1, btn_num2);
              else if (content.length > 2 && content.length < 4) num_btns.push(btn_num1, btn_num2, btn_num3);
              else if (content.length > 3 && content.length < 5) num_btns.push(btn_num1, btn_num2, btn_num3, btn_num4);
              else num_btns.push(btn_num1, btn_num2, btn_num3, btn_num4, btn_num5);
              if (data.length <= 5) { back_btn.setDisabled(true); next_btn.setDisabled(true) }
              let row = new ActionRowBuilder().addComponents(num_btns)
              let row2 = new ActionRowBuilder().addComponents(dis1, back_btn, dis2, next_btn, dis3)
              let msg = await interaction.editReply({
                embeds: [embed],
                components: [row, row2]
              })
              const collector = msg.createMessageComponentCollector((button) => button.user.id === interaction.user.id, { time: 60e3 });
              collector.on('collect', async (b) => {
                if (b.customId === "1") {
                  urlsConfig.findOneAndDelete({
                    URL: countConfig.get(1),
                  }).then(async () => {
                    let new_pros = await client.projects.filter((p) => p !== countConfig.get(1));
                    client.projects = new_pros;
                    let embed = client.Embed(false)
                      .setDescription(client.emotes.MESSAGE.y + " Removed Succesfully!")
                    b.update({ embeds: [embed], components: [] });
                  });
                  collector.stop();
                }
                if (b.customId === "2") {
                  urlsConfig.findOneAndDelete({
                    URL: countConfig.get(2),
                  }).then(async () => {
                    let new_pros = await client.projects.filter((p) => p !== countConfig.get(2));
                    client.projects = new_pros;
                    let embed = client.Embed(false)
                      .setDescription(client.emotes.MESSAGE.y + " Removed Succesfully!")
                    b.update({ embeds: [embed], components: [] });
                  });
                  collector.stop();
                }
                if (b.customId === "3") {
                  urlsConfig.findOneAndDelete({
                    URL: countConfig.get(3),
                  }).then(async () => {
                    let new_pros = await client.projects.filter((p) => p !== countConfig.get(3));
                    client.projects = new_pros;
                    let embed = client.Embed(false)
                      .setDescription(client.emotes.MESSAGE.y + " Removed Succesfully!")
                    b.update({ embeds: [embed], components: [] });
                  });
                  collector.stop();
                }
                if (b.customId === "4") {
                  urlsConfig.findOneAndDelete({
                    URL: countConfig.get(4),
                  }).then(async () => {
                    let new_pros = await client.projects.filter((p) => p !== countConfig.get(4));
                    client.projects = new_pros;
                    let embed = client.Embed(false)
                      .setDescription(client.emotes.MESSAGE.y + " Removed Succesfully!")
                    b.update({ embeds: [embed], components: [] });
                  });
                  collector.stop();
                }
                if (b.customId === "5") {
                  urlsConfig.findOneAndDelete({
                    URL: countConfig.get(5),
                  }).then(async () => {
                    let new_pros = await client.projects.filter((p) => p !== countConfig.get(5));
                    client.projects = new_pros;
                    let embed = client.Embed(false)
                      .setDescription(client.emotes.MESSAGE.y + " Removed Succesfully!")
                    b.update({ embeds: [embed], components: [] });
                  });
                  collector.stop();
                }
                if (b.customId === "back") {
                  if (currentPage !== 0) {
                    currentPage = currentPage - 1;
                    if (!projects[currentPage]) return;
                    projectCount = 0;
                    content = [];
                    countConfig.clear();
                    projects[currentPage].forEach((doc) => {
                      projectCount++;
                      content.push(`**${projectCount}**. \`${doc.URL}\``);
                      countConfig.set(projectCount, doc.URL);
                    });

                    embed.setDescription(content.join("\n"));
                    let new_array = []
                    if (content.length > 0 && content.length < 2) new_array.push(btn_num1);
                    else if (content.length > 1 && content.length < 3) new_array.push(btn_num1, btn_num2);
                    else if (content.length > 2 && content.length < 4) new_array.push(btn_num1, btn_num2, btn_num3);
                    else if (content.length > 3 && content.length < 5) new_array.push(btn_num1, btn_num2, btn_num3, btn_num4);
                    else new_array.push(btn_num1, btn_num2, btn_num3, btn_num4, btn_num5);
                    row = new ActionRowBuilder().addComponents(new_array)
                    await b.update({ embeds: [embed], components: [row, row2] });
                  }
                }

                if (b.customId === "next") {
                  if (currentPage !== data.length) {
                    currentPage = currentPage + 1;
                    if (!projects[currentPage]) return;
                    projectCount = 0;
                    content = [];
                    countConfig.clear();
                    projects[currentPage].forEach((doc) => {
                      projectCount++;
                      content.push(`**${projectCount}**. \`${doc.URL}\``);
                      countConfig.set(projectCount, doc.URL);
                    });

                    embed.setDescription(content.join("\n"));
                    let new_array = []
                    if (content.length > 0 && content.length < 2) new_array.push(btn_num1);
                    else if (content.length > 1 && content.length < 3) new_array.push(btn_num1, btn_num2);
                    else if (content.length > 2 && content.length < 4) new_array.push(btn_num1, btn_num2, btn_num3);
                    else if (content.length > 3 && content.length < 5) new_array.push(btn_num1, btn_num2, btn_num3, btn_num4);
                    else new_array.push(btn_num1, btn_num2, btn_num3, btn_num4, btn_num5);
                    row = new ActionRowBuilder().addComponents(new_array)
                    await b.update({ embeds: [embed], components: [row, row2] });
                  }
                }
              })
            }
          })
        }
      } else if (sub === "projects") {
        urlsConfig.find({ authorID: interaction.member.user.id }, async function(err, data) {
          let lb = [];
          let count = 0;
          data.forEach(async (url) => {
            count++;
            lb.push(`**${count}**. \`${url.URL}\``);
          })
          if (lb.length === 0) return interaction.reply({
            ephemeral: true,
            embeds: [client.Embed(false).setDescription(client.emotes.MESSAGE.i + " You dont have any project.")]
          });
          require(`${process.cwd()}/src/functions/createLeaderboard.js`)(client, interaction, "・Projects", lb, true)
        })
      }
    } catch (error) {
      client.slash_err(client, interaction, error);
    }
  }
};


function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}