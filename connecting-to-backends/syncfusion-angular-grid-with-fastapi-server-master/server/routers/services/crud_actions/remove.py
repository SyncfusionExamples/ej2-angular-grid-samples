from typing import Any, Callable, Dict, List

from fastapi import HTTPException
from fastapi.responses import JSONResponse


def handle_remove(payload: Dict[str, Any], products: List[Dict[str, Any]], save_products: Callable[[], None]) -> JSONResponse:
    """Remove a record by key and persist it."""
    key = payload.get('key') or payload.get('id') or payload.get('record_id')

    if key is None:
        raise HTTPException(status_code=400, detail='Missing key for delete')

    for i, o in enumerate(products):
        if o.get('id') == key:
            deleted = products.pop(i)
            save_products()
            return JSONResponse(deleted)

    raise HTTPException(status_code=404, detail=f'Record {key} not found')
