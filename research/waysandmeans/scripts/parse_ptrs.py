"""Extract transaction rows from House periodic transaction report PDFs (Clerk of the House) with pypdf.
Usage: python3 -I parse_ptrs.py <pdf dir> <fd index json> <out json> <text out dir>
Electronically filed PTRs carry a text layer; scanned paper filings do not and are recorded as not machine-readable.
"""
import sys, os, re, json, glob
from pypdf import PdfReader
pdfdir, idx_f, out_f, txtdir = sys.argv[1:5]
os.makedirs(txtdir, exist_ok=True)
idx = json.load(open(idx_f))
doc_member = {}
for m in idx["members"]:
    for f in m["filings"]:
        if f["filingType"] == "P": doc_member[(f["year"], f["docId"])] = (m, f)
HEALTH_TICKERS = set("BMY PFE MRK LLY ABBV AMGN GILD JNJ ABT MDT SYK BSX UNH HUM CI CVS ELV CNC MOH HCA THC UHS CYH DVA LH DGX ISRG ZBH EW BDX BAX TMO DHR REGN VRTX BIIB MRNA NVO AZN NVS SNY GSK TAK MCK CAH COR WBA HSIC ALGN DXCM PODD RMD HOLX STE TFX IQV CRL WST TECH ILMN EXAS NTRA VEEV TDOC HIMS OSCR ALHC AGL CLOV ENSG EHC SEM ACHC AMED PINC OMI GEHC MTD WAT RGEN BRKR BIO IDXX NVST XRAY COO PEN GMED ITGR MASI NVCR INSP TNDM PRGO ELAN BHC VTRS TEVA JAZZ INCY ALNY BMRN SRPT UTHR EXEL NBIX HALO RARE IONS CRSP NTLA BEAM ARGX GRFS OGN SOLV DOCS RCM EVH PRVA CHE OPCH ADUS LFST ACHC ARDT SGRY USPH RDNT WELL VTR OHI HR DOC MPW SBRA CTRE NHI LTC".split())
HEALTH_WORDS = re.compile(r"pharm|therapeut|health|medic|hospital|bio|surgical|dental|diagnos|lilly|pfizer|merck|abbvie|amgen|gilead|johnson & johnson|abbott|medtronic|stryker|unitedhealth|humana|cigna|\bcvs\b|elevance|centene|molina|\bhca\b|tenet|davita|labcorp|quest|intuitive|zimmer|edwards|becton|baxter|thermo fisher|danaher|regeneron|vertex|biogen|moderna|novo nordisk|astrazeneca|novartis|sanofi|mckesson|cardinal|cencora|walgreens|dexcom|resmed|hologic|steris|iqvia|teladoc|hims|oscar|encompass|select medical|acadia|amedisys|premier|owens|ge healthcare|welltower|ventas|omega healthcare|medical properties|sabra|caretrust", re.I)
rows = []; files = []
for p in sorted(glob.glob(f"{pdfdir}/*.pdf")):
    base = os.path.basename(p)[:-4]; year, doc = base.split("_", 1)
    m, f = doc_member.get((year, doc), (None, None))
    try:
        rd = PdfReader(p); text = "\n".join((pg.extract_text() or "") for pg in rd.pages)
    except Exception as e:
        files.append({"year": year, "docId": doc, "member": m["name"] if m else None, "readable": False, "error": str(e)}); continue
    open(f"{txtdir}/{base}.txt", "w").write(text)
    readable = len(text.strip()) > 200
    files.append({"year": year, "docId": doc, "member": m["name"] if m else None, "bioguideId": m["bioguideId"] if m else None, "filingDate": f["filingDate"] if f else None, "pdf": f["pdf"] if f else None, "readable": readable, "chars": len(text), "pages": len(rd.pages)})
    if not readable: continue
    # Typical e-filed row: "<owner> <asset name> (<TICKER>) [ST] <P|S|E> <mm/dd/yyyy> <mm/dd/yyyy> $x - $y"
    flat = re.sub(r"\s+", " ", text)
    for mt in re.finditer(r"(?P<owner>\b(?:SP|DC|JT)\b)?\s*(?P<asset>[A-Za-z0-9&.,'\-/ ]{3,120}?)\s*\((?P<ticker>[A-Z][A-Z.\-]{0,6})\)\s*\[(?P<type>[A-Z]{2})\]\s*(?P<tx>P|S|S \(partial\)|E|Exchange)\s*(?P<date>\d{2}/\d{2}/\d{4})\s*(?P<notified>\d{2}/\d{2}/\d{4})\s*(?P<amount>\$[\d,]+ ?-\s?\$[\d,]+|Over \$[\d,]+)", flat):
        g = mt.groupdict(); tk = g["ticker"].upper().split(".")[0]
        asset = re.sub(r"^\d{6,}", "", g["asset"].strip()).strip()
        own = g["owner"] or "Self"
        mo = re.match(r"^(SP|JT|DC)\s+(.*)$", asset)
        if mo: own, asset = mo.group(1), mo.group(2)
        g["asset"] = asset; g["owner"] = own
        health = tk in HEALTH_TICKERS or bool(HEALTH_WORDS.search(g["asset"]))
        rows.append({"member": m["name"] if m else None, "bioguideId": m["bioguideId"] if m else None, "year": year, "docId": doc, "owner": {"SP": "Spouse", "JT": "Joint", "DC": "Dependent child"}.get(g["owner"], "Self"), "asset": g["asset"], "ticker": tk, "assetType": g["type"], "transaction": {"P": "Purchase", "S": "Sale", "S (partial)": "Sale (Partial)", "E": "Exchange", "Exchange": "Exchange"}.get(g["tx"], g["tx"]), "transactionDate": g["date"], "notificationDate": g["notified"], "amount": g["amount"].replace(" ", ""), "healthcare": health, "source": f["pdf"] if f else None})
json.dump({"source": "https://disclosures-clerk.house.gov/FinancialDisclosure", "sourceLabel": "Clerk of the House, periodic transaction reports (PTR PDFs)", "files": files, "transactions": rows}, open(out_f, "w"), indent=1)
print("files", len(files), "readable", sum(1 for x in files if x["readable"]), "rows", len(rows), "health rows", sum(1 for r in rows if r["healthcare"]))
import collections
print(collections.Counter((x["member"], x["readable"]) for x in files).most_common(40))
for r in rows:
    if r["healthcare"]: print(r["member"], r["transactionDate"], r["transaction"], r["ticker"], r["asset"][:40], r["amount"], r["owner"])
