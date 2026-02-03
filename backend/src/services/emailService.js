import nodemailer from 'nodemailer';
import models from '../models/index.js';

const { Email, Contact, User } = models;

// Create SMTP transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export const getEmails = async (query) => {
  const {
    page = 1,
    limit = 20,
    contactId,
    direction,
  } = query;

  const offset = (page - 1) * limit;
  const where = {};

  if (contactId) {
    where.contactId = contactId;
  }

  if (direction) {
    where.direction = direction;
  }

  const { rows, count } = await Email.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
    include: [
      { model: Contact, as: 'contact', attributes: ['id', 'firstName', 'lastName', 'email'] },
      { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  return {
    emails: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit),
    },
  };
};

export const getEmailById = async (id) => {
  const email = await Email.findByPk(id, {
    include: [
      { model: Contact, as: 'contact' },
      { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
    ],
  });

  if (!email) {
    throw { statusCode: 404, message: 'Email not found' };
  }

  // Mark as opened if it's the first time
  if (!email.opened && email.direction === 'inbound') {
    await email.update({
      opened: true,
      openedAt: new Date(),
    });
  }

  return email;
};

export const sendEmail = async (emailData, userId) => {
  const { to, cc, bcc, subject, body, htmlBody, contactId } = emailData;

  try {
    const transporter = createTransporter();

    // Send email
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: Array.isArray(to) ? to.join(', ') : to,
      cc: cc ? (Array.isArray(cc) ? cc.join(', ') : cc) : undefined,
      bcc: bcc ? (Array.isArray(bcc) ? bcc.join(', ') : bcc) : undefined,
      subject,
      text: body,
      html: htmlBody || body,
    });

    // Save to database
    const email = await Email.create({
      messageId: info.messageId,
      from: process.env.SMTP_USER,
      to: Array.isArray(to) ? to : [to],
      cc: cc ? (Array.isArray(cc) ? cc : [cc]) : null,
      bcc: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : null,
      subject,
      body,
      htmlBody: htmlBody || body,
      direction: 'outbound',
      status: 'sent',
      contactId,
      userId,
      sentAt: new Date(),
    });

    return email;
  } catch (error) {
    console.error('Failed to send email:', error);
    
    // Save as failed
    const email = await Email.create({
      from: process.env.SMTP_USER,
      to: Array.isArray(to) ? to : [to],
      cc: cc ? (Array.isArray(cc) ? cc : [cc]) : null,
      bcc: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : null,
      subject,
      body,
      htmlBody: htmlBody || body,
      direction: 'outbound',
      status: 'failed',
      contactId,
      userId,
    });

    throw { statusCode: 500, message: 'Failed to send email', email };
  }
};

export const deleteEmail = async (id) => {
  const email = await Email.findByPk(id);
  
  if (!email) {
    throw { statusCode: 404, message: 'Email not found' };
  }

  await email.destroy();
  return { message: 'Email deleted successfully' };
};
