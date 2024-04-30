import {IsNonEmptyArray} from "../Utils/Utils";

export const FilterItems = (items, minMatchScore=60) => {
    if (!IsNonEmptyArray(items)) {
        return [];
    }

    return items.filter((item) => item?.match_score && item.match_score >= minMatchScore);
}