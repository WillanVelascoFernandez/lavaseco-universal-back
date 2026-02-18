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

const WASHER_TOPIC = 'lavadoras/+/uso';
const DRYER_TOPIC = 'secadoras/+/uso';

client.on('connect', () => {
  console.log('✅ Conectado al servidor MQTT:', process.env.MQTT_HOST);
  client.subscribe([WASHER_TOPIC, DRYER_TOPIC], (err) => {
    if (!err) console.log('📡 Suscrito a los tópicos de máquinas');
  });
});

client.on('message', async (topic, message) => {
  try {
    const topicParts = topic.split('/');
    const type = topicParts[0]; // lavadoras o secadoras
    const id = parseInt(topicParts[1]);
    const action = topicParts[2]; // uso

    if (action === 'uso') {
      const data = JSON.parse(message.toString());

      if (type === 'lavadoras') {
        const reg = await prisma.registroLavadora.create({
          data: { lavadoraId: id, tipoLavado: data.tipoLavado || 'Normal' }
        });
        console.log('💾 Lavadora registrada:', reg.id);
        publishMessage(`lavadoras/${id}/confirmacion`, { status: 'OK', registroId: reg.id });
      } 
      else if (type === 'secadoras') {
        const reg = await prisma.registroSecadora.create({
          data: { secadoraId: id, tipoSecado: data.tipoSecado || 'Normal' }
        });
        console.log('💾 Secadora registrada:', reg.id);
        publishMessage(`secadoras/${id}/confirmacion`, { status: 'OK', registroId: reg.id });
      }
    }
  } catch (error) {
    console.error('❌ Error MQTT:', error.message);
  }
});

export const publishMessage = (topic, message) => {
  if (client.connected) {
    client.publish(topic, JSON.stringify(message), { qos: 1 });
  }
};

export default client;
