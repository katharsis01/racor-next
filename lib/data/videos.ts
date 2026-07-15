export interface VideoItem {
  id: string;
  title: string;
  description: string;
  src: string;
  poster: string;
}

export const videos: VideoItem[] = [
  {
    id: "racor-ropa-ciclista-personalizada",
    title: "RACOR · Ropa ciclista personalizada",
    description:
      "Una mirada a la identidad RACOR, las equipaciones personalizadas y la pasión por el ciclismo que hay detrás de cada proyecto.",
    src: "https://storage.googleapis.com/d_images/Video/2675/976/video_racor--1.mp4",
    poster: "/assets/racor/navafria-1.webp",
  },
];
