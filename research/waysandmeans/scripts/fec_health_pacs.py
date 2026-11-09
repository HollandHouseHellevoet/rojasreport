"""Healthcare PAC contributions to Ways and Means members from FEC bulk files.
Usage: python3 -I fec_health_pacs.py <raw/fec dir> <roster json> <crosswalk json> <out json> <cycle: 2024|2026>
Inputs (FEC bulk downloads): cn{yy}/cn.txt (candidate master), ccl{yy}/ccl.txt (candidate-committee linkage),
cm{yy}/cm.txt (committee master), pas2{yy}/itpas2.txt (contributions from committees to candidates).
Only transaction type 24K (direct contribution to a candidate committee) is counted. Individuals' contributions are not included.
Sector classification is the Rojas Report's own, by PAC name and connected organization (rules below), not an OpenSecrets category.
"""
import sys, csv, json, re, collections, unicodedata
def fold(x): return ''.join(ch for ch in unicodedata.normalize('NFKD', x) if not unicodedata.combining(ch)).upper()
fec, roster_f, cross_f, out_f, cycle = sys.argv[1:6]
yy = cycle[-2:]
roster = json.load(open(roster_f))["members"]
cross = {m["id"]["bioguide"]: m for m in json.load(open(cross_f))}

def rows(path):
    with open(path, encoding="latin-1") as f:
        for line in f: yield line.rstrip("\n").split("|")

# candidate master
cn = {}
for r in rows(f"{fec}/cn{yy}/cn.txt"):
    cn[r[0]] = {"name": r[1], "party": r[2], "year": r[3], "state": r[4], "office": r[5], "district": r[6], "pcc": r[9]}
# linkage: candidate -> committees (principal + authorized)
ccl = collections.defaultdict(list)
for r in rows(f"{fec}/ccl{yy}/ccl.txt"):
    ccl[r[0]].append({"cmte": r[3], "type": r[4], "dsgn": r[5]})
# committee master
cm = {}
for r in rows(f"{fec}/cm{yy}/cm.txt"):
    cm[r[0]] = {"name": r[1], "dsgn": r[8], "type": r[9], "party": r[10], "org_type": r[12], "connected": r[13], "cand": r[14]}

# resolve each member's House candidate id
members = []
for m in roster:
    x = cross.get(m["bioguideId"], {})
    fec_ids = x.get("id", {}).get("fec", [])
    cand = None
    for cid in fec_ids:
        c = cn.get(cid)
        if c and c["office"] == "H" and c["state"] == m["state"] and c["name"].split(",")[0].strip().upper().startswith(m["lastName"].split(" ")[0].upper()[:5]):
            cand = cid; break
    if not cand:  # fall back: search cn by last name (accents folded), first name, state, office
        hits = [cid for cid, c in cn.items() if c["office"] == "H" and c["state"] == m["state"] and fold(c["name"].split(",")[0].strip()) == fold(m["lastName"]) and fold(c["name"]).split(",")[-1].strip().startswith(fold(m["firstName"])[:4])]
        if len(hits) == 1: cand = hits[0]
    members.append({**m, "fecCandidateId": cand, "fecCandidateName": cn[cand]["name"] if cand else None, "fecCommittees": [l["cmte"] for l in ccl.get(cand, [])] if cand else []})

cand_ids = {m["fecCandidateId"]: m for m in members if m["fecCandidateId"]}

