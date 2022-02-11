import { useCallback, useState, useMemo, useEffect } from "react";
import get from "lodash/get";
import debounce from "lodash/debounce";
import { useRouter } from "@webiny/react-router";
import { useQuery } from "@apollo/react-hooks";
import { LIST_CONTENT_REVIEWS_QUERY } from "./graphql";
import { ApwContentReview, ApwContentReviewStatus } from "~/types";

const serializeSorters = data => {
    if (!data) {
        return data;
    }
    const [[key, value]] = Object.entries(data);
    return `${key}:${value}`;
};

interface Config {
    sorters: { label: string; value: string }[];
}

interface UseContentReviewsListHook {
    (config: Config): {
        loading: boolean;
        contentReviews: Array<ApwContentReview>;
        filter: string;
        setFilter: (filter: string) => void;
        sort: string;
        setSort: (sort: string) => void;
        serializeSorters: (data: Record<string, string>) => string;
        editContentReview: (id: string) => void;
        status: ApwContentReviewStatus | "all";
        setStatus: (status: ApwContentReviewStatus | "all") => void;
    };
}

export const useContentReviewsList: UseContentReviewsListHook = (config: Config) => {
    const defaultSorter = config.sorters.length ? config.sorters[0].value : null;
    const [filter, setFilter] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [sort, setSort] = useState<string>(defaultSorter);
    const [status, setStatus] = useState<ApwContentReviewStatus | "all">("all");
    const { history } = useRouter();

    const performSearch = useMemo(() => {
        return debounce(value => setTitle(value), 250);
    }, []);
    /**
     * Perform debounced search whenever "filter" changes.
     */
    useEffect(() => {
        performSearch(filter);
    }, [filter]);

    const where = {
        status: status === "all" ? undefined : status,
        title_contains: title ? title : undefined
    };

    const listQuery = useQuery(LIST_CONTENT_REVIEWS_QUERY, {
        variables: {
            where: where,
            sort: [sort]
        }
    });

    const data = listQuery.loading ? [] : get(listQuery, "data.apw.listContentReviews.data");

    const loading = [listQuery].some(item => item.loading);

    const baseUrl = "/apw/content-reviews";

    const editContentReview = useCallback((id: string) => {
        history.push(`${baseUrl}/${encodeURIComponent(id)}`);
    }, []);

    return {
        contentReviews: data,
        loading,
        filter,
        setFilter,
        sort,
        setSort,
        serializeSorters,
        editContentReview,
        status,
        setStatus
    };
};