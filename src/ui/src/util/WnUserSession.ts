import {createContext} from "react";

export class WnUserSession {
	theme: string = "dark";
}

export const WnUserSessionContext = createContext(new WnUserSession());


export type WnUserSessionUpdate = ((s: WnUserSession) => any) | null;

export const WnUserSessionUpdateContext = createContext<WnUserSessionUpdate>(null);