# sector rules (upper-case regex on "COMMITTEE NAME | CONNECTED ORG"), checked in this order
RULES = [
 ("Hospitals & Nursing Homes", r"HOSPITAL|HEALTH SYSTEM|HEALTHCARE SYSTEM|HEALTH CARE SYSTEM|MEDICAL CENTER|NURSING HOME|NURSING FACILIT|HOSPICE|HOME CARE|HOMECARE|HOME HEALTH|CARE AT HOME|PRIVATE CARE ASSOCIATION|SENIOR LIVING|ASSISTED LIVING|LONG TERM CARE|LONG-TERM CARE|POST-ACUTE|POST ACUTE|REHABILITATION HOSP|\bHCA\b|TENET|UNIVERSAL HEALTH SERVICES|COMMUNITY HEALTH SYSTEMS|ASCENSION|COMMONSPIRIT|TRINITY HEALTH|ENCOMPASS HEALTH|SELECT MEDICAL|LIFEPOINT|ACADIA HEALTHCARE|AMEDISYS|ENSIGN GROUP|GENESIS HEALTHCARE|PREMIER, INC|PREMIER INC|PREMIER HEALTHCARE ALLIANCE|VIZIENT|ESSENTIAL HOSPITALS|CHILDREN'?S HOSPITAL|MAYO CLINIC|CLEVELAND CLINIC|ADVOCATE HEALTH|ADVOCATE AURORA|ADVENTHEALTH|ADVENTIST HEALTH|BAYLOR SCOTT|INTERMOUNTAIN|PROVIDENCE HEALTH|PROVIDENCE ST|SUTTER HEALTH|NORTHWELL|MOUNT SINAI|CEDARS|\bUPMC\b|KINDRED|BROOKDALE|LEADINGAGE|AMERICAN HEALTH CARE ASS|KNIGHT HEALTH|SCIONHEALTH|NATIONAL HEALTH CORPORATION|PAM HEALTH|ARDENT|BEHAVIORAL HEALTHCARE"),
 ("Insurance", r"BLUE CROSS|BLUE SHIELD|BLUECROSS|\bAHIP\b|AMERICA'?S HEALTH INSURANCE PLANS|AETNA|CIGNA|ELEVANCE|ANTHEM|HEALTH CARE SERVICE CORP|INDEPENDENCE BLUE|HIGHMARK|GUIDEWELL|FLORIDA BLUE|PREMERA|CAREFIRST|CAMBIA|REGENCE|HEALTH INSURANCE|BENEFITS AND INSURANCE PROFESSIONALS|NABIP|OSCAR HEALTH|CLOVER HEALTH|ALIGNMENT HEALTH|WELLCARE|MEDICAL MUTUAL|PRIORITY HEALTH|TUFTS HEALTH|HARVARD PILGRIM|POINT32|EMBLEMHEALTH|HEALTHFIRST|CARESOURCE|SELECTHEALTH|SCAN HEALTH|DELTA DENTAL|\bVSP\b|EHEALTH|SIDECAR HEALTH|MEDICAL MALPRACTICE|DOCTORS COMPANY|MEDPRO|PROASSURANCE|MLMIC|MEDICAL PROFESSIONAL LIABILITY"),
 ("Health Services/HMOs", r"UNITEDHEALTH|UNITED HEALTH|HUMANA|CENTENE|MOLINA|DAVITA|FRESENIUS|\bOPTUM|EVERNORTH|AMERICA'?S PHYSICIAN GROUPS|URGENT CARE|DIALYSIS|KIDNEY CARE|\bRENAL\b|AMBULATORY SURG|SURGERY CENTER|SURGICAL CARE AFFILIATES|U\.?S\.? PHYSICAL THERAPY|AMBULANCE|EMERGENCY MEDICAL SERVICES|CHEMED|VITAS|ADDUS|LHC GROUP|BRIGHTSPRING|PEDIATRIX|MEDNAX|ENVISION HEALTHCARE|TEAMHEALTH|TEAM HEALTH|SOUND PHYSICIANS|RADIOLOGY PARTNERS|US ACUTE CARE|AGILON|ONE MEDICAL|ONCOLOGY NETWORK|US ONCOLOGY|COMMUNITY ONCOLOGY|MANAGED CARE|HEALTH PLAN|HEALTHPLAN|MEDICARE ADVANTAGE|BETTER MEDICARE ALLIANCE|TELADOC|HIMS & HERS|CHANGE HEALTHCARE|\bCERNER|EPIC SYSTEMS|ATHENAHEALTH|GLOBAL MEDICAL RESPONSE|AMERICAN MEDICAL RESPONSE|COMMUNITY HEALTH CENTER|HEALTHEQUITY|OPTION CARE|ACCOUNTABLE CARE|AMERIHEALTH|HEALTH SERVICES PAC|U\.?S\.? ANESTHESIA PARTNERS|METROPOLITAN ANESTHESIA|ANESTHESIA SERVICE MEDICAL GROUP|AKSM|ALLERGY ASSOCIATES|KAISER"),
 ("Health Professionals", r"MEDICAL ASSOCIATION|MEDICAL SOCIETY|AMERICAN COLLEGE OF (?!TRIAL)|AMERICAN ACADEMY OF (?!ACTUARIES)|AMERICAN SOCIETY OF (?!PENSION|ASSOCIATION|TRAVEL|CIVIL|MECHANICAL|COMPOSERS|LANDSCAPE|INTERIOR|HOME INSPECTORS|APPRAISERS|SAFETY)|AMERICAN SOCIETY FOR (?!TESTING|QUALITY)|SOCIETY FOR VASCULAR|SOCIETY OF (?!INDEPENDENT GASOLINE|AMERICAN FLORISTS|PROFESSIONAL SURVEYORS|PETROLEUM|PLASTICS|CHEMICAL|ACTUARIES|CPAS|AMERICAN MILITARY|AMERICAN BUSINESS)|ASSOCIATION OF AMERICAN MEDICAL|ASSOCIATION OF AMERICAN PHYSICIANS|PHYSICIAN|SURGEON|SURGERY|\bDENTAL\b|DENTIST|ORTHODONT|\bNURSE|NURSING|OPTOMETR|CHIROPRACT|PODIATR|PHYSICAL THERAP|ANESTHESI|RADIOLOG|CARDIOLOG|ORTHOP|EMERGENCY PHYSICIAN|EMERGENCY MEDICINE|DERMATOLOG|OPHTHALMOLOG|GASTROENTEROLOG|UROLOG|ONCOLOG|PSYCHIATR|PSYCHOLOG|PATHOLOG|PEDIATRIC|FAMILY PHYSICIAN|OSTEOPATHIC|PLASTIC SURG|SPEECH-LANGUAGE|OCCUPATIONAL THERAP|AUDIOLOG|MIDWI|NEUROLOG|NEUROSURG|OTOLARYNG|RHEUMATOLOG|PULMON|NEPHROLOG|ENDOCRIN|HEMATOLOG|INTERNAL MEDICINE|OBSTETRIC|OB-GYN|GYNECOLOG|MAXILLOFACIAL|PERIODONT|ENDODONT|DIETETIC|RESPIRATORY CARE|SONOGRAPH|ATHLETIC TRAINER|CERTIFIED REGISTERED|CRNA|PHARMACIST|SLEEP MEDICINE|INTERVENTIONAL PAIN|CATARACT|PHYSICIAN-LED|HEALTH SYSTEM PHARMACIST|MEDICAL GROUP|CLINICAL LABORATORY SCIENCE|RADIOLOGIC TECHNOLOG|STAFF NURSES"),
 ("Pharmaceuticals", r"PHARMA|THERAPEUTICS|BIOTECH|BIOSCIENCE|BIOLOGICS|BIOPHARM|PFIZER|MERCK|\bLILLY|ABBVIE|AMGEN|GILEAD|BRISTOL-MYERS|BRISTOL MYERS|JOHNSON & JOHNSON|JOHNSON AND JOHNSON|NOVARTIS|SANOFI|GLAXO|\bGSK\b|ASTRAZENECA|\bBAYER\b|BOEHRINGER|NOVO NORDISK|TAKEDA|REGENERON|VERTEX|BIOGEN|GENENTECH|\bROCHE\b|ABBOTT LAB|MEDTRONIC|STRYKER|BOSTON SCIENTIFIC|BAXTER|BECTON|ZIMMER BIOMET|EDWARDS LIFESCIENCES|INTUITIVE SURGICAL|ADVAMED|ADVANCED MEDICAL TECHNOLOGY|MEDICAL DEVICE|BIOTECHNOLOGY INNOVATION|MCKESSON|CARDINAL HEALTH|CENCORA|AMERISOURCE|HEALTHCARE DISTRIBUTION ALLIANCE|HEALTH INDUSTRY DISTRIBUTORS|CONSUMER HEALTHCARE PRODUCTS|WALGREEN|\bCVS\b|RITE AID|CHAIN DRUG|COMMUNITY PHARMAC|PHARMACY|EXPRESS SCRIPTS|PRIME THERAPEUTICS|ACCESSIBLE MEDICINES|\bTEVA\b|VIATRIS|MYLAN|ASTELLAS|DAIICHI|EISAI|OTSUKA|LUNDBECK|\bMERZ\b|ALKERMES|JAZZ PHARM|\bUCB\b|INCYTE|MODERNA|BIOMARIN|ALNYLAM|GENMAB|ORGANON|LABORATORY CORP|CLINICAL LABORATORY|QUEST DIAGNOSTICS|DIAGNOSTIC|DENTSPLY|HOLOGIC|RESMED|MASIMO|TELEFLEX|STERIS|COOPER COMPANIES|ALIGN TECHNOLOGY|DEXCOM|INSULET|TANDEM DIABETES|HENRY SCHEIN|OWENS & MINOR|MEDLINE|B\. BRAUN|SMITH & NEPHEW|SIEMENS HEALTHINEERS|GE HEALTHCARE|PHILIPS NORTH AMERICA|OLYMPUS|AMNEAL|PHARMAVITE|ULTRAGENYX|OSTEAL|INOVIO|BRIDGEBIO|NEUROCRINE|AKEBIA|IPSEN|ALEXION|\bPTC\b|GUARDIAN PHARMACY|SENIOR CARE PHARMACY|COMPOUNDING"),
]
EXCLUDE = r"VETERINAR|ANIMAL HEALTH|ZOETIS|ELANCO|FIREFIGHTER|TEACHERS|LOCAL \d|\bIBEW\b|\bAFL|SEIU|AFSCME|TEAMSTERS|LABORERS|CARPENTERS|PLUMBERS|REALTOR|\bBANK|KEYCORP|FIRST HORIZON|CREDIT UNION|INSURANCE AGENTS|INDEPENDENT INSURANCE|PROPERTY CASUALTY|LIFE INSUR|REINSURANCE|AUTOMOBILE|AUTO CARE|CASUALTY|STATE FARM|ALLSTATE|LIBERTY MUTUAL|TRAVELERS|NATIONWIDE|HARTFORD|PRUDENTIAL|METLIFE|NEW YORK LIFE|MASSMUTUAL|NORTHWESTERN MUTUAL|GUARDIAN LIFE|UNUM|LINCOLN NATIONAL|PRINCIPAL FINANCIAL|VOYA|AMERIPRISE|TRIAL LAWYERS|HEARING AID|OCCIDENTAL|PETROLEUM|PETROCHEMICAL|GASOLINE|FLORISTS|SURVEYORS|RAILROAD|PUBLISHERS|CHAMBER OF COMMERCE|CORTEVA|AGRISCIENCE|DAY & ZIMMERMANN|POWERS, PYLES|PENSION PROFESSIONALS|ASSOCIATION EXECUTIVES|TRAVEL ADVISORS|BENEFITS COUNCIL|PLANNED PARENTHOOD|PRESERVE SOCIAL SECURITY|HEALTH & FITNESS|FITPAC|ECOLAB|NO LABELS|DENTONS|PILOTS|AUTISM AND INTELLECTUAL|ADMINISTRATIVE CONSULTING|SEAFOOD|PEANUT|POWER CO|BIODIESEL|HEALTHCARE FREEDOM FUND|CARRY ON PAC|SOCIAL SECURITY & MEDICARE"
EXC = re.compile(EXCLUDE)
def classify(text):
    t = text.upper()
    if EXC.search(t): return None
    for sector, pat in RULES:
        if re.search(pat, t): return sector
    return None

