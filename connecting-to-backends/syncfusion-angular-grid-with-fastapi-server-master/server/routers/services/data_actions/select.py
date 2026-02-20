from typing import Any, Dict, List, Tuple

from .filter import json_or_value


def apply_select(items: List[Dict[str, Any]], select_fields: Any, skip: int, take: int) -> Tuple[List[Dict[str, Any]], int]:
    """Project fields, apply distinct, and page."""
    fields = json_or_value(select_fields)
    if not isinstance(fields, list) or not fields:
        return items[skip: skip + take], len(items)

    proj = [{f: it.get(f) for f in fields} for it in items]

    seen = set()
    distinct_rows: List[Dict[str, Any]] = []
    for row in proj:
        key = tuple(row.get(f) for f in fields)
        if key not in seen:
            seen.add(key)
            distinct_rows.append(row)

    total = len(distinct_rows)
    return distinct_rows[skip: skip + take], total
