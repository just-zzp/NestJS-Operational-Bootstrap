import fs from 'fs';
import path from 'path';

interface MigrationEntry {
    className: string;
    importPath: string;
}

const migrationsDir = path.resolve(
    process.cwd(),
    'src',
    'entity',
    'migrations',
);
const migrationsIndexPath = path.join(migrationsDir, 'index.ts');

function main(): void {
    const args = process.argv.slice(2);

    if (args.includes('--sync')) {
        const entries = syncMigrationIndex();
        console.log(`Synced ${entries.length} migration(s).`);
        return;
    }

    const migrationName = getMigrationName(args);
    if (!migrationName) {
        console.error(
            'Please provide a migration name: npm run migration:create -- AddExampleTable',
        );
        process.exitCode = 1;
        return;
    }

    const created = createMigrationFile(migrationName);
    const entries = syncMigrationIndex();

    console.log(`Created migration: ${created}`);
    console.log(`Synced ${entries.length} migration(s).`);
}

function getMigrationName(args: string[]): string | null {
    const nameOptionIndex = args.findIndex((arg) => arg === '--name');
    if (nameOptionIndex >= 0) {
        return args[nameOptionIndex + 1] ?? null;
    }

    const inlineNameOption = args.find((arg) => arg.startsWith('--name='));
    if (inlineNameOption) {
        return inlineNameOption.slice('--name='.length);
    }

    return args.find((arg) => !arg.startsWith('-')) ?? null;
}

function createMigrationFile(rawName: string): string {
    ensureMigrationsDir();

    const timestamp = Date.now();
    const migrationName = toPascalCase(rawName);
    const className = `${migrationName}${timestamp}`;
    const fileName = `${timestamp}-${migrationName}.ts`;
    const filePath = path.join(migrationsDir, fileName);

    if (fs.existsSync(filePath)) {
        throw new Error(`Migration file already exists: ${filePath}`);
    }

    fs.writeFileSync(filePath, getMigrationTemplate(className), 'utf8');

    return path.relative(process.cwd(), filePath);
}

function toPascalCase(input: string): string {
    const words = input
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean);

    if (words.length === 0) {
        throw new Error(
            'Migration name must contain at least one letter or digit.',
        );
    }

    const pascalCase = words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

    return /^[A-Za-z]/.test(pascalCase) ? pascalCase : `Migration${pascalCase}`;
}

function getMigrationTemplate(className: string): string {
    return `import type { MigrationInterface, QueryRunner } from 'typeorm';

export class ${className} implements MigrationInterface {
    name = '${className}';

    public async up(queryRunner: QueryRunner): Promise<void> {
        void queryRunner;
        // TODO: implement migration
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        void queryRunner;
        // TODO: revert migration
    }
}
`;
}

function syncMigrationIndex(): MigrationEntry[] {
    ensureMigrationsDir();

    const entries = fs
        .readdirSync(migrationsDir)
        .filter(isMigrationFile)
        .sort()
        .map(getMigrationEntry);

    fs.writeFileSync(migrationsIndexPath, getMigrationsIndexContent(entries));

    return entries;
}

function ensureMigrationsDir(): void {
    fs.mkdirSync(migrationsDir, { recursive: true });
}

function isMigrationFile(fileName: string): boolean {
    return (
        fileName.endsWith('.ts') &&
        !fileName.endsWith('.spec.ts') &&
        fileName !== 'index.ts'
    );
}

function getMigrationEntry(fileName: string): MigrationEntry {
    const filePath = path.join(migrationsDir, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const classNameMatch = fileContent.match(
        /export\s+class\s+([A-Za-z_$][A-Za-z0-9_$]*)/,
    );

    if (!classNameMatch) {
        throw new Error(`Migration class export was not found: ${filePath}`);
    }

    return {
        className: classNameMatch[1],
        importPath: `@src/entity/migrations/${path.basename(fileName, '.ts')}`,
    };
}

function getMigrationsIndexContent(entries: MigrationEntry[]): string {
    if (entries.length === 0) {
        return 'export const migrations = [];\n';
    }

    const imports = entries
        .map((entry) => {
            return `import { ${entry.className} } from '${entry.importPath}';`;
        })
        .join('\n');
    const migrationClasses = entries
        .map((entry) => `    ${entry.className},`)
        .join('\n');

    return `${imports}

export const migrations = [
${migrationClasses}
];
`;
}

main();
