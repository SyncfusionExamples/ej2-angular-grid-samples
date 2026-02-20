import GraphQLJSON from 'graphql-type-json';
import { DataManager, Query, DataUtil, Predicate } from '@syncfusion/ej2-data';
import { DataStateChangeEventArgs, SearchSettingsModel } from '@syncfusion/ej2-grids';
import { expenses } from './data';
import { ExpenseInput, ExpenseRecord, UpdateExpenseArgs } from './types';

DataUtil.serverTimezoneOffset = 0;



// ---------- Utility helpers ----------
function parseArg<T>(arg?: string | T): T | undefined {
  if (arg === undefined || arg === null) return undefined;
  if (typeof arg === 'string') {
    try {
      return JSON.parse(arg) as T;
    } catch {
      return undefined;
    }
  }
  return arg;
}

function buildPredicate(predicate: Predicate): Predicate | null {
  if (!predicate) return null;

  if (predicate.isComplex && Array.isArray(predicate.predicates)) {
    const children = predicate.predicates
      .map((child) => buildPredicate(child))
      .filter((p): p is Predicate => Boolean(p));

    if (!children.length) return null;

    return children.reduce((acc, curr, idx) => {
      if (idx === 0) return curr;
      return predicate.condition?.toLowerCase() === 'or'
        ? acc.or(curr)
        : acc.and(curr);
    });
  }

  if (predicate.field) {
    return new Predicate(
      predicate.field,
      predicate.operator,
      predicate.value,
      predicate.ignoreCase,
      predicate.ignoreAccent
    );
  }

  return null;
}

// ---------- Feature-specific helpers ----------
function performFiltering(
  query: Query,
  datamanager?: DataStateChangeEventArgs
) {
  const whereArg = parseArg<Predicate[]>(datamanager?.where as Predicate[]);
  if (Array.isArray(whereArg) && whereArg.length) {
    const rootPredicate = buildPredicate(whereArg[0] as Predicate);
    if (rootPredicate) {
      query.where(rootPredicate);
    }
  }
}

function performSearching(
  query: Query,
  datamanager?: DataStateChangeEventArgs
) {
  const searchArg = parseArg<SearchSettingsModel>(datamanager?.search as SearchSettingsModel);
  if (Array.isArray(searchArg) && searchArg.length) {
    const { fields, key, operator, ignoreCase } = searchArg[0];
    if (key && Array.isArray(fields) && fields.length) {
      query.search(key, fields, operator, ignoreCase);
    }
  }
}

function performSorting(
  query: Query,
  datamanager?: DataStateChangeEventArgs
) {
  const sortedArg = datamanager?.sorted;
  if (Array.isArray(sortedArg)) {
    sortedArg.forEach(({ name, direction }) => {
      query.sortBy(name as string, direction);
    });
  }
}

function performPaging(
  data: ExpenseRecord[],
  datamanager?: DataStateChangeEventArgs
): ExpenseRecord[] {
  if (
    typeof datamanager?.skip === 'number' &&
    typeof datamanager?.take === 'number'
  ) {
    const pageQuery = new Query().page(
      datamanager.skip / datamanager.take + 1,
      datamanager.take
    );
    return new DataManager(data).executeLocal(pageQuery) as ExpenseRecord[];
  }

  if (typeof datamanager?.take === 'number') {
    const pageQuery = new Query().page(1, datamanager.take);
    return new DataManager(data).executeLocal(pageQuery) as ExpenseRecord[];
  }

  return data;
}

// ---------- Resolvers ----------
export const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    
  /**
   * Retrieves expenses using Syncfusion DataManager semantics.
   *
   * Behavior:
   * - Clones the in-memory dataset.
   * - Builds a `Query` and applies filtering, searching, and sorting
   *   based on the incoming `datamanager` (Syncfusion `DataStateChangeEventArgs`).
   * - Executes the query locally to get the transformed dataset.
   * - Computes the total `count` **before paging** (used for grid pagination).
   * - Applies paging and returns the current page `result` along with `count`.
   *
   * @param _ - Unused. Present to satisfy the GraphQL resolver signature.
   * @param datamanager - Grid state (filtering, searching, sorting, skip/take, etc.).
   * @returns An object containing the paged `result` and the total `count` (pre-paging).
   */
    getExpenses: (
      _: unknown,
      { datamanager }: { datamanager: DataStateChangeEventArgs }
    ): { result: ExpenseRecord[]; count: number } => {
      let data: ExpenseRecord[] = [...expenses];
      let result;
      const query = new Query();

      performFiltering(query, datamanager);
      performSearching(query, datamanager);
      performSorting(query, datamanager);

      /* Apply filter/search/sort locally using DataManager. */
      result = new DataManager(data).executeLocal(query) as ExpenseRecord[];
      const count = data.length;

      /* Apply paging (skip/take) as the last step. */
      result = performPaging(data, datamanager);

      /*  Return the current page along with the total item count. */
      return { result, count };
    },
  },
  Mutation: {
     
    /**
     * Creates a new expense record.
     *
     * Behavior:
     * - Accepts an `ExpenseInput` object as `value`.
     * - Pushes the object directly into the in‑memory `expenses` array.
     * - Does not auto‑generate fields (e.g., `expenseId`); the client must supply them.
     * - Returns the newly added expense as-is.
     *
     * @param _ - Unused. Present only to satisfy the GraphQL resolver signature.
     * @param value - The full expense payload to insert into the dataset.
     * @returns The newly created `ExpenseRecord`.
    */
    addExpense: (_: unknown, { value }: { value: ExpenseInput }): ExpenseRecord => { 
      expenses.push(value as ExpenseRecord);
      return value as ExpenseRecord;;
    },

     
    /**
     * Updates an existing expense by its `expenseId` (provided as `key`).
     *
     * Behavior:
     * - Locates the expense by matching `expenseId === key`.
     * - Performs a **shallow merge** of the provided partial `value` onto the existing record.
     * - Explicitly **ignores any `expenseId`** present in `value` to prevent ID changes.
     * - Throws an error if no matching expense is found.
     *
     * @param _ - Unused. Present to satisfy the GraphQL resolver signature.
     * @param key - The identifier of the expense to update (matches `expenseId`).
     * @param value - Partial fields to merge into the existing expense (shallow).
     */
    updateExpense: (_: unknown, { key, value }: UpdateExpenseArgs): ExpenseRecord => {
      const index = expenses.findIndex((item) => item.expenseId === key);
      if (index === -1) {
        throw new Error('Expense not found');
      }

      const existing = expenses[index];
        
      // Prevent `expenseId` from being updated even if it's included in `value`.
      // Keep the rest of the fields for merging.
      const { expenseId: _ignore, ...rest } = value;

      //Shallow merge: top-level fields only. Nested objects (if any) won't deep-merge.
      const updated: ExpenseRecord = { ...existing, ...rest };
      expenses[index] = updated;

      return updated;
    },

    
    /**
     * Deletes an expense by its `expenseId` (provided as `key`).
     *
     * Behavior:
     * - Searches for the record where `expenseId === key`.
     * - If not found, returns `false` (no deletion performed).
     * - If found, removes the record from the in-memory `expenses` array and returns `true`.
     *
     * @param _ - Unused. Present to satisfy the GraphQL resolver signature.
     * @param key - The identifier of the expense to delete (matches `expenseId`).
     * @returns `true` if the record was deleted; otherwise `false`.
     */
    deleteExpense: (_: unknown, { key }: { key: string }): boolean => {
          const index = expenses.findIndex((item) => item.expenseId === key);
          if (index === -1) return false;
          expenses.splice(index, 1);
          return true;
        },

  },
};