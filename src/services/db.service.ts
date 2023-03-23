import { Injectable } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export default class DbService {
  private readonly pool: Pool;

  constructor() { 
    this.pool = new Pool({ connectionString: process.env.SQL_CONNECTION_STRING });
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    const client = await this.pool.connect(); 
    try {
      const result = await client.query(sql, params);
      return result;
    } 
    catch (err) {
      console.log(err);
    }
    finally {
      client.release();
    } 
  }
}