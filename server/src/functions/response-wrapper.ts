import {ApiResponse, ApiResponseData} from '../interfaces/api-response.interface';

/**
 * wrapper for all responses send via api to have a fixed format
 */
export function wrapResponse<T>(success: boolean, data?: ApiResponseData | T): ApiResponse<ApiResponseData | T> {
    return {
        success,
        data
    };
}
