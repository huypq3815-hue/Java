import React from 'react';
import { Alert, Button, Space } from 'antd';

class ErrorBoundary extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
        hasError: false,
        error: null,
        errorInfo: null
    };
    }

    static getDerivedStateFromError(error) {
    // Cập nhật state để hiển thị fallback UI
    return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
    // Log lỗi ra console để debug
    console.error('ErrorBoundary caught an error: - ErrorBoundary.jsx:21', error, errorInfo);
    
    // Có thể gửi log lên server tracking (Sentry, LogRocket...)
    this.setState({ errorInfo });
    }

    handleReload = () => {
    window.location.reload();
    };

    render() {
    if (this.state.hasError) {
        return (
        <div style={{ 
            padding: '50px', 
            maxWidth: '600px', 
            margin: '100px auto',
            textAlign: 'center' 
        }}>
            <Alert
            message="Đã xảy ra lỗi không mong muốn"
            description={
                <Space direction="vertical" style={{ width: '100%' }}>
                <p>{this.state.error?.message || 'Vui lòng thử lại sau'}</p>
                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                    <details style={{ 
                    textAlign: 'left', 
                    background: '#f5f5f5', 
                    padding: '10px',
                    borderRadius: '4px',
                    maxHeight: '200px',
                    overflow: 'auto'
                    }}>
                    <summary>Chi tiết lỗi (chỉ hiện trong development)</summary>
                    <pre style={{ fontSize: '12px', margin: '10px 0' }}>
                        {this.state.errorInfo.componentStack}
                    </pre>
                    </details>
                )}
                <Button type="primary" onClick={this.handleReload}>
                    Tải lại trang
                </Button>
    </Space>
            }
            type="error"
            showIcon
            />
        </div>
        );
    }

    return this.props.children;
    }
}

export default ErrorBoundary;