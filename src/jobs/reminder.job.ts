import cron from 'node-cron';
import axios from 'axios';
import https from 'https';
import prisma from '../config/prisma';
import logger from '../utils/logger';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export function startReminderJob() {
  cron.schedule('0 * * * *', async () => {
    logger.info({ message: 'Running overdue reminder job' });

    const overdue = await prisma.actionItem.findMany({
      where: { status: { not: 'COMPLETED' }, dueDate: { lt: new Date() } }
    });

    for (const item of overdue) {
      try {
        await axios.post(process.env.DISCORD_WEBHOOK_URL!, {
          content: `⚠️ **Overdue Reminder**\n📌 **Task:** ${item.task}\n👤 **Assigned To:** ${item.assignee}\n📅 **Due:** ${item.dueDate?.toISOString()}\n🔴 **Status:** ${item.status}`
        }, { httpsAgent });

        await prisma.reminder.create({
          data: { actionItemId: item.id, channel: 'discord', success: true }
        });

        logger.info({ message: 'Reminder sent', actionItemId: item.id });
      } catch (e: any) {
        await prisma.reminder.create({
          data: { actionItemId: item.id, channel: 'discord', success: false }
        });
        logger.error({ message: 'Reminder failed', error: e.message });
      }
    }
  });
}