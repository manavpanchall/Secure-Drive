import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CenteredContainer from "./CenteredContainer";
import { 
  Check, 
  X, 
  Zap, 
  Shield, 
  HardDrive, 
  Globe, 
  Lock, 
  Star,
  ArrowLeft
} from "lucide-react";

export default function UpgradePlan() {
  const { currentUser } = useAuth();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      storage: "15 GB",
      features: [
        { included: true, text: "15 GB Storage" },
        { included: true, text: "Basic File Sharing" },
        { included: true, text: "Standard Security" },
        { included: false, text: "Priority Support" },
        { included: false, text: "Advanced Analytics" },
        { included: false, text: "Custom Branding" },
      ],
      buttonText: "Current Plan",
      buttonVariant: "secondary",
      popular: false,
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/month",
      storage: "100 GB",
      features: [
        { included: true, text: "100 GB Storage" },
        { included: true, text: "Advanced File Sharing" },
        { included: true, text: "Enhanced Security" },
        { included: true, text: "Priority Support" },
        { included: true, text: "Advanced Analytics" },
        { included: false, text: "Custom Branding" },
      ],
      buttonText: "Upgrade to Pro",
      buttonVariant: "primary",
      popular: true,
    },
    {
      name: "Business",
      price: "$29.99",
      period: "/month",
      storage: "1 TB",
      features: [
        { included: true, text: "1 TB Storage" },
        { included: true, text: "Unlimited File Sharing" },
        { included: true, text: "Enterprise Security" },
        { included: true, text: "24/7 Priority Support" },
        { included: true, text: "Advanced Analytics" },
        { included: true, text: "Custom Branding" },
      ],
      buttonText: "Upgrade to Business",
      buttonVariant: "primary",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            to="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade Your Storage Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get more space, enhanced features, and premium support. 
            {currentUser?.email?.includes('@gmail.com') 
              ? " Upgrade your Google-connected account today." 
              : " Upgrade your email account today."}
          </p>
        </div>

        {/* Current Plan Info */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Current Plan</h3>
              <p className="text-gray-600">
                {currentUser?.displayName || currentUser?.email?.split('@')[0]} • Free Plan
              </p>
            </div>
            <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
              15 GB / 15 GB Used
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full" style={{ width: "85%" }}></div>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? "border-primary-500 transform -translate-y-2"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.storage} Storage</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300 mr-3" />
                      )}
                      <span
                        className={
                          feature.included ? "text-gray-700" : "text-gray-400"
                        }
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                    plan.buttonVariant === "primary"
                      ? "btn-primary"
                      : "btn-secondary"
                  }`}
                  disabled={plan.name === "Free"}
                  onClick={() => {
                    if (plan.name !== "Free") {
                      // Handle payment integration here
                      alert(`Upgrading to ${plan.name} plan. Payment integration would be added here.`);
                    }
                  }}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Premium Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <HardDrive className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">More Storage</h3>
              <p className="text-gray-600">Get up to 1TB of secure cloud storage.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enhanced Security</h3>
              <p className="text-gray-600">Military-grade encryption for all your files.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Faster Uploads</h3>
              <p className="text-gray-600">Unlimited bandwidth and faster transfer speeds.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Access</h3>
              <p className="text-gray-600">Access your files from anywhere in the world.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I switch plans anytime?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and Google Pay for Google accounts."
              },
              {
                q: "Is there a free trial for paid plans?",
                a: "Yes, we offer a 14-day free trial for all paid plans. No credit card required."
              },
              {
                q: "How is my data protected?",
                a: "All files are encrypted using AES-256 encryption, both in transit and at rest."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}