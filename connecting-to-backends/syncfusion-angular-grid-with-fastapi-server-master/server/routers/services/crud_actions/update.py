from typing import Any, Callable, Dict, List

from fastapi import HTTPException
from fastapi.responses import JSONResponse


def handle_update(payload: Dict[str, Any], products: List[Dict[str, Any]], save_products: Callable[[], None]) -> JSONResponse:
    """Update a record by key and persist it."""
    key = payload.get('key') or payload.get('id') or (payload.get('value') or {}).get('id')
    record = payload.get('value') or payload

    if key is None:
        raise HTTPException(status_code=400, detail='Missing key for update')

    for i, o in enumerate(products):
        if o.get('id') == key:
            updated = {**o, **record, 'id': key}
            products[i] = updated
            save_products()
            return JSONResponse(updated)

    raise HTTPException(status_code=404, detail=f'Record {key} not found')
