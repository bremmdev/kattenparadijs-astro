import React from "react";
import { sortVideosIntoColumns } from "../../utils/sortIntoColumns";
import { useColumns } from "../../hooks/useColumns";
import { type Video } from "../../types/types";
// import GalleryActions from "@/components/Gallery/GalleryActions";

const VideosOverview = ({ videos }: { videos: Array<Video> }) => {
    const [columns, setColumns] = React.useState<Array<Array<Video>>>(() =>
        sortVideosIntoColumns(videos, 3)
    );

    //determine how many columns to display based on screen width
    const columnCount = useColumns();

    React.useEffect(() => {
        setColumns(sortVideosIntoColumns(videos, columnCount));
    }, [videos, columnCount]);

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
                                {/* {video.takenAt && (
                                        <GalleryActions isLongPress={false} takenAt={video.takenAt} isVideo={true} />
                                    )} */}
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
        </>
    );
};

export default VideosOverview;