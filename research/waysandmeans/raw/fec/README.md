# FEC bulk files (not committed)

The FEC bulk downloads are too large for the repository (the 2024 `itpas2.txt` alone is 122MB). They are not committed. The filtered outputs `health_pacs_2024.json` and `health_pacs_2026.json` are committed and carry every matched contribution with its FEC image number.

To rebuild, download these files into this folder and unzip each into a folder of the same name, then run `scripts/fec_health_pacs.py` (usage in its docstring):

| Cycle | Files (retrieved November 8, 2026) |
|---|---|
| 2026 | https://www.fec.gov/files/bulk-downloads/2026/pas226.zip, cm26.zip, cn26.zip, ccl26.zip |
| 2024 | https://www.fec.gov/files/bulk-downloads/2024/pas224.zip, cm24.zip, cn24.zip, ccl24.zip |

Transaction type 24K only (PAC contribution to a candidate committee). Latest 2026-cycle transaction in the file used: October 14, 2026.
