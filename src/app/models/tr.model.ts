import { Syn } from "./synonyme.model";

/**
 * Ez az interface tartalmaz egy szót és annak szinonímáit
 */
export interface TR {
    text: string;
    syn:Syn[];
}