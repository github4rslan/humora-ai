import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const PLANS = ["free", "pro", "business"] as const;
const SUB_STATUS = [
  "active",
  "trialing",
  "past_due",
  "canceled",
  "incomplete",
] as const;

const userSchema = new Schema(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true, index: true },
    plan: { type: String, enum: PLANS, default: "free", required: true },
  },
  { timestamps: true, _id: false }
);

const subscriptionSchema = new Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true, ref: "User" },
    stripeCustomerId: { type: String, required: true },
    stripeSubscriptionId: { type: String, required: true },
    plan: { type: String, enum: PLANS, required: true },
    status: { type: String, enum: SUB_STATUS, required: true },
    currentPeriodEnd: { type: Date, required: true },
  },
  { timestamps: true, _id: false }
);

const usageSchema = new Schema(
  {
    userId: { type: String, required: true, ref: "User" },
    periodStart: { type: Date, required: true },
    wordsUsed: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);
usageSchema.index({ userId: 1, periodStart: 1 }, { unique: true });

const documentSchema = new Schema(
  {
    userId: { type: String, required: true, index: true, ref: "User" },
    tone: { type: String, required: true },
    inputText: { type: String, required: true },
    outputText: { type: String, required: true },
    wordCount: { type: Number, required: true },
  },
  { timestamps: true }
);
documentSchema.index({ userId: 1, createdAt: -1 });

const voiceSampleSchema = new Schema(
  {
    _id: { type: String, required: true },
    sampleText: { type: String, required: true },
  },
  { timestamps: true, _id: false }
);

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: string };
export type SubscriptionDoc = InferSchemaType<typeof subscriptionSchema> & {
  _id: string;
};
export type UsageDoc = InferSchemaType<typeof usageSchema>;
export type DocumentDoc = InferSchemaType<typeof documentSchema>;
export type VoiceSampleDoc = InferSchemaType<typeof voiceSampleSchema> & {
  _id: string;
};

export const User: Model<UserDoc> =
  mongoose.models.User || mongoose.model<UserDoc>("User", userSchema);

export const Subscription: Model<SubscriptionDoc> =
  mongoose.models.Subscription ||
  mongoose.model<SubscriptionDoc>("Subscription", subscriptionSchema);

export const Usage: Model<UsageDoc> =
  mongoose.models.Usage || mongoose.model<UsageDoc>("Usage", usageSchema);

export const Document: Model<DocumentDoc> =
  mongoose.models.Document ||
  mongoose.model<DocumentDoc>("Document", documentSchema);

export const VoiceSample: Model<VoiceSampleDoc> =
  mongoose.models.VoiceSample ||
  mongoose.model<VoiceSampleDoc>("VoiceSample", voiceSampleSchema);
