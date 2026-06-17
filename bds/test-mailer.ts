import * as dotenv from 'dotenv';
dotenv.config();
import { sendNewFormNotification } from './lib/mailer';

async function test() {
  console.log('Testing mailer with:', process.env.GMAIL_USER, '->', process.env.NOTIFY_EMAIL);
  try {
    await sendNewFormNotification({
      fullName: 'Test User',
      phoneNumber: '0123456789',
      message: 'This is a test message from script',
    });
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

test();
