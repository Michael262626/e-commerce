declare module 'bcrypt' {
    export function genSaltSync(rounds?: number): string;
    export function hashSync(data: string | Buffer, salt: string): string;
    export function hashSync(data: string | Buffer, rounds: number): string;
    export function compareSync(data: string | Buffer, encrypted: string): boolean;
    export function genSalt(rounds?: number): Promise<string>;
    export function hash(data: string | Buffer, saltOrRounds: string | number): Promise<string>;
    export function compare(data: string | Buffer, encrypted: string): Promise<boolean>;
  }
  