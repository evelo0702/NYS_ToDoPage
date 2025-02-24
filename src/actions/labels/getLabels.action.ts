import { transformObjectId } from "@/src/lib/changeStringId";
import { connectDB } from "@/src/lib/mongodb";

export async function getLabelsAction() {
  const db = (await connectDB).db(process.env.MONGO_DBNAME);
  const labelsCollection = db.collection("labels");
  const labels = await labelsCollection.find().toArray();
  const result = transformObjectId(labels);
  return result;
}
