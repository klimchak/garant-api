import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public get sessions(): Map<string, string> {
    return this._sessions;
  }

  private _sessions: Map<string, string> = new Map<string, string>();
  getHello(): string {
    return 'Hello World!';
  }
}
