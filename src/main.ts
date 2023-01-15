import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {AnotherStrings} from "./shared/constants/another-strings";
import helmet from "helmet";

async function bootstrap() {
    const PORT = 3000;
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.use(helmet());

    const config = new DocumentBuilder()
        .setTitle('Backend on NestJS and MongoDB developer variant')
        .setDescription('REST API documentation')
        .setVersion(AnotherStrings.version)
        .addTag(AnotherStrings.name, AnotherStrings.description)
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Сюда JWT token после входа',
                in: 'header',
            },
            'authorization',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/swagger', app, document);
    // app.useGlobalPipes(new ClearMenuPipe())
    // app.useGlobalInterceptors(new ClearMenuInterceptor());
    await app.listen(PORT, () =>
        console.log(`Server was started on port ${PORT}`),
    );
}

bootstrap();
