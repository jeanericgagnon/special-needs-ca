export interface CityMapping {
  id: string;
  name: string;
  countyId: string;
}

export const CITIES: CityMapping[] = [
  // Los Angeles County
  { id: 'los-angeles', name: 'Los Angeles', countyId: 'los-angeles' },
  { id: 'long-beach', name: 'Long Beach', countyId: 'los-angeles' },
  { id: 'pasadena', name: 'Pasadena', countyId: 'los-angeles' },
  { id: 'glendale', name: 'Glendale', countyId: 'los-angeles' },
  { id: 'santa-monica', name: 'Santa Monica', countyId: 'los-angeles' },
  { id: 'torrance', name: 'Torrance', countyId: 'los-angeles' },
  { id: 'burbank', name: 'Burbank', countyId: 'los-angeles' },
  { id: 'pomona', name: 'Pomona', countyId: 'los-angeles' },
  { id: 'el-monte', name: 'El Monte', countyId: 'los-angeles' },
  { id: 'west-covina', name: 'West Covina', countyId: 'los-angeles' },
  { id: 'inglewood', name: 'Inglewood', countyId: 'los-angeles' },
  { id: 'downey', name: 'Downey', countyId: 'los-angeles' },
  { id: 'compton', name: 'Compton', countyId: 'los-angeles' },
  { id: 'norwalk', name: 'Norwalk', countyId: 'los-angeles' },
  { id: 'south-gate', name: 'South Gate', countyId: 'los-angeles' },
  { id: 'carson', name: 'Carson', countyId: 'los-angeles' },
  { id: 'santa-clarita', name: 'Santa Clarita', countyId: 'los-angeles' },
  { id: 'lancaster', name: 'Lancaster', countyId: 'los-angeles' },
  { id: 'palmdale', name: 'Palmdale', countyId: 'los-angeles' },

  // Orange County
  { id: 'anaheim', name: 'Anaheim', countyId: 'orange' },
  { id: 'santa-ana', name: 'Santa Ana', countyId: 'orange' },
  { id: 'irvine', name: 'Irvine', countyId: 'orange' },
  { id: 'huntington-beach', name: 'Huntington Beach', countyId: 'orange' },
  { id: 'garden-grove', name: 'Garden Grove', countyId: 'orange' },
  { id: 'orange-city', name: 'Orange', countyId: 'orange' },
  { id: 'fullerton', name: 'Fullerton', countyId: 'orange' },
  { id: 'costa-mesa', name: 'Costa Mesa', countyId: 'orange' },
  { id: 'mission-viejo', name: 'Mission Viejo', countyId: 'orange' },
  { id: 'westminster', name: 'Westminster', countyId: 'orange' },
  { id: 'newport-beach', name: 'Newport Beach', countyId: 'orange' },
  { id: 'buena-park', name: 'Buena Park', countyId: 'orange' },
  { id: 'tustin', name: 'Tustin', countyId: 'orange' },
  { id: 'yorba-linda', name: 'Yorba Linda', countyId: 'orange' },
  { id: 'san-clemente', name: 'San Clemente', countyId: 'orange' },
  { id: 'laguna-niguel', name: 'Laguna Niguel', countyId: 'orange' },
  { id: 'lake-forest', name: 'Lake Forest', countyId: 'orange' },
  { id: 'la-habra', name: 'La Habra', countyId: 'orange' },

  // Santa Clara County
  { id: 'san-jose', name: 'San Jose', countyId: 'santa-clara' },
  { id: 'sunnyvale', name: 'Sunnyvale', countyId: 'santa-clara' },
  { id: 'santa-clara-city', name: 'Santa Clara', countyId: 'santa-clara' },
  { id: 'mountain-view', name: 'Mountain View', countyId: 'santa-clara' },
  { id: 'milpitas', name: 'Milpitas', countyId: 'santa-clara' },
  { id: 'palo-alto', name: 'Palo Alto', countyId: 'santa-clara' },
  { id: 'cupertino', name: 'Cupertino', countyId: 'santa-clara' },
  { id: 'gilroy', name: 'Gilroy', countyId: 'santa-clara' },
  { id: 'campbell', name: 'Campbell', countyId: 'santa-clara' },
  { id: 'los-gatos', name: 'Los Gatos', countyId: 'santa-clara' },

  // San Diego County
  { id: 'san-diego-city', name: 'San Diego', countyId: 'san-diego' },
  { id: 'chula-vista', name: 'Chula Vista', countyId: 'san-diego' },
  { id: 'oceanside', name: 'Oceanside', countyId: 'san-diego' },
  { id: 'escondido', name: 'Escondido', countyId: 'san-diego' },
  { id: 'carlsbad', name: 'Carlsbad', countyId: 'san-diego' },
  { id: 'el-cajon', name: 'El Cajon', countyId: 'san-diego' },
  { id: 'vista', name: 'Vista', countyId: 'san-diego' },
  { id: 'san-marcos', name: 'San Marcos', countyId: 'san-diego' },
  { id: 'encinitas', name: 'Encinitas', countyId: 'san-diego' },
  { id: 'national-city', name: 'National City', countyId: 'san-diego' },
  { id: 'coronado', name: 'Coronado', countyId: 'san-diego' },

  // Alameda County
  { id: 'oakland', name: 'Oakland', countyId: 'alameda' },
  { id: 'fremont', name: 'Fremont', countyId: 'alameda' },
  { id: 'hayward', name: 'Hayward', countyId: 'alameda' },
  { id: 'berkeley', name: 'Berkeley', countyId: 'alameda' },
  { id: 'san-leandro', name: 'San Leandro', countyId: 'alameda' },
  { id: 'livermore', name: 'Livermore', countyId: 'alameda' },
  { id: 'pleasanton', name: 'Pleasanton', countyId: 'alameda' },
  { id: 'alameda-city', name: 'Alameda', countyId: 'alameda' },
  { id: 'union-city', name: 'Union City', countyId: 'alameda' },
  { id: 'dublin', name: 'Dublin', countyId: 'alameda' },

  // Contra Costa County
  { id: 'concord', name: 'Concord', countyId: 'contra-costa' },
  { id: 'richmond', name: 'Richmond', countyId: 'contra-costa' },
  { id: 'antioch', name: 'Antioch', countyId: 'contra-costa' },
  { id: 'san-ramon', name: 'San Ramon', countyId: 'contra-costa' },
  { id: 'walnut-creek', name: 'Walnut Creek', countyId: 'contra-costa' },
  { id: 'pittsburg', name: 'Pittsburg', countyId: 'contra-costa' },
  { id: 'brentwood', name: 'Brentwood', countyId: 'contra-costa' },

  // Sacramento County
  { id: 'sacramento-city', name: 'Sacramento', countyId: 'sacramento' },
  { id: 'elk-grove', name: 'Elk Grove', countyId: 'sacramento' },
  { id: 'folsom', name: 'Folsom', countyId: 'sacramento' },
  { id: 'rancho-cordova', name: 'Rancho Cordova', countyId: 'sacramento' },
  { id: 'citrus-heights', name: 'Citrus Heights', countyId: 'sacramento' },

  // Riverside County
  { id: 'riverside-city', name: 'Riverside', countyId: 'riverside' },
  { id: 'moreno-valley', name: 'Moreno Valley', countyId: 'riverside' },
  { id: 'corona', name: 'Corona', countyId: 'riverside' },
  { id: 'temecula', name: 'Temecula', countyId: 'riverside' },
  { id: 'murrieta', name: 'Murrieta', countyId: 'riverside' },
  { id: 'indio', name: 'Indio', countyId: 'riverside' },
  { id: 'hemet', name: 'Hemet', countyId: 'riverside' },
  { id: 'palm-springs', name: 'Palm Springs', countyId: 'riverside' },

  // San Bernardino County
  { id: 'san-bernardino-city', name: 'San Bernardino', countyId: 'san-bernardino' },
  { id: 'fontana', name: 'Fontana', countyId: 'san-bernardino' },
  { id: 'ontario', name: 'Ontario', countyId: 'san-bernardino' },
  { id: 'rancho-cucamonga', name: 'Rancho Cucamonga', countyId: 'san-bernardino' },
  { id: 'victorville', name: 'Victorville', countyId: 'san-bernardino' },
  { id: 'rialto', name: 'Rialto', countyId: 'san-bernardino' },
  { id: 'hesperia', name: 'Hesperia', countyId: 'san-bernardino' },
  { id: 'chino', name: 'Chino', countyId: 'san-bernardino' },

  // Fresno County
  { id: 'fresno-city', name: 'Fresno', countyId: 'fresno' },
  { id: 'clovis', name: 'Clovis', countyId: 'fresno' },

  // Kern County
  { id: 'bakersfield', name: 'Bakersfield', countyId: 'kern' },

  // Ventura County
  { id: 'oxnard', name: 'Oxnard', countyId: 'ventura' },
  { id: 'thousand-oaks', name: 'Thousand Oaks', countyId: 'ventura' },
  { id: 'simi-valley', name: 'Simi Valley', countyId: 'ventura' },
  { id: 'ventura-city', name: 'Ventura', countyId: 'ventura' },
  { id: 'camarillo', name: 'Camarillo', countyId: 'ventura' },

  // San Joaquin County
  { id: 'stockton', name: 'Stockton', countyId: 'san-joaquin' },
  { id: 'tracy', name: 'Tracy', countyId: 'san-joaquin' },
  { id: 'manteca', name: 'Manteca', countyId: 'san-joaquin' },
  { id: 'lodi', name: 'Lodi', countyId: 'san-joaquin' },

  // Sonoma County
  { id: 'santa-rosa', name: 'Santa Rosa', countyId: 'sonoma' },
  { id: 'petaluma', name: 'Petaluma', countyId: 'sonoma' },

  // Solano County
  { id: 'vallejo', name: 'Vallejo', countyId: 'solano' },
  { id: 'fairfield', name: 'Fairfield', countyId: 'solano' },
  { id: 'vacaville', name: 'Vacaville', countyId: 'solano' },

  // Santa Barbara County
  { id: 'santa-barbara-city', name: 'Santa Barbara', countyId: 'santa-barbara' },
  { id: 'santa-maria', name: 'Santa Maria', countyId: 'santa-barbara' }
];

export function getCityBySlug(slug: string): CityMapping | undefined {
  const norm = slug.toLowerCase();
  return CITIES.find(c => c.id === norm || c.id.replace('-city', '') === norm);
}
