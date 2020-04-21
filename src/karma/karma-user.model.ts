import { Document, Schema } from 'mongoose';

export type KarmaUser = {
  username: string,
  kudos: number,
}

export interface KarmaUserDocument extends Document, KarmaUser { }

export const KarmaUserSchema = new Schema({
  username: { type: String, required: true },
  kudos: { type: Number, default: 0, min: 0 },
});
