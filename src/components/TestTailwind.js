import React from 'react';

export default function TestTailwind() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-700 mb-6">
          Tailwind CSS is Working! 🎉
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Primary Colors
            </h2>
            <div className="space-y-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div
                  key={shade}
                  className={`flex items-center justify-between p-3 rounded-lg bg-primary-${shade}`}
                >
                  <span className="font-medium">primary-{shade}</span>
                  <span className="text-sm opacity-75">bg-primary-{shade}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Buttons
            </h2>
            <div className="space-y-4">
              <button className="btn-primary w-full">
                Primary Button
              </button>
              <button className="btn-secondary w-full">
                Secondary Button
              </button>
              <button className="btn-danger w-full">
                Danger Button
              </button>
              <button className="btn-outline w-full">
                Outline Button
              </button>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Form Elements
            </h2>
            <div className="space-y-4">
              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Alerts
            </h2>
            <div className="space-y-3">
              <div className="alert-success">
                This is a success alert!
              </div>
              <div className="alert-danger">
                This is a danger alert!
              </div>
              <div className="alert-info">
                This is an info alert!
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 card">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Responsive Grid
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-primary-100 rounded-lg flex items-center justify-center"
              >
                <span className="font-medium text-primary-700">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}