import React from "react";
import { type Cat, type ImageWithDimensions } from "../../types/types";
import Gallery from "../gallery/Gallery.tsx";
import useWindowSize from "../../hooks/useWindowSize.tsx";
import Confetti from "react-confetti";
import Bio from "./Bio.tsx";
import { checkBirthday } from "../../utils/checkBirthday";

const CatOverview = ({
    cat,
    isDetail = false,
    images,
    catImageCount,
}: {
    cat: Cat | null;
    isDetail: boolean;
    images: Array<ImageWithDimensions>;
    catImageCount: number;
}) => {
    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const [showConfetti, setShowConfetti] = React.useState(false);

    React.useEffect(() => {
        const istBirthday = checkBirthday(cat?.birthDate);

        if (istBirthday) {
            setShowConfetti(true);
        } else {
            setShowConfetti(false);
        }
    }, [cat]);

    return (
        <>
            {showConfetti && <Confetti width={windowWidth} height={windowHeight} />}
            {cat && <Bio cat={cat} key={cat.name} imageCount={catImageCount} />}
            <Gallery cat={cat} isDetail={isDetail} images={images} catImageCount={catImageCount} />
        </>
    );
};

export default CatOverview;
