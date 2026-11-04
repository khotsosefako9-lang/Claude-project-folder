// Field definitions for every record type. Forms and tables are built from these.

export type FieldType = 'text' | 'textarea' | 'select' | 'date' | 'number' | 'money' | 'bool' | 'url';
export type Field = { key: string; label: string; type?: FieldType; options?: string[]; full?: boolean; hint?: string; placeholder?: string };
export type Section = { title: string; fields: Field[] };

export const OUTREACH_STATUSES = [
  'To send',
  'Sent (no reply yet)',
  'Said yes (sample sent)',
  'Interested (book a call)',
  'Client (signed)',
  'On hold',
  'No reply (do not message again)',
  'Not interested (never contact again)',
];

export const PIPELINE_STAGES = [
  'Researched',
  'Pending send verification',
  'Permission requested',
  'Consented',
  'Call booked',
  'Scope agreed',
  'Paid subscriber',
  'Email bounced',
  'Closed (not a fit)',
];

export const PLANS = ['Launch month', 'Starter', 'Growth'];
export const CLIENT_STATUSES = ['Onboarding', 'Active', 'Paused', 'Cancelled'];
export const INVOICE_STATUSES = ['Draft', 'Sent', 'Paid', 'Cancelled'];
export const EXPENSE_CATEGORIES = ['Software and tools', 'Data and research', 'Phone and data', 'Marketing', 'Travel', 'Admin and fees', 'Other'];
export const TASK_TYPES = ['Call', 'Email', 'WhatsApp', 'Follow-up', 'Callback', 'Delivery', 'Admin'];
export const TENDER_KINDS = ['Outreach hook', 'Opportunity'];
export const TENDER_STATUSES = ['Watching', 'Approved', 'On hold: verify first', 'Matched to client', 'Bid in progress', 'Submitted', 'Won', 'Lost', 'Expired'];
export const SECTORS = ['Security', 'Cleaning', 'Fire protection', 'HVAC', 'Electrical', 'Landscaping', 'Pest control', 'Other'];
export const CHANNELS = ['Email', 'WhatsApp', 'Call', 'LinkedIn'];

