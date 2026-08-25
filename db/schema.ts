import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const students = sqliteTable('students', {
  id: integer('id').primaryKey({ autoIncrement: true }), studentCode: text('student_code').notNull(), fullName: text('full_name').notNull(), className: text('class_name').notNull(), parentName: text('parent_name').notNull(), phone: text('phone').notNull(), status: text('status').notNull().default('Faol'), createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
}, (table) => [uniqueIndex('students_code_unique').on(table.studentCode), index('students_class_idx').on(table.className)]);
export const requests = sqliteTable('requests', {
  id: integer('id').primaryKey({ autoIncrement: true }), ticketNo: text('ticket_no').notNull(), requester: text('requester').notNull(), category: text('category').notNull(), subject: text('subject').notNull(), status: text('status').notNull().default('Yangi'), priority: text('priority').notNull().default('O‘rta'), dueDate: text('due_date').notNull(), createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
}, (table) => [uniqueIndex('requests_ticket_unique').on(table.ticketNo), index('requests_status_due_idx').on(table.status, table.dueDate)]);
export const inventory = sqliteTable('inventory', {
  id: integer('id').primaryKey({ autoIncrement: true }), inventoryCode: text('inventory_code').notNull(), itemName: text('item_name').notNull(), room: text('room').notNull(), condition: text('condition').notNull().default('Soz'), priority: text('priority').notNull().default('Past'), assignee: text('assignee').notNull(), createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
}, (table) => [uniqueIndex('inventory_code_unique').on(table.inventoryCode), index('inventory_condition_idx').on(table.condition)]);
