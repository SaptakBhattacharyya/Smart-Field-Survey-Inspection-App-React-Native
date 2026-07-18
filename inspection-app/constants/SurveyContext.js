import React, { createContext, useState, useContext } from 'react';

const SurveyContext = createContext();

const initialDraft = {
  surveyId: 'SRV-1046',
  siteName: 'Metro Extension Phase 2',
  clientName: 'Urban Rail Corp',
  priority: 'High',
  date: new Date().toISOString().split('T')[0],
  description: 'Structural inspection and safety verification for elevated corridor.',
  photoUri: null,
  location: {
    latitude: 22.5726,
    longitude: 88.3639,
    accuracy: 4.5,
    address: 'Kolkata, West Bengal',
  },
  contact: {
    name: 'Ani Sharma',
    phoneNumber: '+91 98765 43210',
  },
  notes: 'All load-bearing structures checked. Minor surface rust on pillar #42.',
};

const initialSurveys = [
  {
    id: 'SRV-1042',
    siteName: 'Sector 5 Complex',
    clientName: 'TechPark Infra',
    priority: 'Low',
    date: '2026-07-12',
    description: 'Routine maintenance check for IT Park Substation.',
    photoUri: null,
    location: { latitude: 22.5735, longitude: 88.4331, accuracy: 3.2 },
    contact: { name: 'Rahul Verma', phoneNumber: '+91 91234 56789' },
    notes: 'Substation operating within normal parameters.',
    status: 'Completed',
  },
  {
    id: 'SRV-1043',
    siteName: 'Lake View Block B',
    clientName: 'Greenwood Housing',
    priority: 'Medium',
    date: '2026-07-14',
    description: 'Foundation stability inspection following monsoon rain.',
    photoUri: null,
    location: { latitude: 22.5810, longitude: 88.4120, accuracy: 5.0 },
    contact: { name: 'Priya Sundaram', phoneNumber: '+91 98300 12345' },
    notes: 'Soil erosion detected near east wing retaining wall.',
    status: 'Completed',
  },
  {
    id: 'SRV-1044',
    siteName: 'Highway 12 Overpass',
    clientName: 'State Road Auth',
    priority: 'Urgent',
    date: '2026-07-15',
    description: 'Emergency expansion joint inspection after heavy freight transport.',
    photoUri: null,
    location: { latitude: 22.6100, longitude: 88.4500, accuracy: 2.8 },
    contact: { name: 'Vikram Das', phoneNumber: '+91 94330 98765' },
    notes: 'Expansion joint #3 requires immediate sealant replacement.',
    status: 'Flagged',
  },
];

export const SurveyProvider = ({ children }) => {
  const [draftSurvey, setDraftSurvey] = useState(initialDraft);
  const [submittedSurveys, setSubmittedSurveys] = useState(initialSurveys);

  const generateNewId = () => {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `SRV-${num}`;
  };

  const updateDraft = (field, value) => {
    setDraftSurvey((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const setDraftPhoto = (photoUri) => {
    setDraftSurvey((prev) => ({ ...prev, photoUri }));
  };

  const setDraftLocation = (location) => {
    setDraftSurvey((prev) => ({ ...prev, location }));
  };

  const setDraftContact = (contact) => {
    setDraftSurvey((prev) => ({ ...prev, contact }));
  };

  const setDraftNotes = (notes) => {
    setDraftSurvey((prev) => ({ ...prev, notes }));
  };

  const clearDraft = () => {
    setDraftSurvey({
      surveyId: generateNewId(),
      siteName: '',
      clientName: '',
      priority: 'Medium',
      date: new Date().toISOString().split('T')[0],
      description: '',
      photoUri: null,
      location: null,
      contact: null,
      notes: '',
    });
  };

  const submitCurrentSurvey = () => {
    const newSurvey = {
      ...draftSurvey,
      id: draftSurvey.surveyId || generateNewId(),
      status: 'Submitted',
      submittedAt: new Date().toLocaleString(),
    };

    setSubmittedSurveys((prev) => [newSurvey, ...prev]);
    clearDraft();
    return newSurvey.id;
  };

  const deleteSurvey = (id) => {
    setSubmittedSurveys((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <SurveyContext.Provider
      value={{
        draftSurvey,
        setDraftSurvey,
        updateDraft,
        setDraftPhoto,
        setDraftLocation,
        setDraftContact,
        setDraftNotes,
        clearDraft,
        submitCurrentSurvey,
        submittedSurveys,
        deleteSurvey,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => useContext(SurveyContext);
export default SurveyContext;