export const firmSections: Section[] = [
  {
    title: 'Status and next step',
    fields: [
      { key: 'status', label: 'Status', type: 'select', options: OUTREACH_STATUSES },
      { key: 'contactDate', label: 'First contact', type: 'date' },
      { key: 'due', label: 'Callback / due', type: 'date' },
      { key: 'dueNote', label: 'Due note', placeholder: 'e.g. after 14:00 SAST' },
      { key: 'nextStep', label: 'Next step', type: 'textarea', full: true },
      { key: 'outcome', label: 'Latest outcome', type: 'textarea', full: true },
    ],
  },
  {
    title: 'Firm',
    fields: [
      { key: 'business', label: 'Business name', full: true },
      { key: 'sector', label: 'Sector', type: 'select', options: SECTORS },
      { key: 'tier', label: 'Tier', type: 'select', options: ['A', 'B', 'C'] },
      { key: 'batch', label: 'Batch', placeholder: 'Batch 3' },
      { key: 'area', label: 'Area / address' },
      { key: 'services', label: 'Services', type: 'textarea', full: true },
      { key: 'yearsInBusiness', label: 'Years in business' },
      { key: 'size', label: 'Size' },
      { key: 'whyFit', label: 'Why they fit', type: 'textarea', full: true },
      { key: 'fitCheck', label: 'Fit check', full: true },
    ],
  },
  {
    title: 'Contact',
    fields: [
      { key: 'channel', label: 'Channel', type: 'select', options: CHANNELS },
      { key: 'sendTo', label: 'Send to' },
      { key: 'whoToContact', label: 'Who to contact' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Listed email', full: true },
      { key: 'firstLine', label: 'Personal first line', type: 'textarea', full: true },
      { key: 'messageToSend', label: 'Message to send' },
    ],
  },
  {
    title: 'LinkedIn',
    fields: [
      { key: 'linkedinContact', label: 'Contact' },
      { key: 'linkedinState', label: 'State' },
      { key: 'linkedinProfile', label: 'Profile link', type: 'url', full: true },
    ],
  },
  {
    title: 'Notes and source',
    fields: [
      { key: 'notes', label: 'Notes', type: 'textarea', full: true },
      { key: 'source', label: 'Source', type: 'url', full: true },
    ],
  },
];

export const pipelineSections: Section[] = [
  {
    title: 'Stage',
    fields: [
      { key: 'stage', label: 'Stage', type: 'select', options: PIPELINE_STAGES },
      { key: 'consent', label: 'Consent' },
      { key: 'sentDate', label: 'Request sent', type: 'date' },
      { key: 'callTime', label: 'Call time (SAST)' },
      { key: 'callConfirmed', label: 'Call confirmed', type: 'bool' },
      { key: 'scopeAgreed', label: 'Scope agreed', type: 'bool' },
      { key: 'recurringAgreed', label: 'Recurring agreed', type: 'bool' },
      { key: 'cashReceived', label: 'Cash received', type: 'money' },
      { key: 'nextAction', label: 'Next action', type: 'textarea', full: true },
    ],
  },
  {
    title: 'Account',
    fields: [
      { key: 'business', label: 'Business', full: true },
      { key: 'city', label: 'City' },
      { key: 'service', label: 'Service' },
      { key: 'priority', label: 'Priority', type: 'select', options: ['A', 'B', 'C'] },
      { key: 'code', label: 'ID' },
      { key: 'contactRoute', label: 'Contact route', full: true },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
    ],
  },
  {
    title: 'Research',
    fields: [
      { key: 'verifiedFit', label: 'Verified fit', type: 'textarea', full: true },
      { key: 'lane', label: 'Exclusive lane to check', full: true },
      { key: 'budget', label: 'Budget' },
      { key: 'authority', label: 'Authority' },
      { key: 'unknowns', label: 'Unknowns', type: 'textarea', full: true },
      { key: 'contactSource', label: 'Contact source', type: 'url', full: true },
      { key: 'serviceSource', label: 'Service source', type: 'url', full: true },
      { key: 'evidenceChecked', label: 'Evidence checked', type: 'date' },
      { key: 'trackerMatch', label: 'Old tracker match' },
      { key: 'sentMessageId', label: 'Sent message ID' },
      { key: 'replyThreadId', label: 'Reply thread ID' },
    ],
  },
];

export const pipelineMessages: Field[] = [
  { key: 'subject', label: 'Subject' },
  { key: 'permissionRequest', label: 'Permission request' },
  { key: 'afterConsent', label: 'After consent' },
  { key: 'callBrief', label: '15-minute call brief' },
  { key: 'consentedFollowUp', label: 'Consented follow-up' },
];

export const clientSections: Section[] = [
  {
    title: 'Subscription',
    fields: [
      { key: 'name', label: 'Business name', full: true },
      { key: 'status', label: 'Status', type: 'select', options: CLIENT_STATUSES },
      { key: 'plan', label: 'Plan', type: 'select', options: PLANS },
      { key: 'monthlyFee', label: 'Monthly fee', type: 'money' },
      { key: 'foundingRate', label: 'Founding client rate', type: 'bool' },
      { key: 'startDate', label: 'Start date', type: 'date' },
      { key: 'minTermEnd', label: 'Minimum term ends', type: 'date', hint: 'Launch month, then a 3-month minimum' },
      { key: 'billingDay', label: 'Billing day', type: 'number' },
    ],
  },
  {
    title: 'Client',
    fields: [
      { key: 'sector', label: 'Service', type: 'select', options: SECTORS },
      { key: 'city', label: 'City' },
      { key: 'contactName', label: 'Contact person' },
      { key: 'contactRole', label: 'Role' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'territory', label: 'Exclusive territory', full: true, hint: 'One firm per service, per city' },
      { key: 'notes', label: 'Notes', type: 'textarea', full: true },
    ],
  },
];

export const deliveryFields: Field[] = [
  { key: 'month', label: 'Month', placeholder: '2026-11' },
  { key: 'prospects', label: 'Prospects delivered (of 20)', type: 'number' },
  { key: 'reportSent', label: 'Report sent', type: 'bool' },
  { key: 'tendersMatched', label: 'Tenders matched', type: 'number' },
  { key: 'bidsPrepared', label: 'Bids prepared', type: 'number' },
  { key: 'complianceChecked', label: 'Compliance folder checked', type: 'bool' },
  { key: 'notes', label: 'Notes', type: 'textarea', full: true },
];

export const invoiceFields: Field[] = [
  { key: 'number', label: 'Invoice number' },
  { key: 'client', label: 'Client' },
  { key: 'description', label: 'Description', full: true },
  { key: 'amount', label: 'Amount', type: 'money' },
  { key: 'status', label: 'Status', type: 'select', options: INVOICE_STATUSES },
  { key: 'issueDate', label: 'Issued', type: 'date' },
  { key: 'dueDate', label: 'Due', type: 'date' },
  { key: 'paidDate', label: 'Paid on', type: 'date' },
  { key: 'notes', label: 'Notes', type: 'textarea', full: true },
];

export const expenseFields: Field[] = [
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'category', label: 'Category', type: 'select', options: EXPENSE_CATEGORIES },
  { key: 'description', label: 'Description', full: true },
  { key: 'amount', label: 'Amount', type: 'money' },
  { key: 'recurring', label: 'Monthly recurring', type: 'bool' },
];

