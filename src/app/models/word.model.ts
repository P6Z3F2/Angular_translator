import { TR } from "./tr.model";

/**
 * A szónak az interfésze, másik nyelvi szavakkal(tr)
 */
export interface Word {
    text: string;
    pos: string;
    tr: TR[];
}
