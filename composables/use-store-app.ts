import dayjs from 'dayjs';
import { defineStore } from 'pinia';
interface State {
  state: {
    logs: string[];
  };
}
export const useStoreApp = defineStore({
  id: 'StoreApp',
  state: (): State => {
    return {
      state: {
        logs: [],
      },
    };
  },
  getters: {},
  actions: {
    log(data: string) {
      const text = dayjs().format('mm:ss ') + ' :: ' + data;
      this.state.logs.unshift(text);
      console.log(text);
    },
    err(data: string) {
      const text = dayjs().format('mm:ss ') + ' :: ' + data;
      this.state.logs.unshift(text);
      console.error(text);
    },
  },
});
