import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MemberRegistration } from '../types';
import { KENYA_COUNTIES } from '../data/kenyaData';
import { 
  CheckCircle2, 
  Circle, 
  User, 
  MapPin, 
  ShieldCheck, 
  CreditCard, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Smartphone, 
  HelpCircle, 
  Info, 
  QrCode, 
  Download, 
  Share2, 
  Sparkles,
  Phone,
  Check,
  AlertCircle
} from 'lucide-react';

export const RegistrationStepperSection: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<MemberRegistration>({
    fullName: '',
    mobileNumber: '',
    email: '',
    dateOfBirth: '',
    preferredLanguage: 'Swahili',
    occupation: '',
    areaOfInterest: 'Youth Advocacy',
    county: 'Nairobi',
    constituency: 'Westlands',
    ward: 'Parklands/Highridge',
    physicalAddress: '',
    isKenyanCitizen: false,
    isInfoAccurate: false,
    acceptConstitution: false,
    consentDataProcessing: false,
    paymentMobileNumber: '',
    confirmPaymentMobileNumber: '',
    transactionRef: '',
    memberId: ''
  });

  // Available constituencies based on selected county
  const availableConstituencies = KENYA_COUNTIES[formData.county] || ['Central Ward', 'North Ward', 'South Ward'];

  const handleCountyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCounty = e.target.value;
    const firstConstituency = (KENYA_COUNTIES[selectedCounty] && KENYA_COUNTIES[selectedCounty][0]) || '';
    setFormData(prev => ({
      ...prev,
      county: selectedCounty,
      constituency: firstConstituency
    }));
  };

  const validateStep = (step: number): boolean => {
    const errors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.fullName.trim()) errors.fullName = 'Full legal name is required.';
      if (!formData.mobileNumber.trim()) errors.mobileNumber = 'Mobile phone number is required.';
      if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Valid email address is required.';
      if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required.';
      if (!formData.occupation.trim()) errors.occupation = 'Occupation is required.';
    } else if (step === 2) {
      if (!formData.county) errors.county = 'Please select a county.';
      if (!formData.constituency) errors.constituency = 'Please select a constituency.';
      if (!formData.ward.trim()) errors.ward = 'Ward name is required.';
    } else if (step === 3) {
      if (!formData.isKenyanCitizen) errors.isKenyanCitizen = 'You must be a Kenyan citizen 18+ to register.';
      if (!formData.isInfoAccurate) errors.isInfoAccurate = 'Please confirm that your details are accurate.';
      if (!formData.acceptConstitution) errors.acceptConstitution = 'You must accept the DCP constitution.';
      if (!formData.consentDataProcessing) errors.consentDataProcessing = 'Consent to data processing is required.';
    } else if (step === 4) {
      if (!formData.paymentMobileNumber.trim()) errors.paymentMobileNumber = 'M-Pesa payment mobile number is required.';
      if (formData.paymentMobileNumber !== formData.confirmPaymentMobileNumber) {
        errors.confirmPaymentMobileNumber = 'Payment phone numbers do not match.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: document.getElementById('registration')?.offsetTop || 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setFormErrors({});
    }
  };

  const handleSimulatePayment = () => {
    if (!validateStep(4)) return;

    setIsProcessingPayment(true);
    setTimeout(() => {
      const generatedRef = `MPESA-${Math.floor(100000 + Math.random() * 900000)}`;
      const generatedMemberId = `DCP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      
      setFormData(prev => ({
        ...prev,
        transactionRef: generatedRef,
        memberId: generatedMemberId,
        paymentTimestamp: new Date().toLocaleString(),
        isCompleted: true
      }));

      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      setCurrentStep(5);
    }, 2500);
  };

  const steps = [
    { num: 1, label: "Personal Details", icon: User },
    { num: 2, label: "Location", icon: MapPin },
    { num: 3, label: "Declaration", icon: ShieldCheck },
    { num: 4, label: "Payment", icon: CreditCard },
    { num: 5, label: "Confirmation", icon: Award }
  ];

  return (
    <section id="registration" className="py-20 bg-slate-100 text-slate-900 relative">
      
      {/* Kenyan Flag Strip Top Visual Accent */}
      <div className="absolute top-0 inset-x-0 h-1.5 kenya-flag-strip" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Official Registration Portal</span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
            DCP MEMBERSHIP STEPPER
          </h2>
          <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-600">
            <span>Registration Fee: <span className="text-[#00843D] font-black">KES 100</span></span>
            <span>•</span>
            <span>Step {currentStep} of {steps.length} ({Math.round((currentStep / steps.length) * 100)}% Complete)</span>
          </div>
        </div>

        {/* Stepper Bar Header Navigation with Animated Progress Bar */}
        <div className="bg-white border-2 border-slate-900 rounded-lg overflow-hidden mb-8 shadow-sm">
          {/* Animated Progress Bar Track */}
          <div className="w-full bg-slate-200 h-3 relative overflow-hidden border-b border-slate-300">
            <motion.div 
              className="bg-gradient-to-r from-[#00843D] via-emerald-500 to-green-600 h-full relative flex items-center justify-end"
              initial={{ width: `${((currentStep - 1) / steps.length) * 100}%` }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/* Pulsing leading glow effect */}
              <div className="w-3 h-full bg-white/40 animate-pulse rounded-r-full shadow-sm" />
            </motion.div>
          </div>

          <div className="flex text-[10px] font-black uppercase tracking-wider">
            {steps.map((step) => {
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num;

              return (
                <button
                  key={step.num}
                  onClick={() => {
                    if (isCompleted || currentStep >= step.num) setCurrentStep(step.num);
                  }}
                  className={`flex-1 py-3 text-center transition-all cursor-pointer relative ${
                    isActive 
                      ? 'bg-[#00843D] text-white' 
                      : isCompleted 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-slate-50 text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {step.num}. {step.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Stepper Interface */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg relative">
            
            {/* STEP 1: PERSONAL DETAILS */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    Step 1: Personal Details
                  </h3>
                  <p className="text-xs text-slate-500">Provide your official identification and contact information.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Full Legal Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Legal Name (As per National ID) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Wanjiku Mary Mwangi"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        formErrors.fullName ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:ring-emerald-500'
                      }`}
                    />
                    {formErrors.fullName && <p className="text-xs text-red-500 mt-1">{formErrors.fullName}</p>}
                  </div>

                  {/* Mobile Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g., 0712 345 678"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value, paymentMobileNumber: e.target.value, confirmPaymentMobileNumber: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        formErrors.mobileNumber ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:ring-emerald-500'
                      }`}
                    />
                    {formErrors.mobileNumber && <p className="text-xs text-red-500 mt-1">{formErrors.mobileNumber}</p>}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g., mary.wanjiku@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        formErrors.email ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:ring-emerald-500'
                      }`}
                    />
                    {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        formErrors.dateOfBirth ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:ring-emerald-500'
                      }`}
                    />
                    {formErrors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{formErrors.dateOfBirth}</p>}
                  </div>

                  {/* Preferred Language */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Preferred Language
                    </label>
                    <select
                      value={formData.preferredLanguage}
                      onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="Swahili">Kiswahili</option>
                      <option value="English">English</option>
                      <option value="Sheng">Sheng</option>
                      <option value="Vernacular">Local Vernacular Dialect</option>
                    </select>
                  </div>

                  {/* Occupation */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Occupation / Sector *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Farmer, Business Owner, Student, Teacher"
                      value={formData.occupation}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        formErrors.occupation ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:ring-emerald-500'
                      }`}
                    />
                    {formErrors.occupation && <p className="text-xs text-red-500 mt-1">{formErrors.occupation}</p>}
                  </div>

                  {/* Area of Interest */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Primary Area of Interest
                    </label>
                    <select
                      value={formData.areaOfInterest}
                      onChange={(e) => setFormData({ ...formData, areaOfInterest: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="Youth Advocacy">Youth Advocacy & Employment</option>
                      <option value="Agriculture & Farming">Agriculture & Food Security</option>
                      <option value="Education Policy">Education & Skill Training</option>
                      <option value="Devolution & Ward Funds">Devolution & County Governance</option>
                      <option value="Women & Inclusion">Women Empowerment & PWD Rights</option>
                      <option value="Business & Jua Kali">Small Business & Jua Kali Sector</option>
                    </select>
                  </div>

                </div>
              </div>
            )}

            {/* STEP 2: LOCATION */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    Step 2: Location & Devolution Unit
                  </h3>
                  <p className="text-xs text-slate-500">Select your county, constituency, and ward to connect with your local DCP chapter.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* County Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      County *
                    </label>
                    <select
                      value={formData.county}
                      onChange={handleCountyChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      {Object.keys(KENYA_COUNTIES).map(county => (
                        <option key={county} value={county}>{county} County</option>
                      ))}
                    </select>
                  </div>

                  {/* Constituency Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Constituency *
                    </label>
                    <select
                      value={formData.constituency}
                      onChange={(e) => setFormData({ ...formData, constituency: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      {availableConstituencies.map(constituency => (
                        <option key={constituency} value={constituency}>{constituency}</option>
                      ))}
                    </select>
                  </div>

                  {/* Ward */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Ward *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Parklands / Highridge Ward"
                      value={formData.ward}
                      onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        formErrors.ward ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:ring-emerald-500'
                      }`}
                    />
                    {formErrors.ward && <p className="text-xs text-red-500 mt-1">{formErrors.ward}</p>}
                  </div>

                  {/* Physical Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Physical / Postal Address (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., P.O. Box 1234, Nairobi"
                      value={formData.physicalAddress}
                      onChange={(e) => setFormData({ ...formData, physicalAddress: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                </div>

                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-xs text-emerald-900 flex items-start space-x-3">
                  <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Devolution Note:</strong> Your county selection assigns you automatically to the local DCP ward assembly and county coordinator office for participatory budgeting and townhall meetings.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: DECLARATION */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    Step 3: Citizen Declaration
                  </h3>
                  <p className="text-xs text-slate-500">Please review and confirm your eligibility and commitment to party values.</p>
                </div>

                <div className="space-y-3 pt-2">
                  
                  <label className="flex items-start space-x-3 p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isKenyanCitizen}
                      onChange={(e) => setFormData({ ...formData, isKenyanCitizen: e.target.checked })}
                      className="mt-1 w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <div className="text-xs text-slate-800">
                      <span className="font-bold block text-sm">Kenyan Citizenship & Age Declaration</span>
                      I confirm that I am a Kenyan citizen aged 18 years or older with a valid National ID or Passport.
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isInfoAccurate}
                      onChange={(e) => setFormData({ ...formData, isInfoAccurate: e.target.checked })}
                      className="mt-1 w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <div className="text-xs text-slate-800">
                      <span className="font-bold block text-sm">Information Accuracy</span>
                      I declare that all personal and location details submitted above are true, accurate, and complete.
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.acceptConstitution}
                      onChange={(e) => setFormData({ ...formData, acceptConstitution: e.target.checked })}
                      className="mt-1 w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <div className="text-xs text-slate-800">
                      <span className="font-bold block text-sm">Accept DCP Constitution & Values</span>
                      I agree to uphold the constitution, principles, and Skiza Wakenya code of conduct of Democracy for the Citizens Party.
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consentDataProcessing}
                      onChange={(e) => setFormData({ ...formData, consentDataProcessing: e.target.checked })}
                      className="mt-1 w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <div className="text-xs text-slate-800">
                      <span className="font-bold block text-sm">Data Protection Consent</span>
                      I consent to the processing of my data in accordance with the Kenya Data Protection Act 2019 for party administration and official updates.
                    </div>
                  </label>

                </div>

                {Object.keys(formErrors).length > 0 && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs font-medium rounded-xl border border-red-200 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Please accept all required declarations above to proceed to payment.</span>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: PAYMENT */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    Step 4: One-Time Registration Fee (KES 100)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pay KES 100 via M-Pesa to finalize your citizen membership registration.
                  </p>
                </div>

                {/* M-Pesa Payment Box */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-3xl text-white space-y-6 shadow-xl border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white text-lg">
                        M
                      </div>
                      <div>
                        <p className="font-extrabold text-white text-base">M-PESA Express</p>
                        <p className="text-xs text-slate-400">STK Push Direct Checkout</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-400">KES 100</span>
                      <span className="block text-[10px] text-slate-400 uppercase">One-Time Fee</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        M-Pesa Mobile Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g., 0712 345 678"
                        value={formData.paymentMobileNumber}
                        onChange={(e) => setFormData({ ...formData, paymentMobileNumber: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      {formErrors.paymentMobileNumber && (
                        <p className="text-xs text-red-400 mt-1">{formErrors.paymentMobileNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Confirm M-Pesa Mobile Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="Re-enter M-Pesa number"
                        value={formData.confirmPaymentMobileNumber}
                        onChange={(e) => setFormData({ ...formData, confirmPaymentMobileNumber: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      {formErrors.confirmPaymentMobileNumber && (
                        <p className="text-xs text-red-400 mt-1">{formErrors.confirmPaymentMobileNumber}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleSimulatePayment}
                    disabled={isProcessingPayment}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl text-base shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer border-b-4 border-emerald-800 disabled:opacity-50"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        <span>Sending M-Pesa STK Prompt to Phone...</span>
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-5 h-5" />
                        <span>Pay KES 100 via M-Pesa STK</span>
                      </>
                    )}
                  </button>

                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start space-x-2">
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Secured by Safaricom M-Pesa & Kenya Political Parties Act compliance. You will receive an instant PIN pop-up on your handset.
                  </span>
                </div>
              </div>
            )}

            {/* STEP 5: CONFIRMATION */}
            {currentStep === 5 && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                  <Award className="w-10 h-10" />
                </div>

                <div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full uppercase tracking-wider">
                    Registration Submitted
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                    Welcome to DCP Skiza Wakenya!
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto mt-1">
                    Your registration payment of KES 100 has been verified. Here is your official Digital Member Certificate & Card.
                  </p>
                </div>

                {/* Digital Member Card Preview */}
                <div className="bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/50 shadow-2xl text-left relative overflow-hidden my-6">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute top-0 inset-x-0 h-1.5 kenya-flag-strip" />

                  <div className="flex justify-between items-start pb-4 border-b border-slate-800">
                    <div>
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                        Democracy for the Citizens Party
                      </p>
                      <p className="text-xl font-extrabold text-white">Digital Membership Card</p>
                    </div>
                    <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase">
                      ACTIVE
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6 items-center">
                    <div className="sm:col-span-2 space-y-2">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Member Name</p>
                        <p className="text-lg font-bold text-white">{formData.fullName || "Wanjiku Mary"}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Member ID</p>
                          <p className="font-mono font-bold text-emerald-400">{formData.memberId || "DCP-2026-88492"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">County</p>
                          <p className="font-bold text-slate-200">{formData.county} County</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Constituency</p>
                          <p className="font-bold text-slate-200">{formData.constituency}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">M-Pesa Ref</p>
                          <p className="font-mono text-emerald-300">{formData.transactionRef || "MPESA-849201"}</p>
                        </div>
                      </div>
                    </div>

                    {/* QR Code Graphic */}
                    <div className="bg-white p-3 rounded-2xl flex flex-col items-center justify-center text-slate-900 shadow-md">
                      <QrCode className="w-16 h-16 text-slate-900" />
                      <span className="text-[9px] font-mono font-bold mt-1 text-slate-600">SCAN TO VERIFY</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between items-center">
                    <span>Cert No: 103 · Political Parties Act</span>
                    <span>Issued: {formData.paymentTimestamp || new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => alert(`Membership Card PDF Downloaded for ${formData.fullName}`)}
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Digital Card (PDF)</span>
                  </button>

                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'DCP Skiza Wakenya Member',
                          text: `I just registered as an official member of Democracy for the Citizens Party (DCP)!`,
                          url: window.location.href
                        }).catch(() => {});
                      } else {
                        alert('Link copied to clipboard!');
                      }
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer border border-slate-700"
                  >
                    <Share2 className="w-4 h-4 text-emerald-400" />
                    <span>Share Registration</span>
                  </button>
                </div>

              </div>
            )}

            {/* Stepper Navigation Buttons */}
            {currentStep < 5 && (
              <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent flex items-center space-x-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentStep < 4 && (
                  <button
                    onClick={handleNext}
                    className="px-7 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer border-b-2 border-emerald-800"
                  >
                    <span>Continue to Step 0{currentStep + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

          </div>

          {/* Right Column: Sticky Informational Cards (Exact requested content) */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            
            {/* Card 1: Registration Fee */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Membership Standard</span>
                <h4 className="text-xl font-extrabold text-slate-900">Registration Fee - KES 100</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                One-time membership fee. This single contribution goes directly towards local ward grassroots mobilization, townhall organization, and member card processing across all 47 counties.
              </p>
            </div>

            {/* Card 2: Eligibility */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-emerald-400 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">Eligibility Checklist</h4>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Be a Kenyan citizen</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Be at least 18 years old</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Accept the DCP constitution</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Provide accurate information</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pay the registration fee (KES 100)</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Please Note */}
            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-3 text-amber-900">
              <div className="flex items-center space-x-2 font-extrabold text-amber-900 text-sm">
                <Info className="w-5 h-5 text-amber-700 shrink-0" />
                <span>Please Note</span>
              </div>
              <p className="text-xs leading-relaxed text-amber-800">
                Registration and payment do not automatically confirm membership. Applications may be reviewed in accordance with party rules, constitutional guidelines, and the Registrar of Political Parties regulations.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
