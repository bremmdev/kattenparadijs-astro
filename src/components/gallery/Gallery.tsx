import { type ImageWithDimensions } from "../../types/types";
import GalleryItem from "./GalleryItem.tsx";
import React from "react";
import Modal from "../UI/Modal.tsx";
import SelectRandomCat from "../cat/SelectRandomCat.tsx";
import useHandleClickOutsideImage from "../../hooks/useHandleClickOutsideImage.tsx";
import { sortImagesIntoColumns } from "../../utils/sortIntoColumns.ts";
// import FetchMoreBtn from "./FetchMoreBtn";
import { type Cat } from "../../types/types";
import CatCount from "../cat/CatCount.tsx";

type Props = {
    cat: Cat | null;
    isDetail?: boolean;
    images: Array<ImageWithDimensions>;
};

const Gallery = ({ cat, isDetail, images }: Props) => {
    //Determine if we should fetch all images or only images of a specific cat
    let queryArg = undefined;
    if (isDetail) {
        queryArg = cat?.name ?? "all";
    }

    const catImageCount = 0

    /* STATE */
    const [selectedImage, setSelectedImage] =
        React.useState<ImageWithDimensions | null>(null);

    const [columnsMobile, setColumnsMobile] = React.useState<
        Array<Array<ImageWithDimensions>>
    >(() => sortImagesIntoColumns(images, 2));

    const [columnsDesktop, setColumnsDesktop] = React.useState<
        Array<Array<ImageWithDimensions>>
    >(() => sortImagesIntoColumns(images, 4));

    const modalRef = React.useRef<HTMLDivElement>(null);

    const handleClose = (e: React.MouseEvent | KeyboardEvent) => {
        if (e instanceof KeyboardEvent && e.key === "Escape") {
            setSelectedImage(null);
            return;
        }

        const img = modalRef.current?.querySelector("img")!;
        const hasClickedOutsideOfImage = useHandleClickOutsideImage(e as React.MouseEvent, img);

        if (hasClickedOutsideOfImage) {
            setSelectedImage(null);
        }
    };

    // React.useEffect(() => {
    //     const columnsMobile = sortImagesIntoColumns(images, 2);
    //     setColumnsMobile(columnsMobile);
    //     const columnsDesktop = sortImagesIntoColumns(images, 4);
    //     setColumnsDesktop(columnsDesktop);
    // }, [data]);

    // only on home page or all cats page as other pages have banner images
    const useLCPImage = !isDetail || queryArg === "all";

    // get the top row and find the tallest image among them
    function getLCPImageId(columns: Array<Array<ImageWithDimensions>>) {
        let topRowImages: Array<ImageWithDimensions> = columns
            .map((c) => c.slice(0, 1))
            .flat();
        if (topRowImages.length === 0) return null;

        const lcpImage = topRowImages.reduce((max, current) => {
            return current.height > max.height ? current : max;
        }, topRowImages[0]); // Default to the first one if all else fails

        return lcpImage.id;
    }

    const mobileLCPImageId = getLCPImageId(columnsMobile);
    const desktopLCPImageId = getLCPImageId(columnsDesktop);


    return (
        <>
            {selectedImage && (
                <Modal ref={modalRef} onClose={handleClose}>
                    <img
                        src={selectedImage.url}
                        width={selectedImage.width}
                        height={selectedImage.height}
                        alt="kat"
                        className="object-contain"
                    />
                </Modal>
            )}

            {!isDetail && (
                <>
                    <SelectRandomCat
                        images={images}
                        setSelectedImage={setSelectedImage}
                    />
                    <CatCount count={catImageCount} />
                </>
            )}

            {/* 
        Each column is an array of images that should be displayed as a flex column, 
        so we can use break-inside-avoid to prevent images from being taken out of their column
        We render the layout twice, once for small screens (2 columns) and once for large screens (4 columns)
        This way we don't have any layout shifts on page load and the images are displayed immediately without loading indicator 
      */}
            <div className="columns-2 gap-5 md:hidden">
                {columnsMobile.map((column, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col gap-3 items-center break-inside-avoid"
                    >
                        {column.map((img, idx) => (
                            <GalleryItem
                                hasPriority={idx < 3}
                                key={img.id}
                                img={img}
                                isLCP={img.id === mobileLCPImageId && useLCPImage}
                                setSelectedImage={setSelectedImage}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/*each column is an array of images that should be displayed as a flex column, 
      so we can use break-inside-avoid to prevent images from being taken out of their column*/}
            <div className="columns-4 gap-5 hidden md:block">
                {columnsDesktop.map((column, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col gap-3 items-center break-inside-avoid"
                    >
                        {column.map((img, idx) => (
                            <GalleryItem
                                hasPriority={idx < 3}
                                key={img.id}
                                img={img}
                                isLCP={img.id === desktopLCPImageId && useLCPImage}
                                setSelectedImage={setSelectedImage}
                            />
                        ))}
                    </div>
                ))}
            </div>
            {/* {hasNextPage && (
        <FetchMoreBtn
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      )} */}
        </>
    );
};

export default Gallery;
