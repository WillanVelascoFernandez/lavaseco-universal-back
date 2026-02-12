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

const REGISTRO_TOPIC = 'lavadoras/+/uso'; // Escucha lavadoras/1/uso, lavadoras/2/uso, etc.

client.on('connect', () => {
  console.log('✅ Conectado al servidor MQTT:', process.env.MQTT_HOST);
  
  // Suscribirse al tópico de uso
  client.subscribe(REGISTRO_TOPIC, (err) => {
    if (!err) {
      console.log('📡 Suscrito a:', REGISTRO_TOPIC);
    }
  });
});

// Manejar mensajes entrantes
client.on('message', async (topic, message) => {
  try {
    const topicParts = topic.split('/');
    
    // Verificar si es un tópico de registro de uso
    if (topicParts[0] === 'lavadoras' && topicParts[2] === 'uso') {
      const lavadoraId = parseInt(topicParts[1]);
      const data = JSON.parse(message.toString());
      
      console.log(`📥 Nuevo registro recibido para Lavadora ${lavadoraId}:`, data);

      // Guardar en la base de datos
      const nuevoRegistro = await prisma.registroLavadora.create({
        data: {
          lavadoraId: lavadoraId,
          tipoLavado: data.tipoLavado || 'Normal'
        },
        include: {
          lavadora: true
        }
      });

      console.log('💾 Registro guardado con éxito:', nuevoRegistro.id);
      
      // Opcional: Publicar confirmación
      publishMessage(`lavadoras/${lavadoraId}/confirmacion`, {
        status: 'OK',
        registroId: nuevoRegistro.id,
        mensaje: 'Uso registrado correctamente'
      });
    }
  } catch (error) {
    console.error('❌ Error procesando mensaje MQTT:', error.message);
  }
});

client.on('error', (err) => {
  console.error('❌ Error en conexión MQTT:', err);
});

export const publishMessage = (topic, message) => {
  if (client.connected) {
    client.publish(topic, JSON.stringify(message), { qos: 1 }, (err) => {
      if (err) console.error('Error publicando mensaje MQTT:', err);
      else console.log(`📤 Mensaje enviado a ${topic}:`, message);
    });
  }
};

export default client;
