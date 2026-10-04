import React, { Component } from 'react';

export class AppErrorBoundary extends Component {
  constructor(componentProperties) {
    super(componentProperties);
    this.state = {
      hasCapturedError: false,
      capturedErrorMessage: ''
    };
  }

  static getDerivedStateFromError(encounteredError) {
    return {
      hasCapturedError: true,
      capturedErrorMessage: encounteredError?.message || 'Error inesperado al cargar la aplicación'
    };
  }

  componentDidCatch(encounteredError, errorComponentStackInfo) {
    console.error('AppErrorBoundary caught an exception:', encounteredError, errorComponentStackInfo);
  }

  handleReloadApplication = () => {
    try {
      localStorage.removeItem('san_joaquin_cart_items');
    } catch (storageClearError) {
      // Proceed without breaking
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasCapturedError) {
      return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#114B2B] flex items-center justify-center mb-4 border border-emerald-200">
            <span className="material-symbols-outlined text-3xl">storefront</span>
          </div>

          <h1 className="text-xl font-black text-neutral-900 mb-2">
            Quesería San Joaquín
          </h1>

          <p className="text-sm text-neutral-600 mb-4 max-w-sm">
            Ocurrió un inconveniente al cargar el catálogo en este dispositivo.
          </p>

          <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3 rounded-xl mb-6 max-w-md text-left font-mono break-all">
            {this.state.capturedErrorMessage}
          </div>

          <button
            type="button"
            onClick={this.handleReloadApplication}
            className="bg-[#114B2B] hover:bg-[#0c3820] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Recargar tienda
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
