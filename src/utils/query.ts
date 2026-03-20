import groq from 'groq';
const PAGE_SIZE = 48;

type GroqArgs = {
    filter?: string;
    page?: number;
};

export const imageGroqQuery = (args: GroqArgs) => {
    const { filter, page } = args;

    const queryFilter = `_type == "catimage"` + (filter ? ` && ${filter}` : "");
    const range =
        page || page === 0
            ? `[${page * PAGE_SIZE}...${(page + 1) * PAGE_SIZE}]`
            : "";

    return groq`{
    "images":
      *[${queryFilter}] | order(_createdAt desc)${range} {
      "cats": cat[]->{name, birthDate, passingDate, "iconUrl": icon.asset->url, nicknames},
      "id":_id,
      "url": img.asset->url,
      "width": img.asset->metadata.dimensions.width,
      "height": img.asset->metadata.dimensions.height,
      "blurData": img.asset->metadata.lqip,
      "_createdAt": _createdAt,
      takenAt,
  }}`;
};

export const imageCountGroqQuery = ({ cat }: { cat?: string }) => {
    //query for pictures with single cat
    let queryFilter = cat ? `"${cat}" in cat[]->name && length(cat) == 1` : "";

    if (cat === "all") {
        queryFilter = `length(cat) > 1`;
    }
    return groq`{
    "count": count(*[_type == "catimage" ${queryFilter ? `&& ${queryFilter}` : ""}]),
  }`;
};