from typing import Any, Dict, List


def apply_paging(items: List[Dict[str, Any]], skip: int, take: int) -> List[Dict[str, Any]]:
    """Slice items for paging."""
    return items[skip: skip + take]
