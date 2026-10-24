import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { emptyProfileForm, parseProfileForm, type ParsedProfile, type ProfileForm } from '@/lib/profileForm';

type ProfileState = ParsedProfile & {
  form: ProfileForm;
  updateForm: (changes: Partial<ProfileForm>) => void;
  resetForm: () => void;
  // Whether the welcome screen has been dismissed since the app opened.
  seenWelcome: boolean;
  markWelcomeSeen: () => void;
  // College ids the student saved, newest first. In memory only.
  saved: string[];
  toggleSaved: (collegeId: string) => void;
};

const ProfileContext = createContext<ProfileState | null>(null);

// Holds what the student typed on the profile screen so the college list and
// college pages can compare against it. It lives in memory only: nothing the
// student enters is saved or sent anywhere.
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [form, setForm] = useState<ProfileForm>(emptyProfileForm);
  const [seenWelcome, setSeenWelcome] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);

  const value = useMemo<ProfileState>(() => {
    return {
      ...parseProfileForm(form),
      form,
      updateForm: (changes) => setForm((f) => ({ ...f, ...changes })),
      resetForm: () => setForm(emptyProfileForm),
      seenWelcome,
      markWelcomeSeen: () => setSeenWelcome(true),
      saved,
      toggleSaved: (id) => setSaved((list) => (list.includes(id) ? list.filter((x) => x !== id) : [id, ...list])),
    };
  }, [form, seenWelcome, saved]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileState {
  const state = useContext(ProfileContext);
  if (!state) throw new Error('useProfile must be used inside ProfileProvider.');
  return state;
}
