import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CampusCart ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('campuscart_view');
      sessionStorage.clear();
    } catch (_) {}
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 sm:p-8 text-center text-slate-800">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl font-bold">
              🛒
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Something went wrong
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              We encountered an unexpected display issue. Don't worry, your account and database items are safe.
            </p>
            {this.state.error && (
              <details className="text-left text-[11px] text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 cursor-pointer overflow-x-auto">
                <summary className="font-bold cursor-pointer">Error Details</summary>
                <pre className="mt-1 font-mono text-[10px] whitespace-pre-wrap">{this.state.error.message || String(this.state.error)}</pre>
              </details>
            )}
            <div className="pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs inline-flex items-center justify-center gap-2"
              >
                <span>← Back to Marketplace</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
