from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path
from typing import Iterable

import duckdb

DEFAULT_DB = Path(r"F:\GEO_MAG\Magisterij\github_clone\Kolesarske-test\db\kolesarske.duckdb")
DEFAULT_OUT = Path("data") / "windows.geojson"
DEFAULT_PARQUET_GLOB = "data/windows_parquet/**/*.parquet"

INDEX_FIELDS = [
    "dci_acc_raw",
    "dci_lin_recon_raw",
    "bri_speedcorr",
    "fii_max",
    "rms_lin_z_mps2",
    "std_lin_z_mps2",
    "p95_abs_lin_z_mps2",
    "mean_abs_lin_z_mps2",
]

EXTRA_FIELDS = [
    "time_center_s",
    "dist_center_m",
    "mean_speed_kmh",
    "window_start_s",
    "window_end_s",
    "ride_id",
    "algo_version",
]


def _ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def _rows_to_geojson(rows: Iterable[tuple], columns: list[str]) -> dict:
    idx_lat = columns.index("lat")
    idx_lon = columns.index("lon")

    features = []
    for row in rows:
        lat = row[idx_lat]
        lon = row[idx_lon]
        if lat is None or lon is None:
            continue

        props = {columns[i]: row[i] for i in range(len(columns)) if i not in (idx_lat, idx_lon)}
        features.append(
            {
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [lon, lat]},
                "properties": props,
            }
        )

    return {"type": "FeatureCollection", "features": features}


def _resolve_parquet_glob(db_path: Path, parquet_glob: str | None) -> str:
    if parquet_glob:
        return parquet_glob
    base = db_path.parent.parent
    return str((base / DEFAULT_PARQUET_GLOB).resolve())


def export_geojson(
    db_path: Path,
    out_path: Path,
    ride_id: str | None,
    limit: int | None,
    parquet_glob: str | None,
) -> int:
    if not db_path.exists():
        raise FileNotFoundError(f"DuckDB not found: {db_path}")

    fields = ["lat_center_deg AS lat", "lon_center_deg AS lon"]
    fields += INDEX_FIELDS
    fields += EXTRA_FIELDS

    parquet_path = _resolve_parquet_glob(db_path, parquet_glob)
    sql = (
        "SELECT "
        + ", ".join(fields)
        + " FROM read_parquet(?)"
        + " WHERE lat_center_deg IS NOT NULL AND lon_center_deg IS NOT NULL"
    )
    params = []
    params.append(parquet_path)
    if ride_id:
        sql += " AND ride_id = ?"
        params.append(ride_id)
    if limit:
        sql += " LIMIT ?"
        params.append(int(limit))

    con = duckdb.connect(str(db_path))
    try:
        res = con.execute(sql, params)
        rows = res.fetchall()
        columns = [c[0] for c in res.description]
    finally:
        con.close()

    geojson = _rows_to_geojson(rows, columns)
    _ensure_parent(out_path)
    out_path.write_text(json.dumps(geojson, ensure_ascii=False), encoding="utf-8")
    return len(geojson["features"])


def git_commit_and_push(repo_root: Path, out_path: Path, message: str) -> None:
    rel_path = out_path.relative_to(repo_root)
    subprocess.run(["git", "-C", str(repo_root), "add", str(rel_path)], check=True)
    subprocess.run(["git", "-C", str(repo_root), "commit", "-m", message], check=True)
    subprocess.run(["git", "-C", str(repo_root), "push"], check=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Export DuckDB windows to GeoJSON and optionally push to GitHub.")
    parser.add_argument("--db", type=Path, default=DEFAULT_DB, help="Path to DuckDB file")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT, help="Output GeoJSON path (relative to repo root)")
    parser.add_argument(
        "--parquet-glob",
        type=str,
        default=None,
        help="Override parquet glob (e.g. F:/.../data/windows_parquet/**/*.parquet)",
    )
    parser.add_argument("--ride-id", type=str, default=None, help="Filter by ride_id")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of points")
    parser.add_argument("--push", action="store_true", help="Commit and push GeoJSON to GitHub")
    parser.add_argument("--message", type=str, default="Update GeoJSON export", help="Commit message when pushing")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    out_path = args.out
    if not out_path.is_absolute():
        out_path = repo_root / out_path

    count = export_geojson(args.db, out_path, args.ride_id, args.limit, args.parquet_glob)
    print(f"[OK] GeoJSON exported: {out_path} ({count} points)")

    if args.push:
        git_commit_and_push(repo_root, out_path, args.message)
        print("[OK] Pushed to GitHub.")


if __name__ == "__main__":
    main()