export const taskFields: Field[] = [
  { key: 'title', label: 'Task', full: true },
  { key: 'due', label: 'Due', type: 'date' },
  { key: 'type', label: 'Type', type: 'select', options: TASK_TYPES },
  { key: 'related', label: 'Related to', placeholder: 'Firm or client' },
  { key: 'done', label: 'Done', type: 'bool' },
  { key: 'notes', label: 'Notes', type: 'textarea', full: true },
];

export const tenderFields: Field[] = [
  { key: 'kind', label: 'Type', type: 'select', options: TENDER_KINDS },
  { key: 'status', label: 'Status', type: 'select', options: TENDER_STATUSES },
  { key: 'title', label: 'Title / subject line', full: true },
  { key: 'code', label: 'Code' },
  { key: 'forSector', label: 'For', type: 'select', options: SECTORS },
  { key: 'reference', label: 'Tender reference' },
  { key: 'buyer', label: 'Buyer' },
  { key: 'closing', label: 'Closing date', type: 'date' },
  { key: 'useWindow', label: 'Use window' },
  { key: 'useUntil', label: 'Use until', type: 'date' },
  { key: 'verified', label: 'Facts verified', type: 'bool' },
  { key: 'line', label: 'Tender line (email)', type: 'textarea', full: true },
  { key: 'shortLine', label: 'Short line (WhatsApp and calls)', type: 'textarea', full: true },
  { key: 'source', label: 'Source', full: true },
  { key: 'notes', label: 'Notes', type: 'textarea', full: true },
];

export const templateFields: Field[] = [
  { key: 'name', label: 'Name', full: true },
  { key: 'channel', label: 'Channel', type: 'select', options: ['Email', 'WhatsApp', 'Call', 'Any'] },
  { key: 'whenToUse', label: 'When to use it', type: 'textarea', full: true },
  { key: 'text', label: 'Text', type: 'textarea', full: true },
];

