import { WebClient } from '@slack/web-api';

export class SlackApiClient {
  private web: WebClient;

  constructor() {
    this.web = new WebClient(process.env.SLACK_BOT_TOKEN);
  }

  async newUser() {
    try {
      await this.web.chat.postMessage({
        channel: process.env.SLACK_NEW_USER_CHANNEL_ID,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: ':tada: *새로운 사용자가 가입했습니다!* :tada:',
            },
          },
        ],
      });
    } catch (error) {
      throw new Error(`메시지 전송에 실패했습니다: ${error.message}`);
    }
  }

  async sendApiLatency(method: string, url: string, time: number) {
    try {
      await this.web.chat.postMessage({
        channel: process.env.SLACK_API_LATENCY_CHANNEL_ID,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `:alarm_clock: *API 2000ms 초과* :alarm_clock:\n\nmethod: ${method}\nURL: ${url}\ntime: ${time}ms`,
            },
          },
        ],
      });
    } catch (error) {
      throw new Error(`메시지 전송에 실패했습니다: ${error.message}`);
    }
  }

  async fatalError(error: any) {
    try {
      await this.web.chat.postMessage({
        channel: process.env.SLACK_FATAL_ERROR_CHANNEL_ID,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `:fire: *치명적 에러가 발생했습니다* :fire:\n에러 내용: ${error}`,
            },
          },
        ],
      });
    } catch (error) {
      throw new Error(`메시지 전송에 실패했습니다: ${error.message}`);
    }
  }
}
