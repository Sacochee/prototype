export type PlanTitle = {
  titre: string;
  level?: number;
  id: string;
};

export type TitlePlanRequestRaw = {
  text: string;
  id: string | null;
  pos: number;
  title?: number | boolean;
}[];

export type TitleProps = {
  selection?: Selection;
  titles: PlanTitle[];
};

export type TitreStyle = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
  backgroundColor: string | undefined;
  police: string;
  fontSize: string;
};
