import {UserAlerts} from "zavadil-ts-common";
import {createContext} from "react";

export class WnUserAlerts extends UserAlerts {

}

export const WnUserAlertsContext = createContext(new WnUserAlerts());
