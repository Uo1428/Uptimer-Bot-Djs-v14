const { InteractionType, ActionRowBuilder, ButtonBuilder } = require('discord.js'),
  hastebin = require('hastebin-gen'),
  fetch = require("node-fetch"),
  validUrl = require("valid-url"),
  urlsConfig = require(`${process.cwd()}/src/database/UrlsConfig`);
module.exports = {
  async execute(client) {
    client.on('interactionCreate', interaction => {
      if (interaction.type !== InteractionType.ModalSubmit) return;
      // Eval Command
      if (interaction.customId === 'eval-modal') {
        const code = interaction.fields.getTextInputValue('eval-code');
        String.prototype.replaceAll = function(search, replacement) {
          return this.replace(RegExp(search, 'gi'), replacement);
        };
        client.clean = text => {
          if (typeof text !== 'string') {
            text = require('util').inspect(text, { depth: 0 });
          }
          text = text
            .replace(/`/g, '`' + String.fromCharCode(8203))
            .replace(/@/g, '@' + String.fromCharCode(8203))
            .replaceAll(client.token, 'never gonna give you up, never gonna let you down')
          return text;
        };
        try {
          const evaled = client.clean(eval(code));
          if (evaled.length < 800) {
            interaction.reply({ content: `${client.emotes.MESSAGE.y} **Code Output:**\`\`\`xl\n${evaled}\n\`\`\`` })
          } else {
            hastebin(evaled, "js").then(r => {
              const row = new ActionRowBuilder().addComponents([new ButtonBuilder().setLabel('Hastebin').setURL(r).setStyle(5)])
              interaction.reply({ content: `${client.emotes.MESSAGE.y} **Hastebin Output:**`, components: [row] })
            });
          }
        } catch (error) {
          client.slash_err(client, interaction, error);
        }
      } else if (interaction.customId === "moniter-add") {
        try {
          const url = interaction.fields.getTextInputValue('moniter-url');
          interaction.reply({
            ephemeral: true,
            embeds: [
              client.loadingEmbed
            ]
          })
          if (!validUrl.isUri(url)) {
            return setTimeout(() => {
              interaction.editReply({
                embeds: [],
                content: client.emotes.MESSAGE.x + " Please provide a vaild url"
              });
            }, 2000)
          }
          urlsConfig.findOne({ URL: url, }, async (err, data) => {
            if (!data) {
              urlsConfig.create({
                authorID: interaction.member.user.id,
                URL: url,
                pinged: 0,
              }).then(async () => {
                client.projects.push(url);
                try {
                  fetch(url);
                } catch (e) {
                  urlsConfig.findOneAndUpdate(
                    { URL: url },
                    { error: true, errorText: e.message },
                    { new: true }
                  );
                  return setTimeout(() => {
                    interaction.editReply({
                      content: client.emotes.MESSAGE.x + " Fetching Error",
                      embeds: []
                    });
                  }, 2000)
                }
                return setTimeout(() => {
                  interaction.editReply({
                    embeds: [
                      client.Embed(false)
                        .setDescription(client.emotes.MESSAGE.y + " Added Succesfully")
                    ]
                  });
                }, 2000);
              })
            } else {
              setTimeout(() => {
                interaction.editReply({
                  embeds: [
                    client.Embed(false).setDescription(client.emotes.MESSAGE.i + " The Project you're Trying To Re ster Is Already In The Database")
                  ]
                });
              }, 2000)
            }
          })
        } catch (error) {
          client.slash_err(client, interaction, error)
        }
      }
    })
  }
}