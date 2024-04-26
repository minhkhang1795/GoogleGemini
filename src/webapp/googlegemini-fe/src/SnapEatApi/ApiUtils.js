import {IsArray} from "../Utils/Utils";

export const FilterItems = (items, minMatchScore=60) => {
    if (!IsArray(items)) {
        return [];
    }

    return items.filter((item) => item?.match_score && item.match_score >= minMatchScore);
}