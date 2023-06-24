const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
module.exports = async (client, interaction, title, lb, ephemeral = false) => {
  let page = 1;
  await interaction.reply({ embeds: [generateEmbed(0, 0, lb, title, page)], ephemeral, fetchReply: true })
  if (lb.length <= 10) return;
  let button1 = new ButtonBuilder()
    .setCustomId('start')
    .setStyle(2)
    .setEmoji(`991378355473633300`)
    .setDisabled(true);
  let button2 = new ButtonBuilder()
    .setCustomId('back_button')
    .setEmoji('991359218970001428')
    .setStyle(2)
    .setDisabled(true);
  let button3 = new ButtonBuilder()
    .setCustomId('forward_button')
    .setEmoji('991359213819396126')
    .setStyle(2);
  let button4 = new ButtonBuilder()
    .setCustomId('end')
    .setEmoji(`991378371441340506`)
    .setStyle(2);

  let row = new ActionRowBuilder()
    .addComponents(button1, button2, button3, button4);

  let message = await interaction.editReply({ embeds: [generateEmbed(0, 0, lb, title, page)], fetchReply: true, components: [row] })
  let currentIndex = 0;
  const collector = message.createMessageComponentCollector((button) => button.user.id === interaction.user.id, { time: 60000 });

  collector.on('collect', async (btn) => {
    if (btn.user.id == interaction.user.id) {
      if (btn.customId === "back_button") {
        currentIndex -= 10;
        page--;
      }
      if (btn.customId === "forward_button") {
        currentIndex += 10;
        page++;
      }
      if (btn.customId === "start") {
        currentIndex = 0;
        page = 1;
      }
      if (btn.customId === "end") {
        currentIndex = lb.length - lb.length % 10;
        page = Math.ceil(lb.length / 10);
      }
      let btn1 = new ButtonBuilder()
        .setCustomId('start')
        .setStyle(2)
        .setEmoji(`991378355473633300`)
        .setDisabled(true);
      let btn2 = new ButtonBuilder()
        .setCustomId('back_button')
        .setEmoji('991359218970001428')
        .setStyle(2)
        .setDisabled(true);
      let btn3 = new ButtonBuilder()
        .setCustomId('forward_button')
        .setEmoji('991359213819396126')
        .setStyle(2)
        .setDisabled(true);
      let btn4 = new ButtonBuilder()
        .setCustomId('end')
        .setEmoji(`991378371441340506`)
        .setStyle(2)
        .setDisabled(true);

      if (currentIndex !== 0) {
        btn1.setDisabled(false);
        btn2.setDisabled(false);
      }
      if (currentIndex + 10 < lb.length) {
        btn3.setDisabled(false)
        btn4.setDisabled(false)
      }

      let row2 = new ActionRowBuilder()
        .addComponents(btn1, btn2, btn3, btn4);

      interaction.editReply({ fetchReply: true, embeds: [generateEmbed(currentIndex, currentIndex, lb, title, page)], components: [row2] });
      btn.deferUpdate();
    }
  })

  collector.on('end', async (btn) => {
    let btn1Disable = new ButtonBuilder()
      .setCustomId('back_button')
      .setEmoji('991359218970001428')
      .setStyle(2)
      .setDisabled(true);

    let btn2Disable = new ButtonBuilder()
      .setCustomId('forward_button')
      .setEmoji('991359213819396126')
      .setStyle(2)
      .setDisabled(true);

    let rowDisable = new ActionRowBuilder()
      .addComponents(btn1Disable, btn2Disable);

    interaction.editReply({ embeds: [generateEmbed(currentIndex, currentIndex, lb, title, page)], components: [rowDisable] });
  })
}

function generateEmbed(start, end, lb, title, page) {
  const current = lb.slice(start, end + 10);
  const result = current.join("\n");
  let embed = new EmbedBuilder()
    .setColor("#43eaf6")
    .setTitle(`${title}`)
    .setDescription(`${result.toString()}`)
    .setFooter({ text: page + ` / ${Math.ceil(lb.length / 10)}` })
  return embed;
}