/** Tile-map layout for the 50 states and DC, from docs/mockups/home.dc.html (11 columns, 8 rows). */
export const STATE_TILES: [string, number, number, string][] = [
  ['AK', 1, 1, 'Alaska'], ['ME', 1, 11, 'Maine'],
  ['VT', 2, 10, 'Vermont'], ['NH', 2, 11, 'New Hampshire'],
  ['WA', 3, 1, 'Washington'], ['ID', 3, 2, 'Idaho'], ['MT', 3, 3, 'Montana'], ['ND', 3, 4, 'North Dakota'], ['MN', 3, 5, 'Minnesota'], ['IL', 3, 6, 'Illinois'], ['WI', 3, 7, 'Wisconsin'], ['MI', 3, 8, 'Michigan'], ['NY', 3, 9, 'New York'], ['RI', 3, 10, 'Rhode Island'], ['MA', 3, 11, 'Massachusetts'],
  ['OR', 4, 1, 'Oregon'], ['NV', 4, 2, 'Nevada'], ['WY', 4, 3, 'Wyoming'], ['SD', 4, 4, 'South Dakota'], ['IA', 4, 5, 'Iowa'], ['IN', 4, 6, 'Indiana'], ['OH', 4, 7, 'Ohio'], ['PA', 4, 8, 'Pennsylvania'], ['NJ', 4, 9, 'New Jersey'], ['CT', 4, 10, 'Connecticut'],
  ['CA', 5, 1, 'California'], ['UT', 5, 2, 'Utah'], ['CO', 5, 3, 'Colorado'], ['NE', 5, 4, 'Nebraska'], ['MO', 5, 5, 'Missouri'], ['KY', 5, 6, 'Kentucky'], ['WV', 5, 7, 'West Virginia'], ['VA', 5, 8, 'Virginia'], ['MD', 5, 9, 'Maryland'], ['DE', 5, 10, 'Delaware'],
  ['AZ', 6, 2, 'Arizona'], ['NM', 6, 3, 'New Mexico'], ['KS', 6, 4, 'Kansas'], ['AR', 6, 5, 'Arkansas'], ['TN', 6, 6, 'Tennessee'], ['NC', 6, 7, 'North Carolina'], ['SC', 6, 8, 'South Carolina'], ['DC', 6, 9, 'District of Columbia'],
  ['OK', 7, 4, 'Oklahoma'], ['LA', 7, 5, 'Louisiana'], ['MS', 7, 6, 'Mississippi'], ['AL', 7, 7, 'Alabama'], ['GA', 7, 8, 'Georgia'],
  ['HI', 8, 1, 'Hawaii'], ['TX', 8, 4, 'Texas'], ['FL', 8, 9, 'Florida'],
];

/** State dossiers published in the brief's format (`/states/[st]`). North Carolina first (phase 3). */
export const PUBLISHED_DOSSIERS: Record<string, string> = { NC: "/states/north-carolina/" };
