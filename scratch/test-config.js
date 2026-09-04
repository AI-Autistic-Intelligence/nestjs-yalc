import { ConfigModule } from '@nestjs/config';

const result = ConfigModule.forRoot({});
console.log('Result is Promise:', result instanceof Promise);
console.log(result);
