export interface Pillar {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: 'Social' | 'Economic' | 'Governance' | 'Infrastructure';
  icon: string;
  keyGoals: string[];
}

export interface MemberRegistration {
  // Step 1: Personal Details
  fullName: string;
  mobileNumber: string;
  email: string;
  dateOfBirth: string;
  preferredLanguage: string;
  occupation: string;
  areaOfInterest: string;

  // Step 2: Location
  county: string;
  constituency: string;
  ward: string;
  physicalAddress: string;

  // Step 3: Declaration
  isKenyanCitizen: boolean;
  isInfoAccurate: boolean;
  acceptConstitution: boolean;
  consentDataProcessing: boolean;

  // Step 4: Payment
  paymentMobileNumber: string;
  confirmPaymentMobileNumber: string;
  transactionRef?: string;
  paymentTimestamp?: string;

  // Step 5: Status
  memberId?: string;
  isCompleted?: boolean;
}

export interface CountyOffice {
  county: string;
  code: number;
  town: string;
  address: string;
  phone: string;
  email: string;
  coordinator: string;
}

export interface RallyPass {
  fullName: string;
  phone: string;
  email: string;
  county: string;
  passId: string;
  qrCodeUrl: string;
  issuedAt: string;
}
