import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { config } from './config';

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      path: '/api/docs',
      documentation: {
        info: {
          title: 'Outlinr API Documentation',
          version: '1.0.0',
        },
      },
    })
  )
  .get('/health', () => ({ status: 'ok' }))
  .listen(config.env.PORT);

console.log(
  `Outinr-api is running at ${app.server?.hostname}:${app.server?.port}`
);
