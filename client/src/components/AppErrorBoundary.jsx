import React from 'react';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Store component stack so users can report it
    this.setState({ info });
    // Log to console and optionally to external service
    try {
      console.error('AppErrorBoundary caught:', error, info);
      // Example: send to analytics / logging endpoint
      // fetch('/api/v1/logs/client-error', { method: 'POST', body: JSON.stringify({ error: error.toString(), info }), headers: { 'Content-Type': 'application/json' } });
    } catch (e) {
      // ignore logging failures
    }
  }

  handleRetry = () => {
    // try to unmount the error state first; if that doesn't clear, reload
    this.setState({ hasError: false, error: null, info: null }, () => {
      // small delay to let React re-render
      setTimeout(() => window.location.reload(), 150);
    });
  };

  handleCopy = async () => {
    const { error, info } = this.state;
    const payload = `Error: ${error?.toString() || 'N/A'}\n\nStack:\n${info?.componentStack || 'N/A'}`;
    try {
      await navigator.clipboard.writeText(payload);
      alert('Error details copied to clipboard');
    } catch (e) {
      // fallback: show prompt
      window.prompt('Copy error details', payload);
    }
  };

  handleReport = () => {
    const { error, info } = this.state;
    const subject = encodeURIComponent('App error report');
    const body = encodeURIComponent(`Error: ${error?.toString() || ''}\n\nStack:\n${info?.componentStack || ''}\n\nURL: ${window.location.href}`);
    // open mail client
    window.location.href = `mailto:support@recharge.com?subject=${subject}&body=${body}`;
  };

  render() {
    if (this.state.hasError) {
      const errText = this.state.error ? (this.state.error.toString()) : 'Unknown error';
      return (
        <div style={{ padding: 24, maxWidth: 760, margin: '40px auto', background: '#fff', borderRadius: 8, boxShadow: '0 6px 24px rgba(0,0,0,0.06)' }}>
          <h2 style={{ marginTop: 0 }}>Something went wrong</h2>
          <p style={{ color: '#444' }}>We encountered an unexpected error. You can try reloading the app, copy the error details, or report the issue to support.</p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f7f7f7', padding: 12, borderRadius: 6, fontSize: 12, overflowX: 'auto' }}>{errText}</pre>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={this.handleRetry} style={{ padding: '8px 12px', background: '#0066ff', color: '#fff', border: 'none', borderRadius: 6 }}>Reload App</button>
            <button onClick={() => window.location.href = '/'} style={{ padding: '8px 12px', background: '#eee', border: 'none', borderRadius: 6 }}>Go Home</button>
            <button onClick={this.handleCopy} style={{ padding: '8px 12px', background: '#222', color: '#fff', border: 'none', borderRadius: 6 }}>Copy Details</button>
            <button onClick={this.handleReport} style={{ padding: '8px 12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: 6 }}>Report to Support</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
