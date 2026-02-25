from __future__ import annotations

from app.models import Bid

LOWER_IS_BETTER = {"price", "delivery_days"}
HIGHER_IS_BETTER = {"vendor_score", "compliance_score"}
SUPPORTED_FIELDS = LOWER_IS_BETTER | HIGHER_IS_BETTER


def _normalize(values: list[float], reverse: bool = False) -> list[float]:
    min_v = min(values)
    max_v = max(values)
    if min_v == max_v:
        return [1.0 for _ in values]

    if reverse:
        return [(max_v - v) / (max_v - min_v) for v in values]
    return [(v - min_v) / (max_v - min_v) for v in values]


def rank_bids(bids: list[Bid], weights: dict[str, float]) -> list[tuple[Bid, float]]:
    if not bids:
        return []

    if not weights:
        raise ValueError("weights are required")

    unknown = set(weights) - SUPPORTED_FIELDS
    if unknown:
        raise ValueError(f"unsupported criteria: {sorted(unknown)}")

    if abs(sum(weights.values()) - 1.0) > 1e-6:
        raise ValueError("weights must sum to 1.0")

    normalized: dict[str, list[float]] = {}
    for field in weights:
        values = [float(getattr(bid, field)) for bid in bids]
        normalized[field] = _normalize(values, reverse=field in LOWER_IS_BETTER)

    scored: list[tuple[Bid, float]] = []
    for index, bid in enumerate(bids):
        total = 0.0
        for field, weight in weights.items():
            total += normalized[field][index] * weight
        scored.append((bid, round(total, 4)))

    scored.sort(key=lambda pair: pair[1], reverse=True)
    return scored
