from typing import Any, Dict, List

from .filter import json_or_value, coerce_value_for_field


def apply_sorting(items: List[Dict[str, Any]], sort_descriptors: Any) -> List[Dict[str, Any]]:
    """Apply DataManager sorting descriptors."""
    sd = json_or_value(sort_descriptors)
    if not isinstance(sd, list) or not sd:
        return items

    out = items[:]
    for desc in reversed(sd):
        if not isinstance(desc, dict):
            continue
        field = desc.get('name') or desc.get('field')
        direction = (desc.get('direction') or 'ascending').strip().lower()
        out.sort(key=lambda x: coerce_value_for_field(field, x.get(field)), reverse=(direction == 'descending'))
    return out
