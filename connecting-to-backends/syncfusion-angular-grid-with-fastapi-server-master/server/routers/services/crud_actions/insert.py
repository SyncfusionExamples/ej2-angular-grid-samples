from typing import Any, Callable, Dict, List

from fastapi.responses import JSONResponse


def handle_insert(payload: Dict[str, Any], products: List[Dict[str, Any]], save_products: Callable[[], None], fields_meta: Dict[str, str]) -> JSONResponse:
    """Insert a record and persist it."""
    record = payload.get('value') or payload
    new_id = max([o.get('id', 0) for o in products] or [0]) + 1
    record['id'] = new_id

    for k in fields_meta.keys():
        if k not in record and k != 'id':
            record[k] = None

    products.append(record)
    save_products()
    return JSONResponse(record)
