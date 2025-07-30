import { myAxios } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

// Just a simple GET endpoint to check auth
const getSession = async () => {
    try {
        const res = await myAxios.get("/auth/get-me");
        return res.data; // { authenticated: true, user: {...} } or { authenticated: false }
    } catch (error) {
        console.log(error)
    }
};

const useSession = () => {
    return useQuery({
        queryKey: ["session"],
        queryFn: getSession,
        refetchOnWindowFocus: false,
        retry: false,
    });
};

export default useSession;
