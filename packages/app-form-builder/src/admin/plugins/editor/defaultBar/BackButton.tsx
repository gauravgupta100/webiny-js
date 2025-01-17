import React from "react";
import { IconButton } from "@webiny/ui/Button";
import { ReactComponent as BackIcon } from "./icons/round-arrow_back-24px.svg";
import { css } from "emotion";
import { useRouter } from "@webiny/react-router";
import { match } from "react-router";

const backStyles = css({
    marginLeft: -10
});

interface MatchedTypeValues {
    id?: string;
}
type MatchedType = match<MatchedTypeValues> | null;

const BackButton = React.memo(() => {
    const router = useRouter();

    const matched: MatchedType = router.match;

    const { id }: MatchedTypeValues = matched ? matched.params : {};

    return (
        <IconButton
            data-testid="fb-editor-back-button"
            className={backStyles}
            onClick={() => router.history.push(`/form-builder/forms?id=${id}`)}
            icon={<BackIcon />}
        />
    );
});

BackButton.displayName = "BackButton";

export default BackButton;
