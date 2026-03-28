import React from "react";
import { sortVideosIntoColumns } from "../../utils/sortIntoColumns";
import { useColumns } from "../../hooks/useColumns";
import { type Video } from "../../types/types";
import { VIDEO_PAGE_SIZE } from "../../utils/constants";
import Spinner from "../UI/Spinner";
import GalleryActions from "../gallery/GalleryActions.tsx";

const VideosOverview = ({ videos, catVideoCount }: { videos: Array<Video>, catVideoCount: number }) => {
    const [columns, setColumns] = React.useState<Array<Array<Video>>>(() =>
        sortVideosIntoColumns(videos, 3)
    );

    const [page, setPage] = React.useState(0);
    const [isFetchingNextPage, setIsFetchingNextPage] = React.useState(false);

    const hasMoreVideos = (page + 1) * VIDEO_PAGE_SIZE < catVideoCount;

    //determine how many columns to display based on screen width
    const columnCount = useColumns();

    React.useEffect(() => {
        setColumns(sortVideosIntoColumns(videos, columnCount));
    }, [videos, columnCount]);

    async function fetchNextPage() {
        setIsFetchingNextPage(true);
        const nextVideos = await fetch(`/api/videos?page=${page + 1}`);
        const data = await nextVideos.json();
        const newVideos = [...videos, ...data];
        setPage(page + 1);
        setColumns(sortVideosIntoColumns(newVideos, columnCount));
        setIsFetchingNextPage(false);
    }

    return (
        <>
            {/*each column is an array of videos that should be displayed as a flex column, 
      so we can use break-inside-avoid to prevent videos from being taken out of their column*/}
            <div className="columns-1 gap-5 sm:columns-2 md:columns-3">
                {columns.map((column, idx) => (
                    <div
                        key={idx}
                        className="group flex flex-col gap-3 items-center break-inside-avoid"
                    >
                        {column.map((video, idx) => (
                            <div key={video.id} className="relative">
                                {video.takenAt && (
                                    <GalleryActions isLongPress={false} takenAt={video.takenAt} isVideo={true} />
                                )}
                                <video
                                    width={video.width}
                                    height={video.height}
                                    controls
                                    className="rounded-xl"
                                >
                                    <source src={video.url} type="video/mp4" />
                                </video>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {hasMoreVideos && (
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

export default VideosOverview;