export type Language = 'nl' | 'en';

export interface Translations {
  // Page 1-2 Labels
  projectAddress: string;
  name: string;
  email: string;
  phone: string;
  phoneNumber: string;
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

  // Quote letter content
  dearSirMadam: string;
  quoteIntro: string;
  workLocationIntro: string;
  deliveryTitle: string;
  deliveryText: string;
  pricesTitle: string;
  pricesText: string;
  paymentTitle: string;
  paymentOnOrder: string;
  paymentAtStart: string;
  paymentOnCompletion: string;
  paymentTerm: string;
  quoteFinalText: string;

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
    phoneNumber: 'Telefoonnummer',
    projectDetails: 'Project details',
    date: 'Datum',
    quoteNumber: 'Offertenummer',
    reference: 'Kenmerk',
    validity: 'Geldigheid',

    // Company slogan
    companySlogan: 'De aannemer van Nederland',
    companyTagline: 'De aannemer op wie je kan bouwen',

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

    // Quote letter content
    dearSirMadam: 'Geachte heer/mevrouw,',
    quoteIntro: 'Hierbij ontvangt u een vrijblijvende offerte voor de levering en uitvoering van de door u aangevraagde producten en diensten.',
    workLocationIntro: 'De uit te voeren werkzaamheden aan',
    deliveryTitle: 'Levering/Uitvoering:',
    deliveryText: 'De werkzaamheden zullen binnen acht weken na de opdracht van start gaan, mits alle benodigde onderdelen, materialen, ontwerpen en bouwrapporten binnen deze termijn door onze leveranciers geleverd kunnen worden. De levering en uitvoering geschieden conform onze algemene voorwaarden, die aan deze offerte zijn toegevoegd. Deze kunnen ook worden opgevraagd via onze website: www.labelbewust.nl en/of via de hierboven vermelde contactgegevens.',
    pricesTitle: 'Prijzen:',
    pricesText: 'De prijzen zijn gebaseerd op de volledige uitvoering van de in deze offerte omschreven werkzaamheden. Bij gedeeltelijke aanvaarding behoudt Labelbewust B.V. zich het recht voor om afwijkende prijzen te hanteren.',
    paymentTitle: 'Betaling:',
    paymentOnOrder: 'Bij opdracht:',
    paymentAtStart: 'Bij aanvang werkzaamheden:',
    paymentOnCompletion: 'Bij oplevering:',
    paymentTerm: 'Betalingstermijn van 14 dag(en), tenzij schriftelijk anders overeengekomen.',
    quoteFinalText: 'Deze offerte is vrijblijvend en onder voorbehoud van goedkeuring door de directie van Labelbewust B.V. Uw opdracht voor levering/uitvoering wordt definitief zodra Labelbewust B.V. deze schriftelijk heeft bevestigd of met de uitvoering van de opdracht is begonnen. De geldigheid van deze offerte bedraagt twee weken vanaf de offertedatum. Door ondertekening van deze offerte bevestigt u dat u kennis heeft genomen van onze algemene voorwaarden.',

    // Signature section
    signatureText: 'Door ondertekening van deze offerte komt de aannemingsovereenkomst tot stand.',
    kindRegards: 'Met vriendelijke groet,',
    salesTeam: 'Verkoopteam Labelbewust BV',
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
    phoneNumber: 'Phone number',
    projectDetails: 'Project details',
    date: 'Date',
    quoteNumber: 'Quote number',
    reference: 'Reference',
    validity: 'Validity',

    // Company slogan
    companySlogan: 'The contractor of the Netherlands',
    companyTagline: 'The contractor you can build on',

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

    // Quote letter content
    dearSirMadam: 'Dear Sir/Madam,',
    quoteIntro: 'Attached is a non-binding quotation for the supply and execution of the products and services you requested.',
    workLocationIntro: 'The work to be carried out at',
    deliveryTitle: 'Delivery/Execution:',
    deliveryText: 'Work will commence within eight weeks after the order, provided that all necessary components, materials, designs, and construction reports can be delivered by our suppliers within this timeframe. The delivery and execution will be in accordance with our general terms and conditions, which are attached to this offer. These can also be requested via our website: www.labelbewust.nl and/or through the contact details above.',
    pricesTitle: 'Prices:',
    pricesText: 'Prices are based on the full completion of the work outlined in this quotation. In the case of partial acceptance, Labelbewust B.V. reserves the right to apply different prices.',
    paymentTitle: 'Payment:',
    paymentOnOrder: 'Upon order:',
    paymentAtStart: 'At the start of the work:',
    paymentOnCompletion: 'Upon completion:',
    paymentTerm: 'Payment term of 14 day(s), unless agreed otherwise in writing.',
    quoteFinalText: 'This offer is non-binding and is made subject to approval by the management of Labelbewust B.V. Your order for delivery/execution will become final once Labelbewust B.V. has confirmed it in writing or has commenced the execution of the order. The validity of this quotation is two weeks from the date of the offer. By signing this offer, you confirm that you are aware of our general terms and conditions.',

    // Signature section
    signatureText: 'By signing this quote, the construction agreement is established.',
    kindRegards: 'Kind regards,',
    salesTeam: 'Sales team Labelbewust BV',
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