export const flagFields: Field[] = [
  { key: 'item', label: 'Item' },
  { key: 'resolved', label: 'Resolved', type: 'bool' },
  { key: 'issue', label: 'Issue', type: 'textarea', full: true },
  { key: 'handling', label: 'Handling', type: 'textarea', full: true },
  { key: 'resolution', label: 'How it was resolved', type: 'textarea', full: true },
  { key: 'source', label: 'Source', full: true },
];

export const exclusionFields: Field[] = [
  { key: 'business', label: 'Business', full: true },
  { key: 'type', label: 'Type' },
  { key: 'list', label: 'List' },
  { key: 'whatItIs', label: 'What it is', full: true },
  { key: 'reason', label: 'Why left out', type: 'textarea', full: true },
];

export const seoFields: Field[] = [
  { key: 'priority', label: 'Priority', type: 'select', options: ['P1', 'P2', 'P3'] },
  { key: 'status', label: 'Status' },
  { key: 'area', label: 'Area', full: true },
  { key: 'observed', label: 'Observed state', type: 'textarea', full: true },
  { key: 'action', label: 'Action', type: 'textarea', full: true },
  { key: 'source', label: 'Source', type: 'url', full: true },
];

export const buyerFields: Field[] = [
  { key: 'organisation', label: 'Organisation / site', full: true },
  { key: 'code', label: 'ID' },
  { key: 'city', label: 'City' },
  { key: 'contactStatus', label: 'Contact status', type: 'select', options: ['Not contacted', 'Contacted', 'In conversation', 'Not a fit'] },
  { key: 'serviceFit', label: 'Possible service fit', full: true },
  { key: 'fact', label: 'Verified fact', type: 'textarea', full: true },
  { key: 'decisionRoute', label: 'Decision route to establish', type: 'textarea', full: true },
  { key: 'publicRoute', label: 'Public route', full: true },
  { key: 'unknowns', label: 'Trigger / unknowns', type: 'textarea', full: true },
  { key: 'source', label: 'Source', type: 'url', full: true },
];

export const metaSections: Section[] = [
  {
    title: 'Business',
    fields: [
      { key: 'businessName', label: 'Business name' },
      { key: 'ownerName', label: 'Your name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'base', label: 'Listed base', full: true },
      { key: 'legalIdentity', label: 'Legal contracting identity', full: true },
      { key: 'paymentRoute', label: 'Payment route', full: true },
      { key: 'callAvailability', label: 'Call availability', full: true },
      { key: 'exclusiveTerritories', label: 'Exclusive territories', full: true },
    ],
  },
  {
    title: 'Goals',
    fields: [
      { key: 'sprintName', label: 'Current sprint', full: true },
      { key: 'sprintStart', label: 'Sprint starts', type: 'date' },
      { key: 'sprintEnd', label: 'Sprint ends', type: 'date' },
      { key: 'sprintGoalClients', label: 'New paying clients goal', type: 'number' },
      { key: 'dailyOutreachTarget', label: 'Firms approached per day', type: 'number' },
      { key: 'mrrTarget', label: 'Monthly recurring revenue target', type: 'money' },
    ],
  },
  {
    title: 'Pricing',
    fields: [
      { key: 'priceLaunch', label: 'Launch month', type: 'money' },
      { key: 'priceStarter', label: 'Starter', type: 'money' },
      { key: 'priceStarterFounding', label: 'Starter founding rate', type: 'money' },
      { key: 'priceGrowth', label: 'Growth', type: 'money' },
      { key: 'priceGrowthFounding', label: 'Growth founding rate', type: 'money' },
      { key: 'extraBidMin', label: 'Extra bid from', type: 'money' },
      { key: 'extraBidMax', label: 'Extra bid up to', type: 'money' },
    ],
  },
  {
    title: 'Rules',
    fields: [
      { key: 'outreachRules', label: 'Outreach rules', type: 'textarea', full: true },
      { key: 'paidSubscriberDefinition', label: 'What counts as a paid subscriber', type: 'textarea', full: true },
    ],
  },
];
