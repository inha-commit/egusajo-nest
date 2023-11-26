import { Injectable, Logger } from '@nestjs/common';
import { WebClient } from '@slack/web-api';

@Injectable()
export class SlackService {
  private logger: Logger;
  private web: WebClient;

  constructor() {
    this.logger = new Logger();
    this.web = new WebClient(process.env.SLACK_BOT_TOKEN);
  }

  private async sendMessage(channel: string, blocks: any[]) {
    try {
      if (process.env.NODE_ENV === 'production') {
        await this.web.chat.postMessage({ channel, blocks });
      }
    } catch (error) {
      this.logger.error(`메시지 전송에 실패했습니다: ${error.message}`);
    }
  }

  async newUser() {
    await this.sendMessage(process.env.SLACK_NEW_USER_CHANNEL_ID, [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: ':tada: *새로운 사용자가 가입했습니다!* :tada:',
        },
      },
    ]);
  }

  async sendApiLatency(method: string, url: string, time: number) {
    await this.sendMessage(process.env.SLACK_API_LATENCY_CHANNEL_ID, [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:alarm_clock: *API 2000ms 초과* :alarm_clock:\n\nmethod: ${method}\nURL: ${url}\ntime: ${time}ms`,
        },
      },
    ]);
  }

  async fatalError(error: any) {
    await this.sendMessage(process.env.SLACK_FATAL_ERROR_CHANNEL_ID, [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:fire: *치명적 에러가 발생했습니다* :fire:\n에러 내용: ${error}`,
        },
      },
    ]);
  }
}
