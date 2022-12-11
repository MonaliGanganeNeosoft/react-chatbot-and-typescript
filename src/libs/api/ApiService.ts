import axiosInstance from './AxiosInstance';

export const get = async (endpoint: string, params?: string): Promise<any> => {
  try {
    const response: any = await axiosInstance.get(endpoint);
    return response;
  } catch (error) {
    console.error({error});
  }
};

export const post = async (endpoint: string, data: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(endpoint, data);
    return response;
  } catch (err) {
    console.error({err});
  }
};

export async function patch(endpoint: string, data: any) {
  try {
    const response = await axiosInstance.patch(endpoint, data);
    return response;
  } catch (err) {
    console.error({err});
  }
}

export async function put(endpoint: string, data: any) {
  try {
    const response = await axiosInstance.put(endpoint, data);
    return response;
  } catch (err) {
    console.error({err});
  }
}
export async function del(endpoint: string, data: any) {
  try {
    const response = await axiosInstance.delete(endpoint, data);
    return response;
  } catch (error) {
    console.error({error});
  }
}
