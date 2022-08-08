import seeder from 'mongoose-seed';

const MONGO_URI = 'mongodb+srv://TaagerCompany:moazamr100_@cluster0-qpdrc.mongodb.net/test?retryWrites=true&w=majority';

const data = [
  {
    model: 'Category',
    documents: [
      {
        name: 'all-items',
        text: 'Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª',
        icon: 'all-items',
      },
      {
        name: 'Taager exclusive deals',
        text: 'Ø¹Ø±ÙˆØ¶ ØªØ§Ø¬Ø± Ø§Ù„Ø­ØµØ±ÙŠØ©',
      },
      {
        name: 'Sell at Any price',
        text: 'Ø¨ÙŠØ¹ Ø¨Ø§ÙŠ Ø³Ø¹Ø±',
      },
      {
        name: 'New products',
        text: 'Ø§Ø¬Ø¯Ø¯ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª',
      },
      {
        name: 'mobile accessiories',
        text: 'Ø§ÙƒØ³Ø³ÙˆØ§Ø±Ø§Øª Ù…ÙˆØ¨Ø§ÙŠÙ„',
      },
      {
        name: 'Home Utensils',
        text: 'Ø£Ø¯ÙˆØ§Øª Ù…Ù†Ø²Ù„ÙŠØ©',
      },
      {
        name: 'Limited quantity products',
        text: 'Ù…Ù†ØªØ¬Ø§Øª Ø¨ÙƒÙ…ÙŠØ§Øª Ù…Ø­Ø¯ÙˆØ¯Ø©',
      },
      {
        name: 'shoes',
        text: 'Ø£Ø­Ø°ÙŠØ©',
        icon: 'shoes',
      },
      {
        name: 'electronics',
        text: 'Ù…Ø³ØªÙ„Ø²Ù…Ø§Øª ÙƒÙ…Ø¨ÙŠÙˆØªØ±',
        icon: 'electronics',
      },
      {
        name: 'self care',
        text: 'Ø¹Ù†Ø§ÙŠØ© Ø´Ø®ØµÙŠØ©',
      },
      {
        name: 'silver',
        icon: 'silver',
        text: 'ÙØ¶Ø©',
      },
      {
        name: 'watch',
        icon: 'watch',
        text: 'Ø³Ø§Ø¹Ø§Øª',
      },
      {
        name: 'furniture',
        icon: 'furniture',
        text: 'Ù…ÙØ±ÙˆØ´Ø§Øª',
      },
      {
        name: 'toys',
        icon: 'toys',
        text: 'Ø§Ù„Ø¹Ø§Ø¨',
      },
      {
        name: 'small-electronic-devices',
        icon: 'small-electronic-devices',
        text: 'Ø£Ø¬Ù‡Ø²Ø© Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠØ© ØµØºÙŠØ±Ø©',
      },
      {
        name: 'tv',
        icon: 'tv',
        text: 'ØªÙ„ÙÙŠØ²ÙŠÙˆÙ†Ø§Øª',
      },
      {
        name: 'clothes',
        icon: 'clothes',
        text: 'Ù…Ù„Ø§Ø¨Ø³',
      },
      {
        name: 'beauty',
        icon: 'beauty',
        text: 'Ù…Ø³ØªØ­Ø¶Ø±Ø§Øª ØªØ¬Ù…ÙŠÙ„',
      },
      {
        name: 'leather',
        icon: 'leather',
        text: 'Ø¬Ù„ÙˆØ¯',
      },
    ],
  },
];

seeder.connect(MONGO_URI, function() {
  seeder.loadModels(['./src/models/category.model.js']);

  seeder.clearModels(['Category'], function() {
    seeder.populateModels(data, function() {
      seeder.disconnect();
    });
  });
});


