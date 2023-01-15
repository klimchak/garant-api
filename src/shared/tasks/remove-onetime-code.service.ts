import {Inject, Injectable} from '@nestjs/common';
import {Cron, CronExpression} from "@nestjs/schedule";
import {TemporaryDataService} from "./temporary-data.service";

@Injectable()
export class RemoveOnetimeCodeService {
    // private readonly logger = new Logger(RemoveOnetimeCodeService.name);
    constructor(@Inject(TemporaryDataService) private temporaryDataService: TemporaryDataService) {
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    public handleCron(): void {
        // this.logger.debug('Called every 5 minutes');
        if (this.temporaryDataService.registerSessions.size > 0) {
            let keyForDelete: string[] = [];
            this.temporaryDataService.registerSessions.forEach((item, key) => {
                if (item.expired < Date.now()) {
                    keyForDelete.push(key);
                }
            });
            if (keyForDelete.length > 0) {
                keyForDelete.forEach((item) => this.temporaryDataService.registerSessions.delete(item));
            }
            // this.logger.debug('deleted key from onetime key code map', keyForDelete);
            console.log('deleted key from onetime key code map', this.temporaryDataService.registerSessions);
            keyForDelete = undefined;
        }
    }
}
