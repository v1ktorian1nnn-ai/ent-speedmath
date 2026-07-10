import React, { createContext, useContext, useState, useMemo } from "react";
import ru from "./ru";
import kk from "./kk";

const dictionaries = { ru, kk };

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ru");

  const setLanguage = (l) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  const t = useMemo(() => dictionaries[lang] || dictionaries.ru, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n должен использоваться внутри I18nProvider");
  return ctx;
}
