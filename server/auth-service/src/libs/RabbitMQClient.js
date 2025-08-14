import amqp from 'amqplib'

const MAX_RECONN_ATTEMPTS = 10;
const RECONN_DELAY = 1000;

class RabbitMQClient {
  constructor(queue, url = process.env.RABBITMQ_URL, exchange = 'microservices-exchange', exchangeType = 'topic') {
      this.url = url;
      this.queueName = queue;
      this.channel = null;
      this.exchange = exchange;
      this.exchangeType = exchangeType;
      this.connection = null;
      this.reconnectAttempts = 0;
      this.isConnecting = false;
  }

  async connect() {
    if (this.isConnecting)
      return ;

    this.isConnecting = true;
    try {
        this.connection = await amqp.connect(this.url);
        this.connection.on('error', (error) => console.log('RabbitMQ connection error: ', error))
        this.connection.on('close', () => this.#attemptReconnect())

        this.channel = await this.connection.createChannel();
        this.channel.on('error', async (error) => { console.log('RabbitMQ channel error: ', error); });
        await this.channel.assertExchange(this.exchange, this.exchangeType, { durable: true });
        await this.channel.assertQueue(this.queueName, { durable: true });
        await this.channel.bindQueue(this.queueName, this.exchange, 'auth.#');

        this.isConnecting = false;
        this.reconnectAttempts = 0;
    } catch (error) {
        console.log('Failed to connect to RabbitMQ: ', error);
        this.isConnecting = false;
        await this.#attemptReconnect();
        throw new Error(error);
    }
  }


  async #attemptReconnect() {
    this.channel = null;
    this.connection = null;
    if (this.reconnectAttempts >= MAX_RECONN_ATTEMPTS)
    {
      console.log('Reached max reconnection attempts');
      return ;
    }
    this.reconnectAttempts++;
    const delay = this.reconnectAttempts * RECONN_DELAY;
    console.log(`Reconnecting in ${delay / 1000}s, attempt ${this.reconnectAttempts}...`)
    setTimeout(async () => {
      await this.connect(); 
    }, delay);
  }

  async produceMessage(message, routingKey) {
    try {

      if (!this.channel)
        await this.connect();

      this.channel.publish(
        this.exchange,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
      );

    } catch (error) {
        console.log('Error producing messages.', error);
        throw new Error(error);
    }
  }

  async consumeMessages(handleMessage) {
    try {
      if (!this.channel)
        await this.connect();

      await this.channel.assertQueue(this.queueName, { durable: true });
      this.channel.prefetch(1);
      this.channel.consume(this.queueName, async (msg) => {
        if (msg !== null)
        {
          try {
            const payload = JSON.parse(msg.content.toString())
            handleMessage(payload)
            this.channel.ack(msg);
          } catch (error) {
            console.log('Error handling message: ', error);
            this.channel.nack(msg, false, false);
          }
        }
      })
    } catch (error) {
        console.log('Error consuming messages.');
        throw new Error(error);
    }
  }

  async close() {
    if (this.channel){
      await this.channel.close();
      this.channel = null;
    }
    if (this.connection) {
      await this.connection.close();
      this.connection = null; 
    }
  }
}

export default RabbitMQClient;