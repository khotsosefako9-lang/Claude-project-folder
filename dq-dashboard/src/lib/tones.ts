import type { Tone } from '../ui/kit';

export const statusTone = (s?: string): Tone => {
  switch (s) {
    case 'Sent (no reply yet)': return 'info';
    case 'Said yes (sample sent)': return 'ok';
    case 'Interested (book a call)': return 'ok';
    case 'Client (signed)': return 'accent';
    case 'On hold': return 'warn';
    case 'No reply (do not message again)': return 'faint';
    case 'Not interested (never contact again)': return 'bad';
    default: return 'neutral';
  }
};

export const shortStatus = (s?: string) => (s ?? 'Not set').replace(/\s*\(.*\)/, '');

export const stageTone = (s?: string): Tone => {
  switch (s) {
    case 'Permission requested': case 'Pending send verification': return 'info';
    case 'Consented': case 'Call booked': case 'Scope agreed': return 'ok';
    case 'Paid subscriber': return 'accent';
    case 'Email bounced': return 'bad';
    case 'Closed (not a fit)': return 'faint';
    default: return 'neutral';
  }
};

export const POSITIVE = ['Said yes (sample sent)', 'Interested (book a call)', 'Client (signed)'];
export const CONTACTED_STAGES = ['Permission requested', 'Consented', 'Call booked', 'Scope agreed', 'Paid subscriber', 'Email bounced'];
