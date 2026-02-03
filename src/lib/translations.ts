export type Language = 'nl' | 'en';

export interface Translations {
  // Page 1-2 Labels
  projectAddress: string;
  name: string;
  email: string;
  phone: string;
  projectDetails: string;
  date: string;
  quoteNumber: string;
  reference: string;
  validity: string;

  // Company slogan
  companySlogan: string;
  companyTagline: string;

  // Services
  roughConstruction: string;
  totalRenovation: string;
  demolitionWork: string;
  newConstruction: string;
  sustainabilityService: string;
  heatPumps: string;

  // Footer labels
  renovation: string;
  sustainability: string;

  // Quote page
  quote: string;
  workIncludedInQuote: string;

  // Signature section
  signatureText: string;
  kindRegards: string;
  salesTeam: string;
  dateLabel: string;
  placeLabel: string;
  signatureLabel: string;

  // Table headers
  description: string;
  quantity: string;
  unit: string;
  price: string;
  subtotal: string;
  vat: string;
  vatPercent: string;
  subtotalInclVat: string;

  // Terms
  terms: string;
  termsText1: string;
  termsText2: string;
}

export const translations: Record<Language, Translations> = {
  nl: {
    // Page 1-2 Labels
    projectAddress: 'Project adres',
    name: 'Naam',
    email: 'Email',
    phone: 'Telefoon',
    projectDetails: 'Project details',
    date: 'Datum',
    quoteNumber: 'Offertenummer',
    reference: 'Kenmerk',
    validity: 'Geldigheid',

    // Company slogan
    companySlogan: 'De aannemer van Nederland',
    companyTagline: 'Een aannemer op wie je kunt bouwen',

    // Services
    roughConstruction: 'Ruwbouw',
    totalRenovation: 'Totaalrenovatie',
    demolitionWork: 'Sloopwerk',
    newConstruction: 'Nieuwbouw',
    sustainabilityService: 'Verduurzaming',
    heatPumps: 'Warmtepompen',

    // Footer labels
    renovation: 'Renovatie',
    sustainability: 'Verduurzaming',

    // Quote page
    quote: 'OFFERTE',
    workIncludedInQuote: 'Werkzaamheden opgenomen in deze offerte',

    // Signature section
    signatureText: 'Door ondertekening van deze offerte komt de aannemingsovereenkomst tot stand.',
    kindRegards: 'Met vriendelijke groet',
    salesTeam: 'Verkoopteam Labelbewust',
    dateLabel: 'Datum:',
    placeLabel: 'Plaats:',
    signatureLabel: 'Handtekening:',

    // Table headers
    description: 'Omschrijving',
    quantity: 'Aantal',
    unit: 'Eenheid',
    price: 'Prijs',
    subtotal: 'Subtotaal',
    vat: 'BTW',
    vatPercent: 'BTW',
    subtotalInclVat: 'Subtotaal incl. BTW',

    // Terms
    terms: 'Voorwaarden',
    termsText1: 'Op deze aanbieding zijn de UAV 2012 van toepassing met onderstaande afwijkingen:',
    termsText2: 'In het geval dat bepalingen in deze offerte strijdig zijn met bepalingen uit een eerder gesloten raamovereenkomst met dezelfde opdrachtgever, prevaleren de bepalingen uit de raamovereenkomst.',
  },
  en: {
    // Page 1-2 Labels
    projectAddress: 'Project address',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    projectDetails: 'Project details',
    date: 'Date',
    quoteNumber: 'Quote number',
    reference: 'Reference',
    validity: 'Validity',

    // Company slogan
    companySlogan: 'The contractor of the Netherlands',
    companyTagline: 'A contractor you can build on',

    // Services
    roughConstruction: 'Structural work',
    totalRenovation: 'Full renovation',
    demolitionWork: 'Demolition',
    newConstruction: 'New construction',
    sustainabilityService: 'Sustainability',
    heatPumps: 'Heat pumps',

    // Footer labels
    renovation: 'Renovation',
    sustainability: 'Sustainability',

    // Quote page
    quote: 'QUOTE',
    workIncludedInQuote: 'Work included in this quote',

    // Signature section
    signatureText: 'By signing this quote, the construction agreement is established.',
    kindRegards: 'Kind regards',
    salesTeam: 'Sales Team Labelbewust',
    dateLabel: 'Date:',
    placeLabel: 'Place:',
    signatureLabel: 'Signature:',

    // Table headers
    description: 'Description',
    quantity: 'Quantity',
    unit: 'Unit',
    price: 'Price',
    subtotal: 'Subtotal',
    vat: 'VAT',
    vatPercent: 'VAT',
    subtotalInclVat: 'Subtotal incl. VAT',

    // Terms
    terms: 'Terms and Conditions',
    termsText1: 'The UAV 2012 applies to this offer with the following exceptions:',
    termsText2: 'In the event that provisions in this quote conflict with provisions from a previously concluded framework agreement with the same client, the provisions from the framework agreement shall prevail.',
  },
};

export function getTranslations(language: Language): Translations {
  return translations[language];
}