# scan pas2
by_member = collections.defaultdict(list)
pac_totals = collections.Counter()
unclassified_hint = collections.Counter()
max_dt = ""
for r in rows(f"{fec}/pas2{yy}/itpas2.txt"):
    if len(r) < 22: continue
    cand = r[16]
    if cand not in cand_ids: continue
    if r[5] != "24K": continue
    pac = r[0]; c = cm.get(pac, {"name": pac, "connected": "", "type": "", "dsgn": "", "org_type": ""})
    text = f"{c['name']} | {c['connected']}"
    sector = classify(text)
    dt = r[13]; iso = f"{dt[4:8]}-{dt[0:2]}-{dt[2:4]}" if len(dt) == 8 else dt
    if iso > max_dt: max_dt = iso
    if not sector:
        if re.search(r"HEALTH|MEDIC|CARE|CLINIC|PHARM|HOSP|DENT|NURS|SURG|DOCTOR|PATIENT|THERAP|BIO|DIAGNOS|DRUG|LAB", text.upper()): unclassified_hint[text] += int(float(r[14] or 0))
        continue
    amt = int(float(r[14] or 0))
    by_member[cand].append({"pacId": pac, "pac": c["name"], "connectedOrg": c["connected"], "sector": sector, "date": iso, "amount": amt, "reportType": r[2], "amendment": r[1], "imageNumber": r[4], "subId": r[21], "recipientCommittee": r[15], "source": f"https://docquery.fec.gov/cgi-bin/fecimg/?{r[4]}"})
    pac_totals[(pac, c["name"], sector)] += amt

