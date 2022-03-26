import * as moongoose from 'mongoose';

export const PlayerSchema = new moongoose.Schema(
  {
    phoneNumber: { type: String },
    email: { type: String, unique: true },
    name: String,
    ranking: String,
    positionRanking: Number,
    urlPicturePlayer: String,
  },
  { timestamps: true, collection: 'players' },
);
