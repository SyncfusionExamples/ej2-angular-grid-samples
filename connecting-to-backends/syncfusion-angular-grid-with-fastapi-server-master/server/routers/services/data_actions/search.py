from typing import Any, Dict, List

from .filter import json_or_value, normalize_operator, to_bool, compare


def apply_search(items: List[Dict[str, Any]], payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Apply DataManager search blocks."""
    search_blocks = payload.get('search')
    if not search_blocks:
        if isinstance(search_blocks, str):
            term = search_blocks.lower()
            default_fields = ['productName', 'sku', 'category']
            return [
                it for it in items
                if any(isinstance(it.get(f), str) and term in it.get(f, '').lower() for f in default_fields)
            ]
        return items

    sb = json_or_value(search_blocks)
    if isinstance(sb, dict):
        sb = [sb]
    if not isinstance(sb, list) or not sb:
        return items

    filtered = items
    for block in sb:
        fields = block.get('fields') or ([] if not block.get('field') else [block.get('field')])
        operator_name = normalize_operator(block.get('operator') or 'contains')
        search_term = block.get('key') or block.get('searchKey')
        ignore_case = to_bool(block.get('ignoreCase'), True)
        if not fields or search_term is None:
            continue

        def block_match(it: Dict[str, Any]) -> bool:
            return any(compare(f, operator_name, it.get(f), search_term, ignore_case) for f in fields)

        filtered = [it for it in filtered if block_match(it)]

    return filtered