out = {"cycle": cycle, "sourceLabel": f"FEC bulk data, {cycle} cycle: contributions from committees to candidates (pas2{yy}), committee master (cm{yy}), candidate master (cn{yy}), candidate-committee linkage (ccl{yy})",
       "source": f"https://www.fec.gov/data/browse-data/?tab=bulk-data", "files": {"pas2": f"https://www.fec.gov/files/bulk-downloads/{cycle}/pas2{yy}.zip", "cm": f"https://www.fec.gov/files/bulk-downloads/{cycle}/cm{yy}.zip", "cn": f"https://www.fec.gov/files/bulk-downloads/{cycle}/cn{yy}.zip", "ccl": f"https://www.fec.gov/files/bulk-downloads/{cycle}/ccl{yy}.zip"},
       "transactionTypes": ["24K"], "latestTransactionDate": max_dt,
       "method": "Rows where CAND_ID is the member's House candidate ID and TRANSACTION_TP is 24K (contribution made to a non-affiliated committee). Amounts are summed as filed by the contributing PAC (negative rows are refunds and net out). Individual contributions are not included. Sector is the Rojas Report's own classification by PAC name and connected organization; see fec_health_pacs.py RULES.",
       "members": []}
for m in members:
    cid = m["fecCandidateId"]
    recs = sorted(by_member.get(cid, []), key=lambda x: -x["amount"])
    sectors = collections.Counter(); pacs = collections.Counter()
    for x in recs: sectors[x["sector"]] += x["amount"]; pacs[(x["pacId"], x["pac"], x["sector"])] += x["amount"]
    out["members"].append({"bioguideId": m["bioguideId"], "name": m["officialName"], "party": m["party"], "stateDistrict": m["stateDistrict"], "fecCandidateId": cid, "fecCandidateName": m["fecCandidateName"], "fecCommittees": m["fecCommittees"],
        "total": sum(sectors.values()), "bySector": dict(sectors), "contributionCount": len(recs),
        "topPacs": [{"pacId": k[0], "pac": k[1], "sector": k[2], "amount": v} for k, v in pacs.most_common(15)],
        "contributions": recs})
out["members"].sort(key=lambda x: -x["total"])
out["grandTotal"] = sum(x["total"] for x in out["members"])
out["pacsMatched"] = [{"pacId": k[0], "pac": k[1], "sector": k[2], "amount": v} for k, v in pac_totals.most_common()]
out["unclassifiedWithHealthWords"] = [{"text": k, "amount": v} for k, v in unclassified_hint.most_common(80)]
json.dump(out, open(out_f, "w"), indent=1)
print(cycle, "grand", out["grandTotal"], "latest tx", max_dt, "pacs", len(pac_totals))
for x in out["members"]: print(f"  {x['total']:>8}  {x['party']} {x['stateDistrict']} {x['name']}  {x['fecCandidateId']}  {x['fecCandidateName']}")
print("UNCLASSIFIED (health-looking) top 40:")
for u in out["unclassifiedWithHealthWords"][:40]: print("  ", u["amount"], u["text"])
