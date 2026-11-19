#!/usr/bin/env python3
"""Shared paths, source registry and helpers for the state data pipeline.

The pipeline reads saved public source files (never a client's work product) and writes
one JSON per field group under research/states/data. The dossier build (build_state.py)
then renders src/data/states/<st>.json from those files plus the state's editorial file.

Source snapshots live outside the repository (they are large: the HRSA export alone is
274 MB). Set STATE_SOURCES to the folder that holds them; the default is the shared
research tree beside this repository's worktrees.
"""
import csv
import hashlib
import json
import os
import sys
from datetime import date, datetime
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
PIPE = REPO / 'research' / 'states'
DATA = PIPE / 'data'
EDITORIAL = PIPE / 'editorial'
OVERRIDES = PIPE / 'overrides'
SOURCES = Path(os.environ.get('STATE_SOURCES', REPO.parent / 'research' / 'dossiers' / '_sources'))

STATES = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California', 'CO': 'Colorado',
    'CT': 'Connecticut', 'DE': 'Delaware', 'DC': 'District of Columbia', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
    'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland', 'MA': 'Massachusetts',
    'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri', 'MT': 'Montana',
    'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico',
    'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
    'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota',
    'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington',
    'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
}
NAME_TO_CODE = {v: k for k, v in STATES.items()}

# Every source the pipeline reads. "file" is relative to SOURCES unless it starts with "repo:".
# "retrieved" is the snapshot date written into every figure's source line.
REGISTRY = {
    'opais': {
        'file': 'opais/OPA_CE_DAILY_PUBLIC.JSON',
        'name': 'HRSA 340B OPAIS covered entity daily export',
        'url': 'https://340bopais.hrsa.gov/reports (Covered Entity Daily Report, JSON)',
        'retrieved': '2026-09-29',
        'as_of': 'September 29, 2026',
    },
    'costreport_2023': {
        'file': 'cms_cost_reports/CostReport_2023_Final.csv',
        'name': 'CMS Hospital Provider Cost Report, 2023 file',
        'url': 'https://data.cms.gov/provider-compliance/cost-report/hospital-provider-cost-report',
        'retrieved': '2026-09-29',
    },
    'costreport_2024': {
        'file': 'cms_cost_reports/CostReport_2024_Final.csv',
        'name': 'CMS Hospital Provider Cost Report, 2024 file',
        'url': 'https://data.cms.gov/sites/default/files/2026-09/e85544f7-57ef-477e-9640-313ac0aac400/CostReport_2024_Final.csv',
        'retrieved': '2026-09-30',
    },
    'ahrq': {
        'file': 'ahrq_compendium/chsp-hospital-linkage-2023.csv',
        'name': 'AHRQ Compendium of U.S. Health Systems, 2023 hospital linkage file',
        'url': 'https://www.ahrq.gov/chsp/data-resources/compendium.html',
        'retrieved': '2026-09-30',
        'as_of': '2023',
    },
    'ipps_impact': {
        'file': 'cms_ipps/impact/FY 2027 IPPS Impact File - Correction Notice.txt',
        'name': 'CMS FY 2027 IPPS final rule impact file (correction notice, September 2026)',
        'url': 'https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps/fy-2027-ipps-final-rule-home-page',
        'retrieved': '2026-09-30',
        'as_of': 'CMS FY 2027 IPPS final rule impact file (correction notice)',
    },
    'dsh_supplemental': {
        'file': 'cms_dsh/dsh_fy2027/FY 2027 FR IPPS Medicare DSH Supplemental File (Data).txt',
        'name': 'CMS FY 2027 IPPS final rule Medicare DSH supplemental data file',
        'url': 'https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps/fy-2027-ipps-final-rule-home-page',
        'retrieved': '2026-10-01',
        'as_of': 'federal fiscal year 2027 projections',
    },
    'pos': {
        'file': 'cms_pos/Hospital_and_other.DATA.Q2_2026.csv',
        'name': 'CMS Provider of Services file, hospitals and other facilities, Q2 2026',
        'url': 'https://data.cms.gov/provider-characteristics/hospitals-and-other-facilities/provider-of-services-file-hospital-non-hospital-facilities',
        'retrieved': '2026-09-29',
        'as_of': 'Q2 2026',
    },
    'poh': {
        'file': 'repo:research/poh/poh_db_2026-03.json',
        'name': 'Alliance physician-owned hospital list, verified March 2026',
        'url': 'https://tafhc.org/poh/hospitals/',
        'retrieved': '2026-11-13',
        'as_of': 'March 2026',
    },
    'rankings': {
        'file': 'repo:data/rankings.json',
        'name': 'CON desk rankings (certificate-of-need status and score by jurisdiction)',
        'url': 'https://tafhc.org/con/rankings/',
        'retrieved': '2026-11-13',
        'as_of': 'November 2026',
    },
}

HOSPITAL_TYPES = ('DSH', 'CAH', 'PED', 'RRC', 'SCH', 'CAN')


def src_path(key):
    f = REGISTRY[key]['file']
    if f.startswith('repo:'):
        return REPO / f[5:]
    return SOURCES / f


def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()


def num(s):
    """Cost-report cell to float; blank is None."""
    if s is None:
        return None
    s = str(s).strip().strip('"').replace(',', '').replace('$', '').strip()
    if s in ('', 'N/A', 'NA'):
        return None
    try:
        return float(s)
    except ValueError:
        return None


def mdy(s):
    try:
        return datetime.strptime(s.strip(), '%m/%d/%Y').date()
    except Exception:
        return None


def write_json(path, obj):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + '.tmp')
    with open(tmp, 'w') as fh:
        json.dump(obj, fh, indent=1, ensure_ascii=False)
        fh.write('\n')
    os.replace(tmp, path)


def read_json(path):
    with open(path) as fh:
        return json.load(fh)


def log(*a):
    print(*a, file=sys.stderr)
