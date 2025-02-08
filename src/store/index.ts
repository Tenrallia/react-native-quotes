import { useLocalObservable } from "mobx-react";
import { useEffect } from "react";
import { configure } from "mobx";

configure({
  enforceActions: "never",
});

const API_URL = "https://futures-api.poloniex.com/api/v2/tickers";

type QuotesStoreType = {
  quotes: [];
  loading: boolean;
  error: null | string;
  interval?: ReturnType<typeof setInterval> | null;
};

const initialState: QuotesStoreType = {
  quotes: [],
  loading: true,
  error: null,
  interval: null,
};

export function useQuotesStore() {
  const store = useLocalObservable(() => ({
    ...initialState,

    async fetchData() {
      try {
        store.error = null;
        const response = await fetch(API_URL);

        if (response) {
          const data = await response.json();
          store.quotes = data["data"];
          if (store.error) {
            store.error = null;
          }
          store.loading = false;
        }
      } catch (err) {
        store.error = "Ошибка загрузки данных. \n\n Пожалуйста подождите.";
        store.quotes = [];
        store.loading = false;
        console.error(err);
      } finally {
        store.loading = false;
      }
    },

    startFetching() {
      store.fetchData();
      store.interval = setInterval(() => store.fetchData(), 5000);
    },

    stopFetching() {
      clearInterval(store.interval);
    },
  }));

  useEffect(() => {
    return () => store.stopFetching(); // Очищаем интервал при размонтировании
  }, []);

  return store;
}
