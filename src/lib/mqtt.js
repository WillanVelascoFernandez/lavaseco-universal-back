import mqtt from 'mqtt';
import 'dotenv/config';
import prisma from './prisma.js';

const options = {
  host: process.env.MQTT_HOST,
  port: process.env.MQTT_PORT,
  protocol: 'mqtt',
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  clientId: process.env.MQTT_CLIENT_ID + '_' + Math.random().toString(16).substring(2, 8),
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
};

const client = mqtt.connect(`mqtt://${options.host}`, options);

const WASHER_TOPIC = 'washers/+/usage';
const DRYER_TOPIC = 'dryers/+/usage';

client.on('connect', () => {
  console.log('✅ Connected to MQTT Broker:', process.env.MQTT_HOST);
  client.subscribe([WASHER_TOPIC, DRYER_TOPIC], (err) => {
    if (!err) console.log('📡 Subscribed to machine topics');
  });
});

client.on('message', async (topic, message) => {
  try {
    const topicParts = topic.split('/');
    const type = topicParts[0]; // washers or dryers
    const id = parseInt(topicParts[1]);
    const action = topicParts[2]; // usage

    if (action === 'usage') {
      const data = JSON.parse(message.toString());

      if (type === 'washers') {
        const record = await prisma.washerLog.create({
          data: { washerId: id, washType: data.washType || 'Normal' }
        });
        console.log('💾 Washer usage recorded:', record.id);
        publishMessage(`washers/${id}/confirmation`, { status: 'OK', recordId: record.id });
      } 
      else if (type === 'dryers') {
        const record = await prisma.dryerLog.create({
          data: { dryerId: id, dryType: data.dryType || 'Normal' }
        });
        console.log('💾 Dryer usage recorded:', record.id);
        publishMessage(`dryers/${id}/confirmation`, { status: 'OK', recordId: record.id });
      }
    }
  } catch (error) {
    console.error('❌ MQTT Error:', error.message);
  }
});

export const publishMessage = (topic, message) => {
  if (client.connected) {
    client.publish(topic, JSON.stringify(message), { qos: 1 });
  }
};

export default client;
