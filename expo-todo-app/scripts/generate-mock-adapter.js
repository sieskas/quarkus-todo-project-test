#!/usr/bin/env node
/**
 * Generates MockTodoAdapter.ts from api-spec.json
 * Detects schemas and CRUD operations, maps types to faker calls.
 */

const fs = require('fs');
const path = require('path');

const SPEC_PATH = path.join(__dirname, '../api-spec.json');
const OUTPUT_PATH = path.join(__dirname, '../src/outcall/taskmanager/mocks/MockTodoAdapter.ts');

const spec = JSON.parse(fs.readFileSync(SPEC_PATH, 'utf-8'));
const schemas = spec.components?.schemas ?? {};
const paths = spec.paths ?? {};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveRef(ref) {
    const name = ref.replace('#/components/schemas/', '');
    return { name, schema: schemas[name] };
}

function fakerCallForField(fieldName, fieldSchema) {
    const name = fieldName.toLowerCase();
    const type = fieldSchema.type;
    const format = fieldSchema.format;

    if (name === 'id') return 'nextId++';
    if (type === 'boolean') return 'faker.datatype.boolean()';
    if (type === 'integer' || type === 'number') return 'faker.number.int({ min: 1, max: 1000 })';
    if (type === 'string') {
        if (format === 'date' || format === 'date-time' || name.includes('date') || name.includes('time') || name.includes('created') || name.includes('updated'))
            return 'faker.date.recent().toISOString()';
        if (name.includes('email')) return 'faker.internet.email()';
        if (name.includes('url') || name.includes('image') || name.includes('avatar')) return 'faker.internet.url()';
        if (name.includes('title') || name.includes('name') || name.includes('label')) return 'faker.lorem.words(3)';
        if (name.includes('description') || name.includes('desc') || name.includes('content') || name.includes('body') || name.includes('text') || name.includes('note'))
            return 'faker.lorem.sentence()';
        if (name.includes('phone')) return 'faker.phone.number()';
        if (name.includes('color') || name.includes('colour')) return 'faker.color.human()';
        return 'faker.lorem.word()';
    }
    return 'undefined';
}

function generateFakerObject(schemaName) {
    const schema = schemas[schemaName];
    if (!schema?.properties) return '{}';
    const fields = Object.entries(schema.properties)
        .map(([k, v]) => `        ${k}: ${fakerCallForField(k, v)}`)
        .join(',\n');
    return `{\n${fields}\n    }`;
}

// ─── Detect operations ────────────────────────────────────────────────────────

let responseSchemaName = null;
let requestSchemaName = null;
const operations = { getAll: null, create: null, update: null, delete: null, getById: null };

for (const [pathUrl, methods] of Object.entries(paths)) {
    const isCollection = !pathUrl.includes('{');
    const hasId = pathUrl.includes('{');

    for (const [method, op] of Object.entries(methods)) {
        const opId = op.operationId ?? '';

        // getAll: GET /resource (no id param, returns array)
        if (method === 'get' && isCollection) {
            const content = op.responses?.['200']?.content?.['application/json']?.schema;
            if (content?.type === 'array' && content.items?.$ref) {
                responseSchemaName = resolveRef(content.items.$ref).name;
                operations.getAll = opId;
            }
        }

        // create: POST /resource
        if (method === 'post' && isCollection) {
            const bodyRef = op.requestBody?.content?.['application/json']?.schema?.$ref
                ?? op.requestBody?.content?.['*/*']?.schema?.$ref;
            if (bodyRef) requestSchemaName = resolveRef(bodyRef).name;
            operations.create = opId;
        }

        // update: PUT /resource/{id}
        if (method === 'put' && hasId) operations.update = opId;

        // delete: DELETE /resource/{id}
        if (method === 'delete' && hasId) operations.delete = opId;

        // getById: GET /resource/{id}
        if (method === 'get' && hasId) operations.getById = opId;
    }
}

if (!responseSchemaName) {
    console.error('❌ Could not detect response schema from spec.');
    process.exit(1);
}

console.log(`✅ Response schema : ${responseSchemaName}`);
console.log(`✅ Request schema  : ${requestSchemaName ?? 'none'}`);
console.log(`✅ Operations      : ${Object.entries(operations).filter(([,v])=>v).map(([k,v])=>`${k}(${v})`).join(', ')}`);

// ─── Generate file ────────────────────────────────────────────────────────────

const reqType = requestSchemaName ?? responseSchemaName;
const fakerObj = generateFakerObject(responseSchemaName);

const output = `import { faker } from '@faker-js/faker';
import type { ${reqType}${reqType !== responseSchemaName ? `, ${responseSchemaName}` : ''} } from '../api/generated';
import type { ITodoAdapter } from '../TodoAdapter';

faker.seed(1);

let nextId = 1;

let store: ${responseSchemaName}[] = Array.from({ length: 5 }, () => (${fakerObj}));

export class MockTodoAdapter implements ITodoAdapter {
    getAllTodos(): Promise<${responseSchemaName}[]> {
        return Promise.resolve([...store]);
    }

    createTodo(body: ${reqType}): Promise<${responseSchemaName}> {
        const item: ${responseSchemaName} = { ...body, id: nextId++ } as ${responseSchemaName};
        store = [...store, item];
        return Promise.resolve(item);
    }

    updateTodo(id: number, body: ${reqType}): Promise<${responseSchemaName}> {
        store = store.map(t => t.id === id ? { ...t, ...body } : t);
        return Promise.resolve(store.find(t => t.id === id)!);
    }

    deleteTodo(id: number): Promise<void> {
        store = store.filter(t => t.id !== id);
        return Promise.resolve();
    }
}
`;

fs.writeFileSync(OUTPUT_PATH, output, 'utf-8');
console.log(`\n📝 Generated: ${OUTPUT_PATH}`);
