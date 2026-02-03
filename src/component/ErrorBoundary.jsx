import React from 'react';

/**
 * Gallery 등 특정 컴포넌트 렌더링 에러를 포착하는 Error Boundary
 * 마운트 실패 시 에러 메시지를 화면에 표시하여 원인 파악 가능
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 24,
            margin: 16,
            border: '1px solid #e74c3c',
            borderRadius: 8,
            background: '#fdf2f2',
            fontFamily: 'monospace',
            fontSize: 14,
          }}
        >
          <h3 style={{ color: '#c0392b', marginTop: 0 }}>갤러리 로드 실패</h3>
          <p style={{ color: '#555' }}>{this.state.error?.message}</p>
          {this.state.errorInfo?.componentStack && (
            <pre
              style={{
                overflow: 'auto',
                maxHeight: 200,
                fontSize: 12,
                background: '#fff',
                padding: 12,
                borderRadius: 4,
              }}
            >
              {this.state.errorInfo.componentStack}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
