import {Global, Module} from '@nestjs/common';
import {RemoveOnetimeCodeService} from "./remove-onetime-code.service";
import {TemporaryDataService} from "./temporary-data.service";

@Global()
@Module({
  imports: [],
  providers: [TemporaryDataService, RemoveOnetimeCodeService],
  exports: [TemporaryDataService, RemoveOnetimeCodeService]
})
export class TasksModule {}
