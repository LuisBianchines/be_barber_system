import { app } from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';

async function main() {
  await prisma.$connect();
  console.log('Banco de dados conectado.');

  app.listen(env.port, () => {
    console.log(`Servidor rodando na porta ${env.port} [${env.nodeEnv}]`);
  });
}

main().catch((err) => {
  console.error('Falha ao iniciar servidor:', err);
  process.exit(1);
});
