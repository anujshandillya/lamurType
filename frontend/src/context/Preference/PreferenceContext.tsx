import { createContext, useContext, useEffect, useReducer } from "react";
import reducer from "./reducer";
import { type ProviderState } from "./types";

const PreferenceContext = createContext<ProviderState>({} as ProviderState);

// Function to update shadcn theme variables
const updateShadcnTheme = (theme: string) => {
  const root = document.documentElement;
  const bgVar = `--color-${theme}-bg`;
  const fontVar = `--color-${theme}-font`;
  const hlVar = `--color-${theme}-hl`;
  const fgVar = `--color-${theme}-fg`;

  root.style.setProperty('--shadcn-bg', `var(${bgVar})`);
  root.style.setProperty('--shadcn-font', `var(${fontVar})`);
  root.style.setProperty('--shadcn-hl', `var(${hlVar})`);
  root.style.setProperty('--shadcn-fg', `var(${fgVar})`);
};

export default function PreferenceProvider({ children }: { children: React.ReactNode }) {
    const [preference, dispatch] = useReducer(reducer, {
        theme: 'plain',
        fontFamily: 'poppins',
        isOpen: false,
        zenMode: false,
        type: 'words',
        time: '15'
    })

    useEffect(() => {
        if(typeof window !== undefined) {
            const theme = window.localStorage.getItem('theme') || 'default';
            const fontFamily = window.localStorage.getItem('fontFamily') || 'poppins';
            const type = window.localStorage.getItem('type') || 'words';
            const time = window.localStorage.getItem('time') || '15';
            const zenMode = JSON.parse(window.localStorage.getItem('zenMode') || 'false');

            if(theme) dispatch({ type: 'SET_THEME', payload: theme });
            if(fontFamily) dispatch({ type: 'SET_FONT_FAMILY', payload: fontFamily });
            if(type) dispatch({ type: 'SET_TYPE', payload: type });
            if(time) dispatch({ type: 'SET_TIME', payload: time });
            if(zenMode) dispatch({ type: 'SET_ZEN_MODE', payload: zenMode });
        }
    }, [])

    // Update shadcn theme when preference.theme changes
    useEffect(() => {
        updateShadcnTheme(preference.theme);
    }, [preference.theme]);

    return (
        <PreferenceContext.Provider value={{ preferences: preference, dispatch }}>
            {children}
        </PreferenceContext.Provider>
    )
}

export const usePreferenceContext = () => useContext(PreferenceContext);