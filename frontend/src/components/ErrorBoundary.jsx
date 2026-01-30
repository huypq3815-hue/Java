import { Component } from 'react';
import { Result, Button, Card } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        console.error('❌ Error caught by boundary:', error);
        console.error('Error Info:', errorInfo);

        this.setState({
            error,
            errorInfo
        });

        // Could send to error tracking service here
        // Example: logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
        // Reload page
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '40px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Card style={{ maxWidth: '600px', width: '100%' }}>
                        <Result
                            status="error"
                            title="Đã xảy ra lỗi"
                            subTitle="Hệ thống gặp sự cố không mong muốn. Vui lòng tải lại trang."
                            extra={
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<ReloadOutlined />}
                                    onClick={this.handleReset}
                                >
                                    Tải lại trang
                                </Button>
                            }
                        />

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#fff2e8', borderRadius: '4px' }}>
                                <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                                    <strong>Chi tiết lỗi (chỉ hiển thị ở chế độ development):</strong>
                                </p>
                                <pre style={{ fontSize: '11px', overflow: 'auto', maxHeight: '200px' }}>
                                    {this.state.error.toString()}
                                    {'\n\n'}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </div>
                        )}
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
