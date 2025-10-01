import TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';

dotenv.config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

async function testTelegram() {
  console.log('🧪 Testing Telegram Bot Connection...\n');
  
  if (!TELEGRAM_TOKEN || TELEGRAM_TOKEN === 'YOUR_BOT_TOKEN') {
    console.error('❌ TELEGRAM_BOT_TOKEN not set in .env file');
    process.exit(1);
  }
  
  if (!TELEGRAM_CHAT_ID || TELEGRAM_CHAT_ID === 'YOUR_CHAT_ID') {
    console.error('❌ TELEGRAM_CHAT_ID not set in .env file');
    process.exit(1);
  }

  console.log('✅ Environment variables found');
  console.log(`📱 Bot Token: ${TELEGRAM_TOKEN.substring(0, 20)}...`);
  console.log(`💬 Chat ID: ${TELEGRAM_CHAT_ID}\n`);

  try {
    const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });
    
    const message = `
🎉 *Telegram Connection Successful!*

Your Celo Risk Agent is ready to send alerts.

🤖 Bot Status: ✅ Active
⏰ Time: ${new Date().toLocaleString()}

_This is a test message from your monitoring agent_
`;

    await bot.sendMessage(TELEGRAM_CHAT_ID, message, { parse_mode: 'Markdown' });
    
    console.log('✅ SUCCESS! Test message sent to Telegram');
    console.log('📱 Check your Telegram app - you should see a message\n');
    
    // Send a test alert
    const testAlert = `
🚨 *TEST ALERT - Risk Detected*

This is what a real alert will look like:

📊 *Pool Metrics:*
• TVL: $1,234,567.89
• Change: -15.5%
• Severity: HIGH

⚠️ Action: Monitor closely or consider hedging

_Automated Risk Agent - Celo DeFi Monitor_
`;

    await bot.sendMessage(TELEGRAM_CHAT_ID, testAlert, { parse_mode: 'Markdown' });
    console.log('✅ Test alert sent! Check Telegram for preview\n');
    
    console.log('🎊 All systems go! Ready for Phase 2\n');
    
  } catch (error: any) {
    console.error('❌ Failed to send message:', error.message);
    console.error('\nTroubleshooting tips:');
    console.error('1. Make sure you started a chat with your bot');
    console.error('2. Verify your Chat ID is correct (use @userinfobot)');
    console.error('3. Check your bot token is valid\n');
  }
}

testTelegram();