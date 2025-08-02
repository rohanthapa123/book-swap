import { myAxios } from "../axios";

export const createBookApi = async (data: FormData) => {
    try {
        const response = await myAxios.post("/books", data, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data", // ✅ Let Axios handle the boundary
            },
        });

        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Failed to upload book data: " + error.message);
        } else {
            throw new Error("An unknown error occurred during book upload.");
        }
    }
};

export const getBookApi = async () => {
    try {
        const response = await myAxios.get("/books", {
            withCredentials: true,
        });

        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Failed to get book data: " + error.message);
        } else {
            throw new Error("An unknown error occurred during book fetch.");
        }
    }
};

export const getAuthenticatedBookApi = async () => {
    try {
        const response = await myAxios.get("/books/authenticate", {
            withCredentials: true,
        });

        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Failed to get book data: " + error.message);
        } else {
            throw new Error("An unknown error occurred during book fetch.");
        }
    }
};

export const getBookByIdApi = async ({ id }: {
    id: string
}) => {
    try {
        const response = await myAxios.get(`/books/${id}`, {
            withCredentials: true,
        });

        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Failed to get book data: " + error.message);
        } else {
            throw new Error("An unknown error occurred during book fetch.");
        }
    }
};

export const getOwnBookApi = async () => {
    try {
        const response = await myAxios.get(`/books/mine`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Failed to get book data: " + error.message);
        } else {
            throw new Error("An unknown error occurred during book fetch.");
        }
    }
};

export const getRecommendedBookApi = async () => {
    try {
        const response = await myAxios.get(`/recommendation/content`, {
            withCredentials: true,
        });

        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Failed to get book data: " + error.message);
        } else {
            throw new Error("An unknown error occurred during book fetch.");
        }
    }
};
