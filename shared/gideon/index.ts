// Motor do Gideon: lógica pura, compartilhada entre o navegador e (futuramente) o Worker
export { getGuideIndex } from "./guideIndex";
export { describeGuideScope, respondLocally, toFallbackResponse } from "./respond";
export { formatReturnTime } from "./messages";
export { getSuggestedQuestions } from "./suggestions";
export type * from "./types";
