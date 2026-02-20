export interface ExpenseRecord {
  expenseId: string;              // ID!
  employeeName: string;           // String!
  employeeEmail: string;          // String!
  employeeAvatarUrl?: string | null;
  department: string;             // String!
  category: string;               // String!
  description?: string | null;
  receiptUrl?: string | null;
  amount: number;                 // Float!
  taxPct: number;                 // Float!
  totalAmount: number;            // Float!
  expenseDate: string;            // String!  (usually ISO date string)
  paymentMethod: string;          // String!
  currency: string;               // String!
  reimbursementStatus: string;    // String!
  isPolicyCompliant: boolean;     // Boolean!
  tags: string[];                 // [String!]!
}

export interface ExpenseInput {
  expenseId?: string | null;      // ID (optional – often generated server-side)
  employeeName?: string | null;
  employeeEmail?: string | null;
  employeeAvatarUrl?: string | null;
  department?: string | null;
  category?: string | null;
  description?: string | null;
  receiptUrl?: string | null;
  amount?: number | null;
  taxPct?: number | null;
  totalAmount?: number | null;
  expenseDate?: string | null;
  paymentMethod?: string | null;
  currency?: string | null;
  reimbursementStatus?: string | null;
  isPolicyCompliant?: boolean | null;
  tags?: string[] | null;
}

export interface AvatarEntry {
  FileName: string;
  Base64Data: string;
}

export type JsonLike =
  | string
  | number
  | boolean
  | null
  | JsonLike[]
  | { [key: string]: JsonLike };
  
export interface AddExpenseArgs {
  value: Partial<ExpenseRecord>;
}

export interface UpdateExpenseArgs {
  key: string;
  value: Partial<ExpenseRecord>;
}
