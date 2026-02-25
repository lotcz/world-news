import {EntityWithName} from "zavadil-ts-common";

export type CountryBase = EntityWithName & {
	createOverview: boolean;
}

export type Country = CountryBase & {}
