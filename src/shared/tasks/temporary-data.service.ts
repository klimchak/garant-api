import {Injectable} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export interface RegisterOneTimeDataModel{
    code: number;
    expired: number;
    taskDelete: boolean;
}

@Injectable()
export class TemporaryDataService {
    public get sessions(): Map<string, string> {
        return this._sessions;
    }
    public get registerSessions(): Map<string, RegisterOneTimeDataModel> {
        return this._registerSessions;
    }

    private _sessions: Map<string, string> = new Map<string, string>();
    private _registerSessions: Map<string, RegisterOneTimeDataModel> = new Map<string, RegisterOneTimeDataModel>();

    public async hashString(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    public async compareSecuredData(password: string, storedPasswordHash: string): Promise<boolean> {
        return bcrypt.compare(password, storedPasswordHash);
    }
}
