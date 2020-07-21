import { Client } from '@typeit/discord'
import { config } from 'dotenv'

config()

async function main() {
  const client = new Client({
    classes: [`${__dirname}/discord.ts`, `${__dirname}/discord.js`],
    silent: false,
    variablesChar: ':',
  })

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await client.login(process.env.DISCORD_KEY!)

  setTimeout(() => {
    client.user?.setStatus('online')
    client.user?.setActivity({
      name: 'your punishment',
      type: 'WATCHING',
    })
  }, 1000)

  const shutdown = async () => {
    console.log('Shutting down...')

    await client.user?.setPresence({
      status: 'invisible',
    })

    client.destroy()
    process.exit()
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

main()
