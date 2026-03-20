import { type ImageWithDimensions } from "../../types/types";
import GalleryItem from "./GalleryItem.tsx";
import React from "react";
import Modal from "../UI/Modal.tsx";
import SelectRandomCat from "../cat/SelectRandomCat.tsx";
import useHandleClickOutsideImage from "../../hooks/useHandleClickOutsideImage.tsx";
import { sortImagesIntoColumns } from "../../utils/sortIntoColumns.ts";
import Spinner from "../UI/Spinner.tsx";
import { type Cat } from "../../types/types";
import CatCount from "../cat/CatCount.tsx";
import { PAGE_SIZE } from "../../utils/constants.ts";

type Props = {
    cat: Cat | null;
    isDetail?: boolean;
    images: Array<ImageWithDimensions>;
    catImageCount: number;
};

const Gallery = ({ cat, isDetail, images, catImageCount }: Props) => {
    //Determine if we should fetch all images or only images of a specific cat
    let queryArg = undefined;
    if (isDetail) {
        queryArg = cat?.name ?? "all";
    }

    /* STATE */
    const [selectedImage, setSelectedImage] =
        React.useState<ImageWithDimensions | null>(null);
    const [allImages, setAllImages] = React.useState<Array<ImageWithDimensions>>(images);
    const [columnsMobile, setColumnsMobile] = React.useState<
        Array<Array<ImageWithDimensions>>
    >(() => sortImagesIntoColumns(images, 2));
    const [columnsDesktop, setColumnsDesktop] = React.useState<
        Array<Array<ImageWithDimensions>>
    >(() => sortImagesIntoColumns(images, 4));
    const [page, setPage] = React.useState(0);
    const [isFetchingNextPage, setIsFetchingNextPage] = React.useState(false);

    const hasMoreImages = (page + 1) * PAGE_SIZE < catImageCount;

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

    async function fetchNextPage() {
        console.log('fetching next page', page + 1);
        setIsFetchingNextPage(true);
        const catParam = cat === null ? "" : `&cat=${cat?.name ?? "all"}`;
        const nextImages = await fetch(`/api/images?page=${page + 1}${catParam}`);
        const data = await nextImages.json();
        const newImages = [...allImages, ...data.images];
        setPage(page + 1);
        setAllImages(newImages);
        setColumnsMobile(sortImagesIntoColumns(newImages, 2));
        setColumnsDesktop(sortImagesIntoColumns(newImages, 4));
        setIsFetchingNextPage(false);
    }

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

            {hasMoreImages && (
                <div className="flex justify-center my-6">
                    <button
                        className="flex gap-2 cursor-pointer rounded-xl text-slate-950 border-2 border-slate-600 bg-white py-2.5 px-5 transition-colors duration-300 hover:bg-slate-50 md:text-base"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        {isFetchingNextPage ? "Loading..." : "Load more"}
                        {isFetchingNextPage && <Spinner />}
                    </button>
                </div>)}

        </>
    );
};

export default Gallery;
