import { BlacklistEntity } from "../entities";

export interface NewBlacklisted extends Omit<BlacklistEntity, "id"> {}