import axios from 'axios';
import models from '../models/index.js';

const { Integration, Contact, Company, Deal } = models;

// 1C Integration
export const sync1CData = async () => {
  try {
    const integration = await Integration.findOne({ where: { type: '1c' } });
    
    if (!integration || integration.status !== 'active') {
      throw { statusCode: 400, message: '1C integration is not active' };
    }

    const { apiUrl, apiKey } = integration.configuration;

    // Fetch data from 1C
    const response = await axios.get(`${apiUrl}/customers`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const customers = response.data;
    let syncedCount = 0;
    const errors = [];

    for (const customer of customers) {
      try {
        // Check if company already exists
        let company = await Company.findOne({ 
          where: { taxId: customer.taxId } 
        });

        if (!company) {
          company = await Company.create({
            name: customer.name,
            taxId: customer.taxId,
            phone: customer.phone,
            email: customer.email,
            address: customer.address,
          });
        } else {
          await company.update({
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            address: customer.address,
          });
        }

        // Sync contacts
        if (customer.contacts) {
          for (const contactData of customer.contacts) {
            let contact = await Contact.findOne({
              where: { email: contactData.email },
            });

            if (!contact) {
              await Contact.create({
                firstName: contactData.firstName,
                lastName: contactData.lastName,
                email: contactData.email,
                phone: contactData.phone,
                companyId: company.id,
                source: '1c',
              });
            }
          }
        }

        syncedCount++;
      } catch (error) {
        errors.push({
          customer: customer.name,
          error: error.message,
        });
      }
    }

    // Update integration log
    await integration.update({
      lastSync: new Date(),
      syncLog: {
        timestamp: new Date(),
        synced: syncedCount,
        errors: errors.length,
        details: errors,
      },
    });

    return {
      success: true,
      synced: syncedCount,
      errors: errors.length,
      details: errors,
    };
  } catch (error) {
    console.error('1C sync error:', error);
    throw { statusCode: 500, message: 'Failed to sync with 1C', details: error.message };
  }
};

// Shine Shop Integration
export const syncShineShopData = async () => {
  try {
    const integration = await Integration.findOne({ where: { type: 'shine_shop' } });
    
    if (!integration || integration.status !== 'active') {
      throw { statusCode: 400, message: 'Shine Shop integration is not active' };
    }

    const { apiUrl, apiKey } = integration.configuration;

    // Fetch orders from Shine Shop
    const response = await axios.get(`${apiUrl}/orders`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      params: {
        status: 'new',
        limit: 100,
      },
    });

    const orders = response.data;
    let syncedCount = 0;
    const errors = [];

    for (const order of orders) {
      try {
        // Find or create contact
        let contact = await Contact.findOne({
          where: { email: order.customer.email },
        });

        if (!contact) {
          contact = await Contact.create({
            firstName: order.customer.firstName,
            lastName: order.customer.lastName,
            email: order.customer.email,
            phone: order.customer.phone,
            source: 'shine_shop',
            status: 'customer',
          });
        }

        // Create deal from order
        const deal = await Deal.create({
          title: `Shine Shop Order #${order.orderNumber}`,
          value: order.total,
          currency: 'UAH',
          stage: 'qualification',
          contactId: contact.id,
          description: `Order from shine-shop.com.ua\nProducts: ${order.items.map(i => i.name).join(', ')}`,
          customFields: {
            shineShopOrderId: order.id,
            orderNumber: order.orderNumber,
            items: order.items,
          },
        });

        syncedCount++;
      } catch (error) {
        errors.push({
          order: order.orderNumber,
          error: error.message,
        });
      }
    }

    // Update integration log
    await integration.update({
      lastSync: new Date(),
      syncLog: {
        timestamp: new Date(),
        synced: syncedCount,
        errors: errors.length,
        details: errors,
      },
    });

    return {
      success: true,
      synced: syncedCount,
      errors: errors.length,
      details: errors,
    };
  } catch (error) {
    console.error('Shine Shop sync error:', error);
    throw { statusCode: 500, message: 'Failed to sync with Shine Shop', details: error.message };
  }
};

// Webhook handler for 1C
export const handle1CWebhook = async (webhookData) => {
  try {
    const { event, data } = webhookData;

    if (event === 'customer.created' || event === 'customer.updated') {
      // Handle customer data
      let company = await Company.findOne({ where: { taxId: data.taxId } });

      if (!company) {
        company = await Company.create({
          name: data.name,
          taxId: data.taxId,
          phone: data.phone,
          email: data.email,
        });
      } else {
        await company.update({
          name: data.name,
          phone: data.phone,
          email: data.email,
        });
      }

      return { success: true, company };
    }

    return { success: true, message: 'Webhook processed' };
  } catch (error) {
    console.error('1C webhook error:', error);
    throw { statusCode: 500, message: 'Failed to process webhook' };
  }
};

// Webhook handler for Shine Shop
export const handleShineShopWebhook = async (webhookData) => {
  try {
    const { event, data } = webhookData;

    if (event === 'order.created') {
      // Find or create contact
      let contact = await Contact.findOne({
        where: { email: data.customer.email },
      });

      if (!contact) {
        contact = await Contact.create({
          firstName: data.customer.firstName,
          lastName: data.customer.lastName,
          email: data.customer.email,
          phone: data.customer.phone,
          source: 'shine_shop',
          status: 'customer',
        });
      }

      // Create deal
      const deal = await Deal.create({
        title: `Shine Shop Order #${data.orderNumber}`,
        value: data.total,
        currency: 'UAH',
        stage: 'qualification',
        contactId: contact.id,
        customFields: {
          shineShopOrderId: data.id,
          orderNumber: data.orderNumber,
        },
      });

      return { success: true, deal };
    }

    if (event === 'order.updated') {
      // Find and update deal
      const deal = await Deal.findOne({
        where: {
          'customFields.shineShopOrderId': data.id,
        },
      });

      if (deal) {
        await deal.update({
          value: data.total,
          stage: data.status === 'completed' ? 'won' : deal.stage,
        });
      }

      return { success: true, deal };
    }

    return { success: true, message: 'Webhook processed' };
  } catch (error) {
    console.error('Shine Shop webhook error:', error);
    throw { statusCode: 500, message: 'Failed to process webhook' };
  }
};

// Get all integrations
export const getIntegrations = async () => {
  return await Integration.findAll();
};

// Update integration configuration
export const updateIntegration = async (id, updateData) => {
  const integration = await Integration.findByPk(id);
  
  if (!integration) {
    throw { statusCode: 404, message: 'Integration not found' };
  }

  await integration.update(updateData);
  return integration;
};
