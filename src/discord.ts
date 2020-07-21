import { Discord, Command, CommandMessage } from '@typeit/discord';
import parseDuration from 'parse-duration';

const FUNNY_NUMBER = 420_69_000;

@Discord()
export abstract class CornerDiscord {
  @Command('corner :time')
  private async corner(message: CommandMessage) {
    if (
      message.member?.roles.cache.find((each) => each.name === 'Corner Abuser')
    ) {
      return message.reply(
        'you have abused the corner and cannot corner others!',
      );
    }

    if (message.member?.voice.channel?.name === 'The Corner') {
      return message.reply('you can\'t bring others down with you!');
    }

    const { time } = message.args as Record<string, string>;
    const users = message.mentions.users.map(
      (each) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        message.guild!.members.cache.find(
          (cached) =>
            cached.user.username === each.username &&
            cached.user.tag === each.tag,
        )!,
    );

    if (users.some((user) => user.voice.channelID === undefined)) {
      return message.reply(
        'you cannot corner users that are not in a voice channel!',
      );
    }

    if (!users.length) {
      return message.reply('you must specify users to put in the corner!');
    }

    let duration: number;
    try {
      duration = parseDuration(time) || 0;
    } catch {
      return message.reply(
        'you must specify and appropriate duration! (ie. 30s or 1m)!',
      );
    }

    if (duration != FUNNY_NUMBER) {
      if (duration < 1_000) {
        return message.reply(
          'you cannot put people into the corner for less than a second!',
        );
      }

      if (duration > 60_000) {
        return message.reply(
          'you cannot put people into the corner for longer than a minute!',
        );
      }
    }

    const theCorner = message.guild?.channels.cache.find(
      (each) => each.name === 'The Corner',
    );

    if (!theCorner) {
      return message.reply(
        'your server must have a channel called "The Corner" to put users into!',
      );
    }

    const inTheCorner = message.guild?.roles.cache.find(
      (each) => each.name === 'In The Corner',
    );

    if (!inTheCorner) {
      return message.reply(
        'your server must have a role called "In The Corner" that holds users captive!',
      );
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const usernames = new Intl.ListFormat('en-US', {
      style: 'long',
      type: 'conjunction',
    }).format(
      users.map(
        (each) => `<@${each.user.id}>`,
      ),
    );

    message.channel.send(
      `${usernames} ${users.length > 1 ? 'are' : 'is'} being punished!`,
    );

    return Promise.all(
      users.map(async (each) => {
        if (each.roles.cache.find((each) => each.name === 'In The Corner'))
          return;

        const previous = each.voice.channel;

        await each.roles.add(inTheCorner);
        if (each.voice.channelID) await each.voice.setChannel(theCorner);

        return new Promise((res) => {
          setTimeout(
            async () => {
              if (duration === FUNNY_NUMBER)
                message.channel.send('Just kidding, that\'s bullying');

              await each.roles.remove(inTheCorner);

              if (each.voice.channelID) await each.voice.setChannel(previous);

              res();
            },
            duration === FUNNY_NUMBER ? 15_000 : duration,
          );
        });
      }),
    );
  }
}
