import { ObjectId } from "mongodb";

export function transformObjectId(item: any): any {
  const transformedItem = [...item];

  // 객체의 모든 필드에서 ObjectId를 찾아 문자열로 변환
  transformedItem.map((i) => {
    if (i._id instanceof ObjectId) {
      i._id = i._id.toString();
    }
  });
  return transformedItem;
}
