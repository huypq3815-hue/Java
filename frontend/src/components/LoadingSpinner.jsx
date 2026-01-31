import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingSpinner = ({ tip = 'Đang tải...', fullPage = false }) => {
    const spinnerIcon = <LoadingOutlined style={{ fontSize: 48, color: '#0891b2' }} spin />;

    if (fullPage) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    width: '100%',
                }}
            >
                <Spin indicator={spinnerIcon} tip={tip} />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Spin indicator={spinnerIcon} tip={tip} />
        </div>
    );
};

export default LoadingSpinner;
