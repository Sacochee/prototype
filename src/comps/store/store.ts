// store.ts
import {
  configureStore,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { enumTextAlign } from "../editeur/commands/AlignText";
import { enumType } from "../editeur/commands/titles/ChangeBlockType";
import { TitreStyle } from '@/types/plan/types'

const data = createSlice({
  name: "data",
  initialState: {
    bold: false,
    underline: false,
    italic: false,
    fontSize: undefined as number | undefined,
    fontFamily: undefined as undefined | string,
    fontColor: undefined as undefined | string,
    backgroundColor: undefined as undefined | string,
    textAlign: undefined as undefined | enumTextAlign,
    lineHeight: undefined as undefined | number,
    marginTop: undefined as undefined | number,
    marginBottom: undefined as undefined | number,
    selection: undefined as undefined | { from: number; to: number },
    pages: true as boolean,
    nodeType: undefined as undefined | enumType,
  },
  reducers: {
    setPages: (state, action: PayloadAction<boolean>) => ({
      ...state,
      pages: action.payload,
    }),
    setBold: (state, action: PayloadAction<boolean>) => ({
      ...state,
      bold: action.payload,
    }),
    setUnderline: (state, action: PayloadAction<boolean>) => ({
      ...state,
      underline: action.payload,
    }),
    setItalic: (state, action: PayloadAction<boolean>) => ({
      ...state,
      italic: action.payload,
    }),
    setFontSize: (state, action: PayloadAction<string>) => {
      if (action.payload) {
        const number = Number.parseInt(action.payload);
        if (!Number.isNaN(number))
          return {
            ...state,
            fontSize: number,
          };
      }

      return { ...state, fontSize: undefined };
    },
    setFontFamily: (state, action: PayloadAction<string | undefined>) => ({
      ...state,
      fontFamily: action.payload,
    }),
    setFontColor: (state, action: PayloadAction<string | undefined>) => ({
      ...state,
      fontColor: action.payload,
    }),
    setBackgroundColor: (state, action: PayloadAction<string | undefined>) => ({
      ...state,
      backgroundColor: action.payload,
    }),
    setTextAlign: (
      state,
      action: PayloadAction<enumTextAlign | undefined>
    ) => ({
      ...state,
      textAlign: action.payload,
    }),
    setLineHeight: (state, action: PayloadAction<number | undefined>) => ({
      ...state,
      lineHeight: action.payload,
    }),
    setMarginBottom: (state, action: PayloadAction<number | undefined>) => ({
      ...state,
      marginBottom: action.payload,
    }),
    setMarginTop: (state, action: PayloadAction<number | undefined>) => ({
      ...state,
      marginTop: action.payload,
    }),
    setSelection: (
      state,
      action: PayloadAction<{ from: number; to: number } | undefined>
    ) => ({
      ...state,
      selection: action.payload,
    }),
    setNodeType: (state, action: PayloadAction<undefined | enumType>) => ({
      ...state,
      nodeType: action.payload,
    }),
  },
});

export const {
  setBold,
  setUnderline,
  setItalic,
  setFontSize,
  setNodeType,
  setFontFamily,
  setFontColor,
  setBackgroundColor,
  setTextAlign,
  setLineHeight,
  setMarginBottom,
  setMarginTop,
  setSelection,
  setPages,
} = data.actions;

const pages = createSlice({
  name: "pages",
  initialState: {
    windowName: undefined as undefined | string,
    bornesIds: [] as string[],
  },
  reducers: {
    setWindowName: (state, action: PayloadAction<string | undefined>) => ({
      ...state,
      windowName: action.payload,
    }),
    setBornesIds: (state, action: PayloadAction<string[]>) => ({
      ...state,
      bornesIds: action.payload,
    }),
    filterBornesIds: (state, action: PayloadAction<string[]>) => ({
      ...state,
      bornesIds: state.bornesIds.filter(
        (item) => !action.payload.includes(item)
      ),
    }),
  },
});

export const { setWindowName, setBornesIds, filterBornesIds } = pages.actions;

type typeOfMessage = "info" | "error";
const notifications = createSlice({
  name: "notifications",
  initialState: {
    message: undefined as undefined | string,
    type: undefined as undefined | typeOfMessage,
  },
  reducers: {
    setMessage: (
      state,
      action: PayloadAction<
        { message: string; type: typeOfMessage } | undefined
      >
    ) => action.payload,
  },
});

export const { setMessage } = notifications.actions;

export type TitleStyleType = {
  name: string;
  target: number;
  style: TitreStyle;
};
const TitleStyle = createSlice({
  name: "titleStyle",
  initialState: [
    {
      name: "Default",
      target: 0,
      style: {
        bold: false,
        italic: false,
        underline: false,
        fontSize: "11pt",
        police: "Arial",
        color: "#99a1a9",
        backgroundColor: undefined,
      },
    },
    {
      name: "Titre 1",
      target: 1,
      style: {
        bold: true,
        italic: false,
        underline: false,
        fontSize: "15pt",
        police: "Arial",
        color: "#c00000",
        backgroundColor: undefined,
      },
    },
    {
      name: "Titre 2",
      target: 2,
      style: {
        bold: true,
        italic: false,
        underline: false,
        fontSize: "13pt",
        police: "Arial",
        color: "#c00000",
        backgroundColor: undefined,
      },
    },
    {
      name: "Titre 3",
      target: 3,
      style: {
        bold: false,
        italic: false,
        underline: false,
        fontSize: "12pt",
        police: "Arial",
        color: "#c00000",
        backgroundColor: undefined,
      },
    },
    {
      name: "Titre 4",
      target: 4,
      style: {
        bold: true,
        italic: true,
        underline: false,
        fontSize: "11pt",
        police: "Arial",
        color: "#c00000",
        backgroundColor: undefined,
      },
    },
    {
      name: "Titre 5",
      target: 5,
      style: {
        bold: true,
        italic: true,
        underline: false,
        fontSize: "11pt",
        police: "Arial",
        color: "#c00000",
        backgroundColor: undefined,
      },
    },
    {
      name: "Titre 6",
      target: 6,
      style: {
        bold: true,
        italic: true,
        underline: false,
        fontSize: "11pt",
        police: "Arial",
        color: "#c00000",
        backgroundColor: undefined,
      },
    },
    {
      name: "Titre 7",
      target: 7,
      style: {
        bold: true,
        italic: true,
        underline: false,
        fontSize: "11pt",
        police: "Arial",
        color: "#c00000",
        backgroundColor: undefined,
      },
    },
    {
      name: "Titre 8",
      target: 8,
      style: {
        bold: true,
        italic: true,
        underline: false,
        fontSize: "11pt",
        police: "Arial",
        color: "#c00000",
        backgroundColor: undefined,
      },
    },
    {
      name: "Titre 9",
      target: 9,
      style: {
        bold: true,
        italic: true,
        underline: false,
        fontSize: "11pt",
        police: "Arial",
        color: "#c00000",
        backgroundColor: undefined,
      },
    },
    {
      name: "Titre 10",
      target: 10,
      style: {
        bold: true,
        italic: true,
        underline: false,
        fontSize: "11pt",
        police: "Arial",
        color: "#c00000",
        backgroundColor: undefined,
      },
    },
  ] as TitleStyleType[],
  reducers: {
    changeStyle: (
      state,
      action: PayloadAction<{ style: any; name: string }>
    ) => {
      return state.map((item) =>
        item.name === action.payload.name
          ? { ...item, style: { ...item.style, ...action.payload.style } }
          : item
      );
    },
  },
});

export const { changeStyle } = TitleStyle.actions;
export const selectTitleStyleByTarget = (target: number) =>
  createSelector(
    (state: RootState) => state.titleStyle,
    (titleStyles) => titleStyles.find((item) => item.target === target)
  );

export const store = configureStore({
  reducer: {
    data: data.reducer,
    pages: pages.reducer,
    notifications: notifications.reducer,
    titleStyle: TitleStyle.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
