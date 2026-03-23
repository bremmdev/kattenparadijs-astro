import { type Cat } from "../types/types";

const banners = {
    daantje: '/daantje_banner.webp',
    flynn: '/flynn_banner.webp',
    moos: '/moos_banner.webp',
    norris: '/norris_banner.webp',
};

export const getBanner = (cat?: Cat) => {
    return cat ? banners[cat.name as keyof typeof banners] : null;
};
