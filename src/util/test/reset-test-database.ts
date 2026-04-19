import { DataSource } from 'typeorm';

export async function resetTestDatabase(dataSource: DataSource): Promise<void> {
    await dataSource.synchronize(true);
}
