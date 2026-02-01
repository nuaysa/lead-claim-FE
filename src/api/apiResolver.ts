import type { AxiosError, AxiosResponse } from "axios";
import { createErrorResponse } from "./customAxios";
import type { ResolverOptions } from "./types/auth";
import type { ErrorResponseData } from "./types/axios";
const apiResolver = async <T>(
  fetcher: () => Promise<AxiosResponse<T>>,
  options?: ResolverOptions
) => {
  try {
    const res = await fetcher();

    if (
      res.request?.responseType === "blob" ||
      res.request?.responseType === "arraybuffer"
    ) {
      return res;
    }

    return res.data;
  } catch (err) {
    const error = err as AxiosError<ErrorResponseData>;
    const errRes = createErrorResponse(error);

    if (options?.throwErrorObject) throw errRes;
    throw new Error(errRes.message);
  }
};

export default apiResolver;
