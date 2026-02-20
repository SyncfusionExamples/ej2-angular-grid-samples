import { productDetails } from "./data";
import { DataUtil, Query, DataManager, Predicate } from "@syncfusion/ej2-data";

DataUtil.serverTimezoneOffset = 0;

const resolvers = {
  Query: {
    /* Main query used by the grid (supports paging, sorting, filtering, searching. */ 
    getProducts: (parent, { datamanager }, context, info) => {
      console.log('getProducts called with:', datamanager);

      let orders = [...productDetails];
      const query = new Query();
       /*------------------------ 1. Filtering-----------------------------------*/
      const performFiltering = (filterString) => {
        const parsed = JSON.parse(filterString);

        /**
          * The parsed filter can be an array or a single object.
          * We normalize it here so we always work on the first element.
        */
        const predicateCollection = Array.isArray(parsed) ? parsed[0] : parsed;

        /* If no valid predicate structure exists, return the original query unchanged. */
        if (!predicateCollection || !Array.isArray(predicateCollection.predicates) || predicateCollection.predicates.length === 0) {
          return query; // nothing to apply
        }

        /* Determines whether multiple predicates should be combined using AND / OR. */ 
        const condition = (predicateCollection.condition || 'and').toLowerCase(); // 'and' | 'or'
        const ignoreCase = predicateCollection.ignoreCase !== undefined ? !!predicateCollection.ignoreCase : true;

        /*This variable will accumulate the full predicate chain*/
        let combined = null;

        /**
           * Loop through each predicate and convert it into Syncfusion Predicate objects.
           * Supports nested (complex) filter groups through recursive processing.
        */
        predicateCollection.predicates.forEach(p => {
          // If the format nests predicateCollections, handle recursively
          if (p.isComplex && Array.isArray(p.predicates)) {
            // Recursively build nested predicateCollection predicate
            const nested = buildNestedPredicate(p, ignoreCase);
            if (nested) {
              combined = combined
                ? (condition === 'or' ? combined.or(nested) : combined.and(nested))
                : nested;
            }
            return;
          }

          // Leaf predicate
          const pred = new Predicate(p.field, p.operator, p.value, ignoreCase);
          combined = combined
            ? (condition === 'or' ? combined.or(pred) : combined.and(pred))
            : pred;
        });

        /* Apply the final combined predicate to the Syncfusion Query object. */
        if (combined) {
          query.where(combined);
        }

        return query;
      };
      
       /**
         * Builds a nested Predicate structure from complex filter conditions.
         * This function is called recursively to handle multi-level filter logic.
         * (e.g., AND/OR combinations inside other AND/OR blocks).
         *
         * @param block - A complex filter object containing nested predicates.
         * @param ignoreCase - Whether string comparisons should ignore case.
         * @returns A merged Predicate representing the entire nested filter block.
        */
      function buildNestedPredicate(block, ignoreCase) {
        /* Determine whether this block uses "and" or "or" to merge its child predicates.*/
        const condition = (block.condition || 'and').toLowerCase();

        /* Will store the final combined Predicate after processing all nested items. */
        let mergedPredicate = null;

        /**
           * Loop through each predicate entry within the current block.
           * Each entry can be a simple predicate or another nested (complex) block.
        */
        block.predicates.forEach(p => {
          let node;
          if (p.isComplex && Array.isArray(p.predicates)) {
            node = buildNestedPredicate(p, ignoreCase);
          } else {
            node = new Predicate(p.field, p.operator, p.value, ignoreCase);
          }
          if (node) {
            mergedPredicate = mergedPredicate
              ? (condition === 'or' ? mergedPredicate.or(node) : mergedPredicate.and(node))
              : node;
          }
        });

        return mergedPredicate;
      }
  
      /*----------- 2. Searching------------------------------------*/
      const performSearching = (searchParam) => {
        const { fields, key } = JSON.parse(searchParam)[0];
        query.search(key, fields);
      }
     
      /*-----------------3. Sorting-----------------------------------*/
     const performSorting = (sorted) => {
        for (let i = 0; i < sorted.length; i++) {
          const { name, direction } = sorted[i];
          query.sortBy(name, direction);
        }
      }

       /* Apply all operations */
      if (datamanager.where) {
        performFiltering(datamanager.where);
      }
      if (datamanager.search) {
        performSearching(datamanager.search);
      }
      if (datamanager.sorted) {
        performSorting(datamanager.sorted);
      }

      /* Execute filtering/sorting/search first. */
      const filteredData = new DataManager(orders).executeLocal(query);

       /* Total count after filtering */
      const count = filteredData.length;

      /*-------------------- 4. Paging----------------------------------*/
      let result = filteredData;

      if (datamanager.take !== undefined) {
        const skip = datamanager.skip || 0;
        const take = datamanager.take;

        query.page(skip / take + 1, take);
        result = new DataManager(filteredData).executeLocal(query);
      }

      return {
        result,
        count
      };
    },

     /* Query to get a single product by ID. */
    getProductById: (parent, { datamanager }) => {
      console.log('getProductById called with datamanager:', datamanager);

      let id = null;
      if (datamanager && datamanager.params) {
        try {
          const paramsObj = JSON.parse(datamanager.params);
          id = paramsObj.id;
        } catch (e) {
          console.error('Failed to parse params:', datamanager.params);
        }
      }

      if (!id) return null;

      const product = productDetails.find(p => p.productId === id);
      return product || null;
    }

  },

  Mutation: {
    /**
     * Create a new product.
     *
     * @param _parent - Unused, kept for GraphQL resolver signature consistency.
     * @param args - Arguments containing the `value` payload for the new product.
     * @returns The newly created product object.
     */
    createProduct: (parent, { value }, context, info) => {
      productDetails.push(value);
      return value;
    },

     /**
     * Update an existing product by key.
     * @param args - Arguments containing `key`, optional `keyColumn`, and `value` (partial update).
     * @returns The updated product object.
     *
     * Behavior:
     * - Defaults `keyColumn` to "productId" if not provided.
     * - Finds the product using the provided key + keyColumn.
     * - Performs a shallow merge (Object.assign) to update fields.
     * 
     * Caution:
     * - `Object.assign` mutates the found object. If immutability is required,
     *   consider replacing the item in the array with a new object instead.
     */

    updateProduct: (parent, { key, keyColumn, value }, context, info) => {
      const product = productDetails.find(p => p.productId === key);
      if (!product) throw new Error("Product not found");

      Object.assign(product, value);
      return product;
    },

    /**
     * Delete an existing product by key.
     * @param args - Arguments containing `key` and optional `keyColumn`.
     * @returns The deleted product object (commonly useful for confirmations/audits).
     *
     * Behavior:
     * - Finds the index of the matching product.
     * - Removes it from the in-memory array using `splice`.
     * - Returns the removed entity.
     */   
    deleteProduct: (parent, { key, keyColumn = 'productId' }, context, info) => {
      const idx = productDetails.findIndex(p => String(p[keyColumn]) === String(key));
      if (idx === -1) throw new Error('Product not found');
      const [deleted] = productDetails.splice(idx, 1);
      return deleted;
    }

  }
};

export default resolvers;