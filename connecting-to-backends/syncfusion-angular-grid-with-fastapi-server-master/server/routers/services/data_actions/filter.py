from typing import Any, Callable, Dict, List, Optional, Tuple
import json


FIELDS_META: Dict[str, str] = {
    'id': 'int',
    'productName': 'str',
    'category': 'str',
    'sku': 'str',
    'price': 'float',
    'stock': 'int',
    'status': 'str',
}


def to_bool(value: Any, default: bool = False) -> bool:
    """Convert common types to bool."""
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() in ('true', '1', 'yes', 'y')
    if isinstance(value, (int, float)):
        return bool(value)
    return default


def json_or_value(maybe_json: Any) -> Any:
    """Parse JSON strings when possible."""
    if isinstance(maybe_json, str):
        try:
            return json.loads(maybe_json)
        except Exception:
            return maybe_json
    return maybe_json


def normalize_operator(raw_operator: Optional[str]) -> str:
    """Normalize DataManager operator names."""
    if not raw_operator:
        return ''
    name = raw_operator.strip().lower()
    return {
        'equal': 'equal', '==': 'equal', 'eq': 'equal',
        'notequal': 'notequal', '!=': 'notequal', 'ne': 'notequal',
        'greaterthan': 'gt', 'gt': 'gt', '>': 'gt',
        'greaterthanorequal': 'gte', 'ge': 'gte', '>=': 'gte',
        'lessthan': 'lt', 'lt': 'lt', '<': 'lt',
        'lessthanorequal': 'lte', 'le': 'lte', '<=': 'lte',
        'contains': 'contains', 'startswith': 'startswith', 'endswith': 'endswith', 'like': 'like',
        'doesnotcontain': 'notcontains', 'notcontains': 'notcontains',
        'doesnotstartwith': 'notstartswith', 'doesnotendwith': 'notendswith',
        'in': 'in', 'notin': 'notin', 'between': 'between',
        'isnull': 'isnull', 'isnotnull': 'isnotnull', 'notnull': 'isnotnull',
        'isempty': 'isempty', 'isnotempty': 'isnotempty',
    }.get(name, name)


def coerce_value_for_field(field_name: str, raw_value: Any) -> Any:
    """Coerce values for comparisons."""
    if raw_value is None:
        return None
    t = FIELDS_META.get(field_name)
    try:
        if t == 'int':
            return int(raw_value)
        if t == 'float':
            return float(raw_value)
        if t == 'str' or t is None:
            return str(raw_value)
    except Exception:
        return raw_value
    return raw_value


def _like_pattern_to_match(op_value: Any) -> Tuple[str, Any]:
    """Convert % patterns to a match type."""
    if not isinstance(op_value, str):
        return 'exact', op_value
    raw = op_value
    starts = raw.startswith('%')
    ends = raw.endswith('%')
    inner = raw.strip('%')
    if starts and ends:
        return 'contains', inner
    if ends and not starts:
        return 'startswith', inner
    if starts and not ends:
        return 'endswith', inner
    if '%' in raw:
        return 'contains', raw.replace('%', '')
    return 'exact', raw


def compare(field: str, operator_name: str, left: Any, right: Any, ignore_case: bool) -> bool:
    """Compare a field value with an operator."""
    left_c = coerce_value_for_field(field, left)
    if isinstance(right, (list, tuple)):
        right_c = [coerce_value_for_field(field, v) for v in right]
    else:
        right_c = coerce_value_for_field(field, right)

    if isinstance(left_c, str) and isinstance(right_c, str) and ignore_case:
        left_c = left_c.lower()
        right_c = right_c.lower()

    if operator_name == 'equal':
        return left_c == right_c
    if operator_name == 'notequal':
        return left_c != right_c
    if operator_name == 'gt':
        return left_c > right_c
    if operator_name == 'gte':
        return left_c >= right_c
    if operator_name == 'lt':
        return left_c < right_c
    if operator_name == 'lte':
        return left_c <= right_c

    if operator_name == 'contains':
        return str(right_c) in str(left_c)
    if operator_name == 'startswith':
        return str(left_c).startswith(str(right_c))
    if operator_name == 'endswith':
        return str(left_c).endswith(str(right_c))
    if operator_name == 'like':
        kind, core = _like_pattern_to_match(right)
        if kind == 'contains':
            return str(core).lower() in str(left).lower() if ignore_case else str(core) in str(left)
        if kind == 'startswith':
            return str(left).lower().startswith(str(core).lower()) if ignore_case else str(left).startswith(str(core))
        if kind == 'endswith':
            return str(left).lower().endswith(str(core).lower()) if ignore_case else str(left).endswith(str(core))
        return str(left).lower() == str(core).lower() if ignore_case else str(left) == str(core)

    if operator_name == 'notcontains':
        return str(right_c) not in str(left_c)
    if operator_name == 'notstartswith':
        return not str(left_c).startswith(str(right_c))
    if operator_name == 'notendswith':
        return not str(left_c).endswith(str(right_c))

    if operator_name == 'in':
        return left_c in (right_c or [])
    if operator_name == 'notin':
        return left_c not in (right_c or [])

    if operator_name == 'between':
        if isinstance(right_c, list) and len(right_c) == 2:
            lo, hi = right_c[0], right_c[1]
            return lo <= left_c <= hi
        return True

    if operator_name == 'isnull':
        return left is None
    if operator_name == 'isnotnull':
        return left is not None
    if operator_name == 'isempty':
        return isinstance(left, str) and left == ''
    if operator_name == 'isnotempty':
        return isinstance(left, str) and left != ''

    return True


def _eval_leaf(item: Dict[str, Any], predicate: Dict[str, Any]) -> bool:
    """Evaluate a predicate leaf."""
    field_name = predicate.get('field')
    operator_name = normalize_operator(predicate.get('operator'))
    raw_value = predicate.get('value', None)
    ignore_case = to_bool(predicate.get('ignoreCase'), True)
    if not field_name:
        return True
    return compare(field_name, operator_name, item.get(field_name), raw_value, ignore_case)


def build_where(where_clause: Any) -> Callable[[Dict[str, Any]], bool]:
    """Build a callable from a where clause."""
    wc = json_or_value(where_clause)
    if wc is None:
        return lambda it: True

    if isinstance(wc, list):
        funcs = [build_where(p) for p in wc]
        return lambda it: all(f(it) for f in funcs)

    if isinstance(wc, dict):
        if wc.get('isComplex'):
            cond = (wc.get('condition') or 'and').strip().lower()
            preds = wc.get('predicates') or []
            funcs = [build_where(p) for p in preds]
            if cond == 'or':
                return lambda it: any(f(it) for f in funcs) if funcs else (lambda it: True)
            return lambda it: all(f(it) for f in funcs)
        return lambda it: _eval_leaf(it, wc)

    return lambda it: True


def apply_where(items: List[Dict[str, Any]], where_clause: Any) -> List[Dict[str, Any]]:
    """Filter items using a DataManager where clause."""
    if where_clause is None:
        return items
    predicate_fn = build_where(where_clause)
    return [it for it in items if predicate_fn(it)]
