import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
}

interface DealsState {
  deals: Deal[];
  loading: boolean;
}

const initialState: DealsState = {
  deals: [],
  loading: false,
};

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    setDeals: (state, action: PayloadAction<Deal[]>) => {
      state.deals = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setDeals, setLoading } = dealsSlice.actions;
export default dealsSlice.reducer;
