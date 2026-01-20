import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
    constructor(
        private readonly config: ConfigService
    ) {}

    get env(): string {
        return this.config.get<string>("NODE_ENV", "development");
    }

    get database(): {
        name: string,
        host: string,
        port: number,
        username: string,
        password: string
    } {
        return {
            name: this.config.get<string>('DATABASE_NAME', "url_shortener"),
            host: this.config.get("DATABASE_HOST", "localhost"),
            port: Number(this.config.get("DATABASE_PORT", 5432)),
            username: this.config.get("DATABASE_USERNAME", "postgres"),
            password: this.config.get("DATABASE_PASSWORD", "password")
        };
   }

    get frontendUrl(): string {
        return this.config.get<string>('FRONTEND_URL', 'http://localhost:6000');
    }

    get port(): number {
        return this.config.get<number>('PORT', 6000);
    }

    get jwtSecret(): string {
        return this.config.get<string>('JWT_SECRET', 'secret_key');
    }
}
