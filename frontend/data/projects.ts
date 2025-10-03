import type { Project } from "../types";

export const projects: Omit<Project, 'progress' | 'quality'>[] = [
    {
        id: "SINGLE_1",
        name: "Debut Single",
        requiredProgress: 20,
    },
    {
        id: "EP_1",
        name: "Debut EP",
        requiredProgress: 50,
    },
    {
        id: "ALBUM_1",
        name: "Full-Length Album",
        requiredProgress: 100,
    },
    {
        id: "ALBUM_2",
        name: "Sophomore Album",
        requiredProgress: 150,
    }
];