import {ApiResponse, ApiResponseData} from '../interfaces/api-response.interface';

/**
 * Wrap all server responses sent via api in a fixed format
 * @param success
 * @param data
 */
export function wrapResponse<T>(success: boolean, data?: ApiResponseData | T): ApiResponse<ApiResponseData | T> {
    return {
        success,
        data
    };
}
