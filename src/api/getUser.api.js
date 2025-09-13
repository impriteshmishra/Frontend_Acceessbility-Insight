import axiosInstance from "../utils/axiosInstance";


export const getUser = async (userId) => {
    // console.log("api",url)
    const response = await axiosInstance.get(
        `/api/v1/user/get/${userId}`
    );
    // console.log("api response", response.data);


    return response;
}