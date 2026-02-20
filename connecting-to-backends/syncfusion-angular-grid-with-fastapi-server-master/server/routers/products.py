from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from typing import Any, Dict, List
import json
import os
from pathlib import Path

from .services.data_actions.search import apply_search
from .services.data_actions.filter import apply_where
from .services.data_actions.sort import apply_sorting
from .services.data_actions.select import apply_select
from .services.data_actions.page import apply_paging

from .services.crud_actions.insert import handle_insert
from .services.crud_actions.update import handle_update
from .services.crud_actions.remove import handle_remove


router = APIRouter()

DATA_FILE = Path(__file__).resolve().parent.parent / 'products_data.json'

FIELDS_META = {
    'id': 'int',
    'productName': 'str',
    'category': 'str',
    'sku': 'str',
    'price': 'float',
    'stock': 'int',
    'status': 'str',
}


def _load_products() -> List[Dict[str, Any]]:
    """Load products from disk."""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return []
    return []


PRODUCTS: List[Dict[str, Any]] = _load_products()


def save_products() -> None:
    """Persist products to disk."""
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(PRODUCTS, f, indent=2)
    except Exception:
        pass


DM_READ_KEYS = {'requiresCounts', 'skip', 'take', 'sorted', 'where', 'search', 'select'}


def is_dm_read(payload: Dict[str, Any]) -> bool:
    """Detect a Syncfusion DataManager READ payload."""
    return any(k in payload for k in DM_READ_KEYS)


def to_bool(value: Any, default: bool = False) -> bool:
    """Convert common types to bool."""
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() in ('true', '1', 'yes', 'y')
    if isinstance(value, (int, float)):
        return bool(value)
    return default


@router.get('/')
def list_products_get():
    """Reject GET to enforce POST-only transport."""
    raise HTTPException(status_code=405, detail='GET not supported; use POST with UrlAdaptor payload to /products/')


@router.post('/')
def list_or_crud(payload: Dict[str, Any]):
    """Route DataManager READ or CRUD actions based on the POST body."""
    if is_dm_read(payload):
        try:
            skip = int(payload.get('skip', 0))
        except Exception:
            skip = 0

        try:
            take = int(payload.get('take', 12))
        except Exception:
            take = 12

        requires_counts = to_bool(payload.get('requiresCounts'), False)

        items = PRODUCTS[:]
        items = apply_search(items, payload)
        items = apply_where(items, payload.get('where'))

        total_count = len(items)
        items = apply_sorting(items, payload.get('sorted'))

        select_fields = payload.get('select')
        if select_fields is not None:
            data, count = apply_select(items, select_fields, skip, take)
            return JSONResponse({'result': data, 'count': count} if requires_counts else data)

        data = apply_paging(items, skip, take)
        return JSONResponse({'result': data, 'count': total_count} if requires_counts else data)

    action = payload.get('action')
    if action == 'insert':
        return handle_insert(payload, PRODUCTS, save_products, FIELDS_META)
    if action == 'update':
        return handle_update(payload, PRODUCTS, save_products)
    if action == 'remove':
        return handle_remove(payload, PRODUCTS, save_products)

    new_id = max([o.get('id', 0) for o in PRODUCTS] or [0]) + 1
    payload['id'] = new_id
    PRODUCTS.append(payload)
    save_products()
    return JSONResponse(payload)
