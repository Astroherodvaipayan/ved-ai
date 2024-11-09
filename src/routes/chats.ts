import express from 'express';
import logger from '../utils/logger';
import db from '../db/index';
import { eq } from 'drizzle-orm';
import { chats, messages } from '../db/schema';

const router = express.Router();

router.get('/', async (_, res) => {
  try {
    let chats = await db.query.chats.findMany();

    chats = chats.reverse();

    return res.status(200).json({ chats: chats });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error in getting chats: ${err.message}`);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const chatExists = await db.query.chats.findFirst({
      where: eq(chats.id, req.params.id),
    });

    if (!chatExists) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const chatMessages = await db.query.messages.findMany({
      where: eq(messages.chatId, req.params.id),
    });

    return res.status(200).json({ chat: chatExists, messages: chatMessages });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error in getting chat: ${err.message}`);
  }
});

router.delete(`/:id`, async (req, res) => {
  try {
    const chatExists = await db.query.chats.findFirst({
      where: eq(chats.id, req.params.id),
    });

    if (!chatExists) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Delete messages first (due to foreign key constraints)
    await db
      .delete(messages)
      .where(eq(messages.chatId, req.params.id))
      .execute();

    // Then delete the chat
    await db
      .delete(chats)
      .where(eq(chats.id, req.params.id))
      .execute();

    return res.status(200).json({ success: true });
  } catch (err) {
    logger.error(`Error in deleting chat: ${err}`);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to delete chat' 
    });
  }
});

export default router;
