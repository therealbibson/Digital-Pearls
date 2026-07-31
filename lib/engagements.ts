import { ObjectId, type Collection } from "mongodb";
import { getDb } from "./mongodb";

export type EngagementDoc = {
  _id: ObjectId;
  label: string;
  order: number;
  active: boolean;
};

/** Shape returned to clients (id as string). */
export type Engagement = {
  id: string;
  label: string;
  order: number;
  active: boolean;
};

/** The original hardcoded options — used to seed the collection on first run. */
const SEED_LABELS = [
  "Enterprise Architecture",
  "Data Management",
  "Cloud Computing",
  "Staff Augmentation",
  "Architecture Audit",
  "Project Mandate",
  "Ongoing Advisory",
  "General Inquiry",
  "Not sure yet",
];

async function collection(): Promise<Collection<EngagementDoc>> {
  const db = await getDb();
  return db.collection<EngagementDoc>("engagements");
}

function toEngagement(doc: EngagementDoc): Engagement {
  return {
    id: doc._id.toString(),
    label: doc.label,
    order: doc.order,
    active: doc.active,
  };
}

/** Insert the default options the first time the collection is empty. */
export async function seedIfEmpty(): Promise<void> {
  const col = await collection();
  const count = await col.countDocuments();
  if (count > 0) return;
  await col.insertMany(
    SEED_LABELS.map((label, i) => ({
      _id: new ObjectId(),
      label,
      order: i,
      active: true,
    }))
  );
}

/**
 * List engagements ordered by `order`.
 * @param onlyActive when true (public form), hides deactivated options.
 */
export async function listEngagements(onlyActive = false): Promise<Engagement[]> {
  await seedIfEmpty();
  const col = await collection();
  const filter = onlyActive ? { active: true } : {};
  const docs = await col.find(filter).sort({ order: 1 }).toArray();
  return docs.map(toEngagement);
}

export async function createEngagement(label: string): Promise<Engagement> {
  const col = await collection();
  // Place new items at the end.
  const last = await col.find().sort({ order: -1 }).limit(1).toArray();
  const order = last.length ? last[0].order + 1 : 0;
  const doc: EngagementDoc = {
    _id: new ObjectId(),
    label,
    order,
    active: true,
  };
  await col.insertOne(doc);
  return toEngagement(doc);
}

export async function updateEngagement(
  id: string,
  patch: Partial<Pick<Engagement, "label" | "order" | "active">>
): Promise<Engagement | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await collection();
  const set: Partial<EngagementDoc> = {};
  if (typeof patch.label === "string") set.label = patch.label;
  if (typeof patch.order === "number") set.order = patch.order;
  if (typeof patch.active === "boolean") set.active = patch.active;
  if (Object.keys(set).length === 0) return null;
  const result = await col.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: set },
    { returnDocument: "after" }
  );
  return result ? toEngagement(result) : null;
}

export async function deleteEngagement(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const col = await collection();
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
