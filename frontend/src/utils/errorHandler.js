/**
 * Error Handler & Message Utils
 */
import { message } from 'antd';

export const handleApiError = (error, defaultMessage = 'Đã có lỗi xảy ra!') => {
    let errorMsg = defaultMessage;

    if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        // Xử lý các lỗi cụ thể từ API
        if (data?.message) {
            errorMsg = data.message;
        } else {
            switch (status) {
                case 400:
                    errorMsg = 'Yêu cầu không hợp lệ!';
                    break;
                case 401:
                    errorMsg = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!';
                    break;
                case 403:
                    errorMsg = 'Bạn không có quyền truy cập!';
                    break;
                case 404:
                    errorMsg = 'Không tìm thấy dữ liệu!';
                    break;
                case 409:
                    errorMsg = 'Dữ liệu đã tồn tại!';
                    break;
                case 500:
                    errorMsg = 'Lỗi hệ thống. Vui lòng thử lại sau!';
                    break;
                default:
                    errorMsg = `Lỗi ${status}: ${data?.message || defaultMessage}`;
            }
        }
    } else if (error.request) {
        errorMsg = 'Không thể kết nối tới máy chủ!';
    } else {
        errorMsg = error.message || defaultMessage;
    }

    return errorMsg;
};

export const showErrorMessage = (error, defaultMessage = 'Đã có lỗi xảy ra!') => {
    const errorMsg = handleApiError(error, defaultMessage);
    message.error(errorMsg);
    return errorMsg;
};

export const showSuccessMessage = (msg = 'Thành công!') => {
    message.success(msg);
};

export const showWarningMessage = (msg) => {
    message.warning(msg);
};

export const showInfoMessage = (msg) => {
    message.info(msg);
};
