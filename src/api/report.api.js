// /api/v1/report

import axiosInstance from "../utils/axiosInstance";


export const downloadAccessbilityReport = async (results) => {
  // console.log("api",url)
  const response = await axiosInstance.post(
    "/api/v1/report/download",
     results,
     {responseType: "blob"}
  );
  // console.log("api response", response.data);
  

  return response;
}