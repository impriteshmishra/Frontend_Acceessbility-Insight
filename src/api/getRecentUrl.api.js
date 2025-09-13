import axiosInstance from "../utils/axiosInstance.js";

export const getRecentUrl = async (clerkId)=>{
       const response = await axiosInstance.post(
        "/api/v1/recent/url", {clerkId}
       );
       return response;
}
